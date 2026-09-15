import { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { FlashNoteBanner } from './components/FlashNoteBanner';
import { Hero } from './components/Hero';
import { ScheduleSection } from './components/ScheduleSection';
import { CompetitionsSection } from './components/CompetitionsSection';
import { WinnersSection } from './components/WinnersSection';
import { NominationsDashboard } from './components/NominationsDashboard';
import { AccountsSection } from './components/AccountsSection';
import { AartiSection } from './components/AartiSection';
import { TempleDecorationSection } from './components/TempleDecorationSection';
import { GallerySection } from './components/GallerySection';
import { CommitteeSection } from './components/CommitteeSection';
import { VideoModal } from './components/VideoModal';
import { NotificationModal } from './components/NotificationModal';
import { SearchModal } from './components/SearchModal';
import { SponsorAdBanner } from './components/SponsorAdBanner';
import { StickyBottomAd } from './components/StickyBottomAd';
import { Footer } from './components/Footer';
import { ScrollNavigation } from './components/ScrollNavigation';
import { fetchSponsorAds, SponsorAd, DEFAULT_SPONSOR_ADS } from './services/adService';
import { Capacitor } from '@capacitor/core';
import { 
  fetchAccountsData, 
  fetchNominationsData, 
  fetchNotificationsData,
  fetchTempleDecorationSlides,
  fetchFestivalSchedule,
  fetchSelectedEmcees,
  fetchCompetitionWinners,
  DecorationSlide,
  DEFAULT_DECORATION_SLIDES
} from './services/googleSheetsService';
import { 
  triggerNativePhoneNotification,
  initializeNotificationChannels,
  requestAllNotificationPermissions
} from './services/nativeNotificationService';
import { FALLBACK_ACCOUNTS_DATA, FALLBACK_NOMINATIONS_DATA, FALLBACK_NOTIFICATIONS, FALLBACK_SELECTED_EMCEES, FALLBACK_WINNERS } from './data/fallbackData';
import { FESTIVAL_SCHEDULE } from './data/scheduleData';
import { AccountsData, NominationsDashboardData, NotificationItem, EventItem, SelectedEmcee, CompetitionWinner } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [accounts, setAccounts] = useState<AccountsData>(FALLBACK_ACCOUNTS_DATA);
  const [nominations, setNominations] = useState<NominationsDashboardData>(FALLBACK_NOMINATIONS_DATA);
  const [notifications, setNotifications] = useState<NotificationItem[]>(FALLBACK_NOTIFICATIONS);
  const [schedule, setSchedule] = useState<EventItem[]>(FESTIVAL_SCHEDULE);
  const [scheduleLastUpdated, setScheduleLastUpdated] = useState<string>('');
  const [selectedEmcees, setSelectedEmcees] = useState<SelectedEmcee[]>(FALLBACK_SELECTED_EMCEES);
  const [emceesLastUpdated, setEmceesLastUpdated] = useState<string>('');
  const [winners, setWinners] = useState<CompetitionWinner[]>(FALLBACK_WINNERS);
  const [winnersLastUpdated, setWinnersLastUpdated] = useState<string>('');
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

  // Function to load all Google Sheets data sources (Accounts, Nominations, Notifications, Sponsor Ads)
  const loadSheetsData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const [accRes, nomsRes, notifsRes, adsRes, decorRes, schedRes, emceesRes, winnersRes] = await Promise.allSettled([
        fetchAccountsData(),
        fetchNominationsData(),
        fetchNotificationsData(),
        fetchSponsorAds(),
        fetchTempleDecorationSlides(),
        fetchFestivalSchedule(),
        fetchSelectedEmcees(),
        fetchCompetitionWinners()
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
      }
      if (emceesRes.status === 'fulfilled' && emceesRes.value && emceesRes.value.length > 0) {
        setSelectedEmcees(emceesRes.value);
        setEmceesLastUpdated(timeStr);
      }
      if (winnersRes.status === 'fulfilled' && winnersRes.value && winnersRes.value.length > 0) {
        setWinners(winnersRes.value);
        setWinnersLastUpdated(timeStr);
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

  const handleNavigate = (sectionId: string) => {
    setActiveTab(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetId = sectionId === 'emcees' ? 'selected-emcees' : sectionId;
    const element = document.getElementById(targetId) || document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF7DA] flex flex-col font-sans text-slate-800">
      {/* Sticky Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onRefresh={() => loadSheetsData(true)}
        isRefreshing={isRefreshing}
        isLive={accounts.isLive || nominations.isLive}
        lastUpdated={accounts.lastUpdated || nominations.lastUpdated}
        totalNominations={nominations.totalNominations}
        selectedEmceesCount={selectedEmcees.filter(e => e.status.toLowerCase() === 'selected').length}
        autoSyncEnabled={autoSyncEnabled}
        toggleAutoSync={() => setAutoSyncEnabled(prev => !prev)}
        syncCountdown={syncCountdown}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
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
          nominations={nominations}
        />

        {/* उत्सव अधिकृत प्रायोजक / Official Festival Sponsor Showcase */}
        <SponsorAdBanner 
          variant="mid" 
          ads={sponsorAds}
          onNavigateToCommittee={() => handleNavigate('committee')}
          onRefresh={() => loadSheetsData(true)}
          isRefreshing={isRefreshing}
        />

        {/* GANAPATI TEMPLE & MANDAP DECORATION */}
        <TempleDecorationSection 
          slides={decorationSlides}
          onRefresh={() => loadSheetsData(true)}
          isRefreshing={isRefreshing}
        />

        {/* 12-Day Event Schedule */}
        <ScheduleSection 
          scheduleData={schedule}
          isLoading={isRefreshing}
          onRefresh={() => loadSheetsData(true)}
          lastUpdated={scheduleLastUpdated}
        />

        {/* Games, Competitions & Cultural Programs */}
        <CompetitionsSection
          onOpenVideo={() => setIsVideoModalOpen(true)}
          onNavigateToNominations={() => handleNavigate('nominations')}
          totalNominations={nominations.totalNominations}
          winners={winners}
        />

        {/* 🏆 Official Festival Competition Winners (Google Sheets Datasource) */}
        <WinnersSection
          winners={winners}
          onRefresh={() => loadSheetsData(true)}
          isLoading={isRefreshing}
          lastUpdated={winnersLastUpdated}
        />

        {/* Live Nominations Dashboard (Google Sheets Datasource) */}
        <NominationsDashboard
          data={nominations}
          onRefresh={() => loadSheetsData(true)}
          isRefreshing={isRefreshing}
          syncCountdown={autoSyncEnabled ? syncCountdown : undefined}
          selectedEmcees={selectedEmcees}
          emceesLastUpdated={emceesLastUpdated}
        />

        {/* Accounts & Finance Overview (Google Sheets Datasource) */}
        <AccountsSection
          data={accounts}
          onRefresh={() => loadSheetsData(true)}
          isRefreshing={isRefreshing}
          syncCountdown={autoSyncEnabled ? syncCountdown : undefined}
        />

        {/* Daily Aarti Schedule */}
        <AartiSection />

        {/* Photo Gallery / Memories */}
        <GallerySection />

        {/* Organizing Committee & Contacts */}
        <CommitteeSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Quick Scroll to Top / Bottom Floating Navigation */}
      <ScrollNavigation />

      {/* Dance Video Showcase Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

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
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        accounts={accounts}
        notifications={notifications}
        nominations={nominations}
        schedule={schedule}
        selectedEmcees={selectedEmcees}
        winners={winners}
        onNavigateSection={handleNavigate}
      />

      {/* Real-time Google Sheets Auto-Sync Toast Notification */}
      {lastSyncNotice && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 bg-slate-900/95 text-amber-200 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 border border-amber-400/40 backdrop-blur-md transition-all animate-bounce">
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
