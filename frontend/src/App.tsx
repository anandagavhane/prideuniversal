import { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { FlashNoteBanner } from './components/FlashNoteBanner';
import { Hero } from './components/Hero';
import { ScheduleSection } from './components/ScheduleSection';
import { CompetitionsSection } from './components/CompetitionsSection';
import { TempleDecorationSection } from './components/TempleDecorationSection';
import { CommitteeSection } from './components/CommitteeSection';
import { NotificationModal } from './components/NotificationModal';
import { NominationFormModal } from './components/NominationFormModal';
import { LiveTimeAlertBanner } from './components/LiveTimeAlertBanner';
import { SponsorAdBanner } from './components/SponsorAdBanner';
import { StickyBottomAd } from './components/StickyBottomAd';
import { Footer } from './components/Footer';
import { ScrollNavigation } from './components/ScrollNavigation';
import { ErrorBoundary } from './components/ErrorBoundary';

import { getLocalNominations, mergeParticipantsWithLocalNominations, NominationFormEntry, normalizeCategory, isExcludedCategory } from './services/nominationService';
import { fetchSponsorAds, SponsorAd, DEFAULT_SPONSOR_ADS } from './services/adService';
import { initializeBackButtonService } from './services/backButtonService';
import { useBackButton } from './hooks/useBackButton';
import { Capacitor } from '@capacitor/core';
import { 
  fetchAccountsData, 
  fetchNominationsData, 
  fetchNotificationsData,
  fetchTempleDecorationSlides,
  fetchFestivalSchedule,
  fetchSelectedEmcees,
  fetchCompetitionWinners,
  fetchCompetitionParticipants,
  DecorationSlide,
  DEFAULT_DECORATION_SLIDES
} from './services/googleSheetsService';
import { 
  triggerNativePhoneNotification,
  initializeNotificationChannels,
  requestAllNotificationPermissions
} from './services/nativeNotificationService';
import { FALLBACK_ACCOUNTS_DATA, FALLBACK_NOMINATIONS_DATA, FALLBACK_NOTIFICATIONS, FALLBACK_SELECTED_EMCEES, FALLBACK_WINNERS, FALLBACK_COMPETITION_PARTICIPANTS } from './data/fallbackData';
import { FESTIVAL_SCHEDULE } from './data/scheduleData';
import { AccountsData, NominationsDashboardData, NominationCategoryStat, NotificationItem, EventItem, SelectedEmcee, CompetitionWinner, CompetitionParticipant } from './types';

// Code-split heavy & off-screen components via React.lazy
const WinnersSection = lazy(() => import('./components/WinnersSection').then(m => ({ default: m.WinnersSection })));
const NominationsDashboard = lazy(() => import('./components/NominationsDashboard').then(m => ({ default: m.NominationsDashboard })));
const AccountsSection = lazy(() => import('./components/AccountsSection').then(m => ({ default: m.AccountsSection })));
const AartiSection = lazy(() => import('./components/AartiSection').then(m => ({ default: m.AartiSection })));
const GallerySection = lazy(() => import('./components/GallerySection').then(m => ({ default: m.GallerySection })));
const VideoModal = lazy(() => import('./components/VideoModal').then(m => ({ default: m.VideoModal })));
const SearchModal = lazy(() => import('./components/SearchModal').then(m => ({ default: m.SearchModal })));

function SectionSkeleton({ title }: { title?: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-7 bg-amber-200/50 rounded-xl w-56 mx-auto mb-4"></div>
      <div className="h-4 bg-amber-100/70 rounded-lg w-80 max-w-full mx-auto mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-36 bg-amber-100/40 rounded-2xl border border-amber-200/30"></div>
        <div className="h-36 bg-amber-100/40 rounded-2xl border border-amber-200/30"></div>
        <div className="h-36 bg-amber-100/40 rounded-2xl border border-amber-200/30"></div>
      </div>
      {title && (
        <p className="text-center text-xs font-semibold text-amber-900/50 mt-4 font-marathi">
          {title} लोड होत आहे... (Loading...)
        </p>
      )}
    </div>
  );
}

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [accounts, setAccounts] = useState<AccountsData>(FALLBACK_ACCOUNTS_DATA);
  const [nominations, setNominations] = useState<NominationsDashboardData>(FALLBACK_NOMINATIONS_DATA);
  const [notifications, setNotifications] = useState<NotificationItem[]>(FALLBACK_NOTIFICATIONS);
  const [schedule, setSchedule] = useState<EventItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('cached_festival_schedule');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Error reading cached_festival_schedule:', e);
      }
    }
    return FESTIVAL_SCHEDULE;
  });
  const [scheduleLastUpdated, setScheduleLastUpdated] = useState<string>('');
  const [selectedEmcees, setSelectedEmcees] = useState<SelectedEmcee[]>(FALLBACK_SELECTED_EMCEES);
  const [emceesLastUpdated, setEmceesLastUpdated] = useState<string>('');
  const [winners, setWinners] = useState<CompetitionWinner[]>(FALLBACK_WINNERS);
  const [winnersLastUpdated, setWinnersLastUpdated] = useState<string>('');
  const [competitionParticipants, setCompetitionParticipants] = useState<CompetitionParticipant[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('cached_competition_participants');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Error reading cached_competition_participants:', e);
      }
    }
    return FALLBACK_COMPETITION_PARTICIPANTS;
  });

  // Local user-submitted nominations (persisted in localStorage and exportable to Excel)
  const [localNominations, setLocalNominations] = useState<NominationFormEntry[]>(() => {
    if (typeof window !== 'undefined') {
      return getLocalNominations();
    }
    return [];
  });
  const [isNominationModalOpen, setIsNominationModalOpen] = useState<boolean>(false);
  const [selectedCategoryForNomination, setSelectedCategoryForNomination] = useState<string | undefined>(undefined);

  const handleOpenNominationModal = useCallback((category?: string) => {
    setSelectedCategoryForNomination(category);
    setIsNominationModalOpen(true);
  }, []);

  const handleNominationAdded = useCallback((newEntry: NominationFormEntry) => {
    setLocalNominations(prev => [newEntry, ...prev]);
  }, []);

  // Merge base Google Sheet participants with locally registered entries
  const allMergedParticipants = useMemo(() => {
    return mergeParticipantsWithLocalNominations(competitionParticipants, localNominations);
  }, [competitionParticipants, localNominations]);

  // Dynamically compute nominations statistics directly from allMergedParticipants (Google Sheets roster + local entries)
  const computedNominations = useMemo<NominationsDashboardData>(() => {
    if (!allMergedParticipants || allMergedParticipants.length === 0) {
      return nominations;
    }
    const validParticipants = allMergedParticipants.filter(p => !isExcludedCategory(p.eventCategory));
    const total = validParticipants.length;
    const wingA = validParticipants.filter(p => (p.wing || '').trim().toUpperCase() === 'A').length;
    const wingB = validParticipants.filter(p => (p.wing || '').trim().toUpperCase() === 'B').length;
    const wingAPercent = total > 0 ? `${((wingA / total) * 100).toFixed(1)}%` : '0%';
    const wingBPercent = total > 0 ? `${((wingB / total) * 100).toFixed(1)}%` : '0%';

    const iconMap: Record<string, string> = {
      'Dance': '💃',
      'Drawing': '🎨',
      'Singing': '🎤',
      'Shloka': '📖',
      'Piano Play': '🎹',
      'Emcee / Host': '⭐',
      'Emcee Nomination': '⭐',
      'Drama': '🎭',
      'Fashion Show': '✨',
      'Cooking': '🍲',
      'Rangoli': '🌸'
    };
    (nominations.categories || []).forEach(c => {
      if (isExcludedCategory(c.category)) return;
      const norm = normalizeCategory(c.category);
      if (c.icon) iconMap[norm] = c.icon;
    });

    const catMap = new Map<string, { total: number; wingA: number; wingB: number }>();
    for (const p of validParticipants) {
      const cat = normalizeCategory(p.eventCategory);
      const ex = catMap.get(cat) || { total: 0, wingA: 0, wingB: 0 };
      ex.total += 1;
      const w = (p.wing || '').trim().toUpperCase();
      if (w === 'A') ex.wingA += 1;
      else if (w === 'B') ex.wingB += 1;
      catMap.set(cat, ex);
    }

    const categories: NominationCategoryStat[] = Array.from(catMap.entries()).map(([cat, counts]) => ({
      category: cat,
      nominations: counts.total,
      wingA: counts.wingA,
      wingB: counts.wingB,
      percentOfTotal: total > 0 ? `${((counts.total / total) * 100).toFixed(1)}%` : '0%',
      icon: iconMap[cat] || '🏆'
    })).sort((a, b) => b.nominations - a.nominations);

    return {
      totalNominations: total,
      totalCategories: categories.length,
      wingATotal: wingA,
      wingBTotal: wingB,
      wingAPercent,
      wingBPercent,
      categories,
      lastUpdated: nominations.lastUpdated || 'Live Sync',
      isLive: nominations.isLive ?? true
    };
  }, [allMergedParticipants, nominations]);
  const [sponsorAds, setSponsorAds] = useState<SponsorAd[]>(DEFAULT_SPONSOR_ADS);
  const [decorationSlides, setDecorationSlides] = useState<DecorationSlide[]>(DEFAULT_DECORATION_SLIDES);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('read_notifications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.warn('Error reading read_notifications:', e);
        }
      }
    }
    return [];
  });
  const seenNotificationIdsRef = useRef<Set<string>>(new Set());

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [syncCountdown, setSyncCountdown] = useState<number>(15);
  const [lastSyncNotice, setLastSyncNotice] = useState<string>('');

  const SYNC_INTERVAL = 15; // 15 seconds auto-sync

  // Register mobile hardware and browser back-button handlers for top-level modals
  useBackButton('nomination-modal', isNominationModalOpen, () => setIsNominationModalOpen(false), 100);
  useBackButton('notification-modal', isNotificationModalOpen, () => setIsNotificationModalOpen(false), 90);
  useBackButton('video-modal', isVideoModalOpen, () => setIsVideoModalOpen(false), 80);
  useBackButton('search-modal', isSearchOpen, () => setIsSearchOpen(false), 70);

  // Function to load all Google Sheets data sources (Accounts, Nominations, Notifications, Sponsor Ads)
  const loadSheetsData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const [accRes, nomsRes, notifsRes, adsRes, decorRes, schedRes, emceesRes, winnersRes, partsRes] = await Promise.allSettled([
        fetchAccountsData(),
        fetchNominationsData(),
        fetchNotificationsData(),
        fetchSponsorAds(),
        fetchTempleDecorationSlides(),
        fetchFestivalSchedule(),
        fetchSelectedEmcees(),
        fetchCompetitionWinners(),
        fetchCompetitionParticipants()
      ]);

      if (accRes.status === 'fulfilled') setAccounts(accRes.value);
      if (nomsRes.status === 'fulfilled') setNominations(nomsRes.value);
      if (notifsRes.status === 'fulfilled') {
        const notifs = notifsRes.value;
        setNotifications(notifs);

        // Trigger native phone notifications for newly detected active notices
        notifs.forEach(item => {
          if (item.active && !seenNotificationIdsRef.current.has(item.id)) {
            seenNotificationIdsRef.current.add(item.id);
            if (!readNotificationIds.includes(item.id)) {
              triggerNativePhoneNotification(item);
            }
          }
        });
      }

      if (adsRes.status === 'fulfilled' && adsRes.value && adsRes.value.length > 0) {
        setSponsorAds(adsRes.value);
      }
      if (decorRes.status === 'fulfilled' && decorRes.value && decorRes.value.length > 0) {
        setDecorationSlides(decorRes.value);
      }
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (schedRes.status === 'fulfilled' && schedRes.value && schedRes.value.length > 0) {
        setSchedule(schedRes.value);
        setScheduleLastUpdated(timeStr);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('cached_festival_schedule', JSON.stringify(schedRes.value));
          } catch (e) {
            // ignore
          }
        }
      }
      if (emceesRes.status === 'fulfilled' && emceesRes.value && emceesRes.value.length > 0) {
        setSelectedEmcees(emceesRes.value);
        setEmceesLastUpdated(timeStr);
      }
      if (winnersRes.status === 'fulfilled' && winnersRes.value && winnersRes.value.length > 0) {
        setWinners(winnersRes.value);
        setWinnersLastUpdated(timeStr);
      }
      if (partsRes.status === 'fulfilled' && partsRes.value && partsRes.value.length > 0) {
        setCompetitionParticipants(partsRes.value);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('cached_competition_participants', JSON.stringify(partsRes.value));
          } catch (e) {
            // ignore
          }
        }
      }
      setLastSyncNotice(`Live data updated at ${timeStr}`);
      setTimeout(() => setLastSyncNotice(''), 3500);
    } catch (err) {
      console.warn('Error refreshing Google Sheets data:', err);
    } finally {
      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 400);
      }
    }
  }, []);

  // Initialize native Android notification channels on launch
  useEffect(() => {
    initializeNotificationChannels();
    if (Capacitor.isNativePlatform()) {
      requestAllNotificationPermissions();
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    loadSheetsData(true);
  }, [loadSheetsData]);

  // 1-second interval ticker for countdown & 15-second auto-sync
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const timer = setInterval(() => {
      setSyncCountdown((prev) => {
        if (prev <= 1) {
          // Trigger silent auto-sync
          loadSheetsData(false);
          return SYNC_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoSyncEnabled, loadSheetsData]);

  // Window Focus / Tab Visibility Revalidation (immediate sync on returning to tab)
  useEffect(() => {
    const handleRevalidate = () => {
      if (document.visibilityState === 'visible') {
        loadSheetsData(false);
        setSyncCountdown(SYNC_INTERVAL);
      }
    };

    window.addEventListener('focus', handleRevalidate);
    document.addEventListener('visibilitychange', handleRevalidate);

    return () => {
      window.removeEventListener('focus', handleRevalidate);
      document.removeEventListener('visibilitychange', handleRevalidate);
    };
  }, [loadSheetsData]);

  // Global shortcut for Search (Ctrl+K, Cmd+K, or '/')
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleMarkAllNotificationsAsRead = () => {
    const allActiveIds = notifications.filter(n => n.active).map(n => n.id);
    const combined = Array.from(new Set([...readNotificationIds, ...allActiveIds]));
    setReadNotificationIds(combined);
    if (typeof window !== 'undefined') {
      localStorage.setItem('read_notifications', JSON.stringify(combined));
    }
  };

  const unreadNotificationsCount = notifications.filter(
    n => n.active && !readNotificationIds.includes(n.id)
  ).length;

  const handleNavigate = (target: string, linkText?: string, linkUrl?: string) => {
    if (!target && !linkUrl) return;
    const cleanTarget = (target || '').trim();
    const lower = cleanTarget.toLowerCase();
    const cleanUrl = (linkUrl || '').trim();

    // 1. Explicit Download Action (Link Section = "Download" / "Update")
    if (lower === 'download' || lower === 'update') {
      const downloadTarget = cleanUrl || (linkText && /^https?:\/\//i.test(linkText) ? linkText.trim() : '');
      if (downloadTarget) {
        // Convert Google Drive view URL to direct export download if needed
        const driveMatch = downloadTarget.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        let directUrl = downloadTarget;
        if (driveMatch && driveMatch[1]) {
          directUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
        }
        const link = document.createElement('a');
        link.href = directUrl;
        link.download = 'PrideFestival-Latest.apk';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Fallback: download local APK
      const apkFile = 'PrideFestival-Latest.apk';
      const link = document.createElement('a');
      link.href = `/${apkFile}`;
      link.download = apkFile;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // 2. Explicit Open Action (Link Section = "Open")
    if (lower === 'open') {
      const openTarget = cleanUrl || (linkText && /^https?:\/\//i.test(linkText) ? linkText.trim() : '');
      if (openTarget) {
        window.open(openTarget, '_blank', 'noopener,noreferrer');
        return;
      }
    }

    // 3. Direct URL target (http://, https://, mailto:, tel:)
    if (/^(https?:\/\/|mailto:|tel:)/i.test(cleanTarget)) {
      window.open(cleanTarget, '_blank', 'noopener,noreferrer');
      return;
    }

    // 4. Known section mapping
    const knownSections = [
      'home', 'schedule', 'events', 'schedules', 'vegapathrak',
      'selected-emcees', 'emcee', 'emcees', 'anchors',
      'winners', 'winner', 'vijete',
      'competitions', 'competition', 'games', 'spardha',
      'nominations', 'nomination', 'nondani',
      'accounts', 'account', 'jamakharch',
      'aarti', 'aarati', 'daily-aarti',
      'gallery', 'memories', 'photos', 'chitrashala',
      'committee', 'samiti', 'contacts',
      'temple-decoration', 'decoration', 'mandap', 'temple',
      'sponsors', 'sponsor', 'official-sponsors', 'prayogak'
    ];

    // If a cleanUrl was provided and target is not a known in-app section, open the URL
    if (cleanUrl && !knownSections.includes(lower)) {
      window.open(cleanUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 5. Home Section
    if (lower === 'home') {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 6. Section mapping & smooth scroll
    let targetId = lower;
    if (['events', 'schedule', 'schedules', 'vegapathrak'].includes(lower)) {
      targetId = 'schedule';
    } else if (['emcee', 'emcees', 'anchors', 'selected-emcees'].includes(lower)) {
      targetId = 'competitions';
    } else if (['winner', 'winners', 'vijete'].includes(lower)) {
      targetId = 'winners';
    } else if (['competition', 'competitions', 'games', 'spardha'].includes(lower)) {
      targetId = 'competitions';
    } else if (['nomination', 'nominations', 'nondani'].includes(lower)) {
      targetId = 'nominations';
    } else if (['account', 'accounts', 'jamakharch'].includes(lower)) {
      targetId = 'accounts';
    } else if (['aarti', 'aarati', 'daily-aarti'].includes(lower)) {
      targetId = 'aarti';
    } else if (['gallery', 'memories', 'photos', 'chitrashala'].includes(lower)) {
      targetId = 'gallery';
    } else if (['committee', 'samiti', 'contacts'].includes(lower)) {
      targetId = 'committee';
    } else if (['decoration', 'mandap', 'temple', 'temple-decoration'].includes(lower)) {
      targetId = 'temple-decoration';
    } else if (['sponsor', 'sponsors', 'official-sponsors', 'prayogak'].includes(lower)) {
      targetId = 'sponsors';
    }

    setActiveTab(targetId);
    const element = document.getElementById(targetId) || document.getElementById(cleanTarget);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Initialize hardware, gesture, and browser back-button listener
  useEffect(() => {
    const cleanup = initializeBackButtonService({
      isAtHome: () => {
        return activeTab === 'home' && (typeof window !== 'undefined' ? window.scrollY <= 40 : true);
      },
      onNavigateHome: () => {
        handleNavigate('home');
      },
      showToast: (msg: string) => {
        setLastSyncNotice(msg);
        setTimeout(() => setLastSyncNotice(''), 2500);
      }
    });

    return () => {
      cleanup();
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FEF7DA] flex flex-col font-sans text-slate-800">
      {/* Sticky Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onRefresh={() => loadSheetsData(true)}
        isRefreshing={isRefreshing}
        isLive={accounts.isLive || computedNominations.isLive}
        lastUpdated={accounts.lastUpdated || computedNominations.lastUpdated}
        totalNominations={computedNominations.totalNominations}
        autoSyncEnabled={autoSyncEnabled}
        toggleAutoSync={() => setAutoSyncEnabled(prev => !prev)}
        syncCountdown={syncCountdown}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Real-time Time-Aware Festival Live Alert Popup/Banner (30 mins before, auto-closes after 2 hours) */}
      <LiveTimeAlertBanner 
        schedule={schedule}
        onNavigate={handleNavigate}
      />

      {/* Top Flash Note: Recent Changes Announcement Banner */}
      <FlashNoteBanner 
        onNavigate={handleNavigate} 
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
      />

      {/* Top Premium Sponsor Ribbon */}
      {/* Top Sponsor Ribbon */}
      <SponsorAdBanner 
        variant="top" 
        ads={sponsorAds}
        onNavigateToCommittee={() => handleNavigate('committee')} 
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onNavigate={handleNavigate}
          accounts={accounts}
          nominations={computedNominations}
          schedule={schedule}
        />

        {/* उत्सव विशेष जाहिराती / Festival Special Advertisements Showcase */}
        <SponsorAdBanner 
          variant="mid" 
          ads={sponsorAds}
          onNavigateToCommittee={() => handleNavigate('committee')}
          onRefresh={() => loadSheetsData(true)}
          isRefreshing={isRefreshing}
        />

        {/* FESTIVAL LIVE PHOTOS & VIDEOS SHOWCASE */}
        <ErrorBoundary sectionName="थेट उत्सव क्षणचित्रे व व्हिडिओ (Live Festival Moments & Videos)">
          <TempleDecorationSection 
            slides={decorationSlides}
            onRefresh={() => loadSheetsData(true)}
            isRefreshing={isRefreshing}
          />
        </ErrorBoundary>

        {/* 12-Day Event Schedule */}
        <ErrorBoundary sectionName="उत्सव दिनदर्शिका व कार्यक्रम (Festival Schedule)">
          <ScheduleSection 
            scheduleData={schedule}
            isLoading={isRefreshing}
            onRefresh={() => loadSheetsData(true)}
            lastUpdated={scheduleLastUpdated}
          />
        </ErrorBoundary>

        {/* Games, Competitions & Cultural Programs */}
        <ErrorBoundary sectionName="स्पर्धा व सांस्कृतिक कार्यक्रम (Competitions)">
          <CompetitionsSection
            onOpenVideo={() => setIsVideoModalOpen(true)}
            onNavigateToNominations={() => handleNavigate('nominations')}
            totalNominations={allMergedParticipants.length}
            winners={winners}
            participants={allMergedParticipants}
            onOpenNominationModal={handleOpenNominationModal}
          />
        </ErrorBoundary>

        {/* 🏆 Official Festival Competition Winners (Google Sheets Datasource) */}
        <ErrorBoundary sectionName="स्पर्धा विजेते (Winners)">
          <Suspense fallback={<SectionSkeleton title="स्पर्धा विजेते" />}>
            <WinnersSection
              winners={winners}
              onRefresh={() => loadSheetsData(true)}
              isLoading={isRefreshing}
              lastUpdated={winnersLastUpdated}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Live Nominations Dashboard (Google Sheets Datasource) */}
        <ErrorBoundary sectionName="नोंदणी डॅशबोर्ड (Nominations Dashboard)">
          <Suspense fallback={<SectionSkeleton title="नोंदणी डॅशबोर्ड" />}>
            <NominationsDashboard
              data={computedNominations}
              onRefresh={() => loadSheetsData(true)}
              isRefreshing={isRefreshing}
              syncCountdown={autoSyncEnabled ? syncCountdown : undefined}
              selectedEmcees={selectedEmcees}
              emceesLastUpdated={emceesLastUpdated}
              participants={allMergedParticipants}
              onOpenNominationModal={handleOpenNominationModal}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Accounts & Finance Overview (Google Sheets Datasource) */}
        <ErrorBoundary sectionName="हिशोब व देणगी (Accounts & Finance)">
          <Suspense fallback={<SectionSkeleton title="हिशोब व देणगी" />}>
            <AccountsSection
              data={accounts}
              onRefresh={() => loadSheetsData(true)}
              isRefreshing={isRefreshing}
              syncCountdown={autoSyncEnabled ? syncCountdown : undefined}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Daily Aarti Schedule */}
        <ErrorBoundary sectionName="आरती संग्रह (Aarti Collection)">
          <Suspense fallback={<SectionSkeleton title="आरती संग्रह" />}>
            <AartiSection />
          </Suspense>
        </ErrorBoundary>

        {/* Photo Gallery / Memories */}
        <ErrorBoundary sectionName="छायाचित्रे दालन (Photo Gallery)">
          <Suspense fallback={<SectionSkeleton title="छायाचित्रे दालन" />}>
            <GallerySection />
          </Suspense>
        </ErrorBoundary>

        {/* Organizing Committee & Contacts */}
        <ErrorBoundary sectionName="उत्सव समिती व संपर्क (Organizing Committee)">
          <CommitteeSection />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Quick Scroll to Top / Bottom Floating Navigation */}
      <ScrollNavigation />

      {/* Dance Video Showcase Modal */}
      {isVideoModalOpen && (
        <ErrorBoundary sectionName="व्हिडिओ शोकेस (Video Showcase)">
          <Suspense fallback={null}>
            <VideoModal
              isOpen={isVideoModalOpen}
              onClose={() => setIsVideoModalOpen(false)}
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Announcements & Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        readIds={readNotificationIds}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onNavigate={handleNavigate}
        onRefresh={() => loadSheetsData(true)}
        isRefreshing={isRefreshing}
      />

      {/* Global Festival Search Modal */}
      {isSearchOpen && (
        <ErrorBoundary sectionName="शोध (Search)">
          <Suspense fallback={null}>
            <SearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              accounts={accounts}
              notifications={notifications}
              nominations={computedNominations}
              schedule={schedule}
              selectedEmcees={selectedEmcees}
              winners={winners}
              participants={allMergedParticipants}
              onNavigateSection={handleNavigate}
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Interactive Festival Nomination Registration & Excel Export Modal */}
      <NominationFormModal
        isOpen={isNominationModalOpen}
        onClose={() => setIsNominationModalOpen(false)}
        initialCategory={selectedCategoryForNomination}
        allParticipants={allMergedParticipants}
        localNominations={localNominations}
        onNominationAdded={handleNominationAdded}
      />

      {/* Real-time Google Sheets Auto-Sync Toast Notification */}
      {lastSyncNotice && (
        <div className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] right-4 sm:right-6 z-50 bg-slate-900/95 text-amber-200 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 border border-amber-400/40 backdrop-blur-md transition-all animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold">{lastSyncNotice}</span>
        </div>
      )}

      {/* Mobile Sticky Bottom Sponsor Ad */}
      <StickyBottomAd ads={sponsorAds} />
    </div>
  );
}

export default App;
