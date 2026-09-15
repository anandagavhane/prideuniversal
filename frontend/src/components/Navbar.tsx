import React, { useState, useRef, useEffect } from 'react';
import { 
  Home,
  Calendar, 
  Trophy, 
  ClipboardList,
  Mic,
  Award,
  BarChart3, 
  Flame, 
  Image as ImageIcon, 
  Users, 
  Menu, 
  X, 
  Sparkles,
  RefreshCw,
  Zap,
  Pause,
  Play,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isLive?: boolean;
  lastUpdated?: string;
  totalNominations?: number;
  selectedEmceesCount?: number;
  autoSyncEnabled?: boolean;
  toggleAutoSync?: () => void;
  syncCountdown?: number;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  onOpenSearch?: () => void;
}

// Feature flag: set to true to show the Nomination CTA buttons
const SHOW_NOMINATION_CTA = false;

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  isLive,
  lastUpdated,
  totalNominations,
  selectedEmceesCount = 6,
  autoSyncEnabled,
  toggleAutoSync,
  syncCountdown,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEventsMenuOpen, setIsEventsMenuOpen] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsEventsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (isPinnedOpen) return; // If clicked open, keep it open until click outside or selection
    closeTimeoutRef.current = setTimeout(() => {
      setIsEventsMenuOpen(false);
    }, 250);
  };

  const handleDropdownToggle = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsEventsMenuOpen(prev => {
      const next = !prev;
      setIsPinnedOpen(next);
      return next;
    });
  };

  const closeDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsEventsMenuOpen(false);
    setIsPinnedOpen(false);
  };

  // Close desktop dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // 5 Submenus under Events: 1) Schedules, 2) Competitions, 3) Nominations, 4) Emcees, 5) Winners
  const eventsSubmenu = [
    { 
      id: 'schedule', 
      label: 'Schedules', 
      marathi: '१२ दिवस कार्यक्रम', 
      icon: Calendar,
      desc: 'Full 12-day festival timetable & daily events'
    },
    { 
      id: 'competitions', 
      label: 'Competitions', 
      marathi: 'कला व क्रीडा स्पर्धा', 
      icon: Trophy,
      desc: 'All 7 talent events, rules & competitions'
    },
    { 
      id: 'nominations', 
      label: 'Nominations', 
      marathi: 'नोंदणी डॅशबोर्ड', 
      icon: ClipboardList,
      desc: 'Resident participants, entries & statistics'
    },
    { 
      id: 'emcees', 
      label: 'Emcees', 
      marathi: '६ सूत्रसंचालक', 
      icon: Mic,
      desc: 'Selected festival hosts & stage anchors'
    },
    { 
      id: 'winners', 
      label: 'Winners', 
      marathi: 'स्पर्धा निकाल', 
      icon: Award,
      desc: 'Championship winners & awards list'
    },
  ];

  // Primary navigation: 1) Home, 2) Events (with 5 submenus), 3) Aarti, 4) Memories, 5) Accounts, 6) Committee
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { 
      id: 'schedule', 
      label: 'Events', 
      icon: Calendar, 
      hasSubmenu: true
    },
    { id: 'aarti', label: 'Aarti', icon: Flame },
    { id: 'gallery', label: 'Memories', icon: ImageIcon },
    { id: 'accounts', label: 'Accounts', icon: BarChart3 },
    { id: 'committee', label: 'Committee', icon: Users },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetId = 
      (id === 'events' || id === 'schedule' || id === 'schedules') ? 'schedule' : 
      id === 'emcees' ? 'selected-emcees' : 
      id;
    const element = document.getElementById(targetId) || document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#F5AF19] via-[#FFDC64] to-[#F5AF19] border-b-2 border-amber-600/50 shadow-[0_4px_20px_rgba(245,175,25,0.35)] transition-all">
      {/* Top Auspicious Announcement Bar */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-amber-100 text-xs sm:text-sm py-1.5 px-4 font-medium border-b border-amber-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="truncate flex items-center gap-1.5 font-marathi">
            <span>॥ गणपती बाप्पा मोरया ॥</span>
            <span className="hidden md:inline text-amber-200">| १२ दिवस • भक्ती • संस्कृती • एकोप्याचा उत्सव (१४ - २५ सप्टेंबर २०२६)</span>
          </span>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Auto-Sync Countdown & Status Button */}
            <button
              onClick={toggleAutoSync}
              title={autoSyncEnabled ? `Auto-syncing every 15s. Next sync in ${syncCountdown}s. Click to pause.` : 'Auto-sync is paused. Click to resume.'}
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                autoSyncEnabled 
                  ? 'bg-emerald-950/40 text-emerald-200 border-emerald-400/50 hover:bg-emerald-900/60' 
                  : 'bg-amber-950/40 text-amber-200 border-amber-400/50 hover:bg-amber-900/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoSyncEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>
                {isRefreshing ? 'Syncing...' : autoSyncEnabled ? `Auto-Sync ${syncCountdown}s` : 'Paused'}
              </span>
              {autoSyncEnabled ? (
                <Pause className="w-2.5 h-2.5 opacity-70 hover:opacity-100" />
              ) : (
                <Play className="w-2.5 h-2.5 opacity-70 hover:opacity-100" />
              )}
            </button>

            {/* Live Data Sync Status */}
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-black/25 px-2 py-0.5 rounded-full text-amber-200">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>{isLive ? 'Live' : 'Cached'}</span>
              <span className="text-amber-300/80">({lastUpdated})</span>
            </span>

            {/* Manual Sync Trigger */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Sync latest live data now"
              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 transition-transform active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 py-2">
          {/* Logo / Brand - Circular Emblem */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center focus:outline-none group py-1"
            title="Pride Universal Ganeshotsav 2026 Home"
            aria-label="Pride Universal Ganeshotsav 2026 Home"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-lg border-2 border-amber-400 bg-slate-950 flex items-center justify-center p-0.5 group-hover:scale-105 group-hover:border-amber-300 group-hover:shadow-amber-400/30 transition-all duration-300 ring-2 ring-amber-500/25">
              <img 
                src="/logo.png" 
                alt="Pride Universal Ganeshotsav 2026 Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              // Submenu item for Events (with 5 submenus)
              if (item.hasSubmenu) {
                const isGroupActive = ['events', 'schedule', 'competitions', 'nominations', 'emcees', 'winners'].includes(activeTab);
                return (
                  <div
                    key={item.id}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => {
                        handleNavClick('schedule');
                        closeDropdown();
                      }}
                      className={`relative px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isGroupActive
                          ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-md border-2 border-amber-300 ring-2 ring-amber-400/50 scale-105'
                          : 'text-red-950 hover:text-red-800 hover:bg-white/40'
                      }`}
                      aria-expanded={isEventsMenuOpen}
                      aria-haspopup="true"
                    >
                      <Icon className={`w-4 h-4 ${isGroupActive ? 'text-amber-300' : 'text-red-900'}`} />
                      <span>{item.label}</span>
                      <ChevronDown 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDropdownToggle();
                        }}
                        className={`w-3.5 h-3.5 transition-transform duration-200 hover:scale-125 ${isEventsMenuOpen ? 'rotate-180 text-amber-300' : 'text-red-900/80'}`} 
                      />
                    </button>

                    {/* Submenu Dropdown Card with seamless 0-gap hover bridge */}
                    {isEventsMenuOpen && (
                      <div 
                        className="absolute top-full left-0 pt-2 w-72 z-50 animate-fadeIn"
                        role="menu"
                      >
                        {/* Invisible hover bridge covering the gap between button and card */}
                        <div className="absolute top-0 left-0 right-0 h-3 pointer-events-auto bg-transparent"></div>

                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-amber-400 p-2 relative z-10">
                          <div className="px-3 py-1.5 border-b border-amber-200 mb-1 text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center justify-between">
                            <span>Events &amp; Competitions</span>
                            <span className="text-slate-500 font-marathi">कार्यक्रम व स्पर्धा</span>
                          </div>
                          {eventsSubmenu.map(sub => {
                            const SubIcon = sub.icon;
                            const isSubActive = activeTab === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNavClick(sub.id);
                                  closeDropdown();
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-start gap-2.5 my-0.5 group cursor-pointer ${
                                  isSubActive
                                    ? 'bg-gradient-to-r from-red-800 to-red-950 text-white shadow-md'
                                    : 'hover:bg-amber-100/90 text-slate-800'
                                }`}
                                role="menuitem"
                              >
                                <div className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
                                  isSubActive 
                                    ? 'bg-white/20 text-amber-300' 
                                    : 'bg-amber-100 text-amber-800 group-hover:bg-amber-200'
                                }`}>
                                  <SubIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className={`text-xs font-black ${isSubActive ? 'text-white' : 'text-red-950'}`}>
                                      {sub.label}
                                    </span>
                                  </div>
                                  <div className={`text-[10px] ${isSubActive ? 'text-amber-200' : 'text-slate-500 font-marathi'}`}>
                                    {sub.marathi}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-md border-2 border-amber-300 ring-2 ring-amber-400/50 scale-105'
                      : 'text-red-950 hover:text-red-800 hover:bg-white/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-red-900'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Search, Notification Bell & Action CTA */}
          <div className="hidden sm:flex items-center gap-2">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                title="Search festival (Ctrl+K)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-950 bg-white/30 hover:bg-white/50 border border-amber-400/50 shadow-xs text-xs font-bold transition-all active:scale-95 focus:outline-none cursor-pointer"
                aria-label="Search festival"
              >
                <Search className="w-3.5 h-3.5 text-red-950" />
                <span className="hidden xl:inline">Search...</span>
                <kbd className="hidden sm:inline-block text-[10px] bg-red-950/10 text-red-950 px-1.5 py-0.2 rounded font-mono border border-red-950/20">
                  Ctrl+K
                </kbd>
              </button>
            )}

            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="Announcements & Notifications (सूचना फलक)"
                className="relative p-2 rounded-xl text-red-950 hover:bg-white/40 focus:outline-none transition-transform active:scale-95 flex items-center justify-center cursor-pointer border border-amber-400/40 bg-white/20"
                aria-label="Festival Notifications"
              >
                <Bell className="w-4 h-4 text-red-950" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#FFDC64] shadow animate-bounce">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {SHOW_NOMINATION_CTA && (
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeEZ2Hpizk_ySdCG9hBmA2i22sC6FqWa9lyqI3N25huP0NLXw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-800 via-festival-saffron to-red-900 text-white shadow-md hover:shadow-lg hover:brightness-110 transition-all border-2 border-amber-300 hover:scale-105"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Nominate</span>
              </a>
            )}
          </div>

          {/* Mobile Action Area: Search + Bell + Hamburger Menu */}
          <div className="lg:hidden flex items-center gap-1.5">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                title="Search"
                className="p-2 rounded-xl text-red-950 hover:bg-white/40 focus:outline-none transition-transform active:scale-95 cursor-pointer border border-amber-400/30 bg-white/20"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-red-950" />
              </button>
            )}

            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="Notifications"
                className="relative p-2 rounded-xl text-red-950 hover:bg-white/40 focus:outline-none transition-transform active:scale-95 cursor-pointer border border-amber-400/30 bg-white/20"
                aria-label="Festival Notifications"
              >
                <Bell className="w-4 h-4 text-red-950" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border border-amber-300 shadow">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-red-950 hover:bg-white/40 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-amber-500/50 bg-gradient-to-b from-[#FFDC64] to-[#F5AF19] px-4 pt-3 pb-6 shadow-2xl animate-fadeIn">
          {/* Mobile Drawer Quick Search Trigger */}
          {onOpenSearch && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full mb-2.5 flex items-center justify-between p-3 rounded-xl bg-white border-2 border-amber-300 shadow-xs font-bold text-xs text-slate-700 hover:border-red-600 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-700" />
                <span className="text-slate-600 font-semibold">शोधा / Search anything...</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                Ctrl+K
              </span>
            </button>
          )}

          {/* Mobile Drawer Notification Center Link */}
          {onOpenNotifications && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenNotifications();
              }}
              className="w-full mb-3 flex items-center justify-between p-3 rounded-xl bg-white/90 border border-amber-300 shadow-xs font-bold text-xs text-red-950 hover:bg-white transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-festival-saffron" />
                <span>सूचना फलक / Announcements</span>
              </div>
              {unreadNotificationsCount > 0 ? (
                <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                  {unreadNotificationsCount} New
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 font-medium">View All</span>
              )}
            </button>
          )}

          {/* Mobile Navigation List matching exact requested menus */}
          <div className="space-y-1.5 mb-4">
            {/* 1. Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-md border-2 border-amber-300'
                  : 'bg-white/90 text-red-950 hover:bg-white shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-amber-300' : 'text-red-900'}`} />
                <span className="text-sm">Home</span>
              </div>
              <span className="text-[10px] text-slate-500 font-marathi">मुख्य पान</span>
            </button>

            {/* 2. Events & Submenus */}
            <div className="bg-white/90 rounded-xl border border-amber-300/80 overflow-hidden shadow-xs">
              <button
                onClick={() => handleNavClick('schedule')}
                className={`w-full flex items-center justify-between p-3 text-xs font-bold text-left transition-all cursor-pointer ${
                  ['events', 'schedule', 'competitions', 'nominations', 'emcees', 'winners'].includes(activeTab)
                    ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-md'
                    : 'text-red-950 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className={`w-4 h-4 ${['events', 'schedule', 'competitions', 'nominations', 'emcees', 'winners'].includes(activeTab) ? 'text-amber-300' : 'text-red-900'}`} />
                  <span className="text-sm">Events</span>
                </div>
                <span className="text-[10px] text-amber-800 font-marathi">१२ दिवस कार्यक्रम व स्पर्धा</span>
              </button>

              {/* 5 Sub-items under Events */}
              <div className="pl-4 pr-2 py-1.5 bg-amber-50/90 border-t border-amber-200/80 space-y-1">
                {/* 2.1 Schedules */}
                <button
                  onClick={() => handleNavClick('schedule')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                    activeTab === 'schedule' || activeTab === 'events'
                      ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-xs'
                      : 'text-slate-800 hover:bg-amber-100/90'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-3.5 h-3.5 ${activeTab === 'schedule' || activeTab === 'events' ? 'text-amber-300' : 'text-amber-700'}`} />
                    <span>2.1 Schedules</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-marathi">वेळापत्रक</span>
                </button>

                {/* 2.2 Competitions */}
                <button
                  onClick={() => handleNavClick('competitions')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                    activeTab === 'competitions'
                      ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-xs'
                      : 'text-slate-800 hover:bg-amber-100/90'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-3.5 h-3.5 ${activeTab === 'competitions' ? 'text-amber-300' : 'text-amber-700'}`} />
                    <span>2.2 Competitions</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-marathi">स्पर्धा व नियम</span>
                </button>

                {/* 2.3 Nominations */}
                <button
                  onClick={() => handleNavClick('nominations')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                    activeTab === 'nominations'
                      ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-xs'
                      : 'text-slate-800 hover:bg-amber-100/90'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ClipboardList className={`w-3.5 h-3.5 ${activeTab === 'nominations' ? 'text-amber-300' : 'text-amber-700'}`} />
                    <span>2.3 Nominations</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-marathi">नोंदणी</span>
                </button>

                {/* 2.4 Emcees */}
                <button
                  onClick={() => handleNavClick('emcees')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                    activeTab === 'emcees'
                      ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-xs'
                      : 'text-slate-800 hover:bg-amber-100/90'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mic className={`w-3.5 h-3.5 ${activeTab === 'emcees' ? 'text-amber-300' : 'text-amber-700'}`} />
                    <span>2.4 Emcees</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-marathi">सूत्रसंचालक</span>
                </button>

                {/* 2.5 Winners */}
                <button
                  onClick={() => handleNavClick('winners')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold text-left transition-all cursor-pointer ${
                    activeTab === 'winners'
                      ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-xs'
                      : 'text-slate-800 hover:bg-amber-100/90'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Award className={`w-3.5 h-3.5 ${activeTab === 'winners' ? 'text-amber-300' : 'text-amber-700'}`} />
                    <span>2.5 Winners</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-marathi">निकाल</span>
                </button>
              </div>
            </div>

            {/* 3. Aarti */}
            <button
              onClick={() => handleNavClick('aarti')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'aarti'
                  ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-md border-2 border-amber-300'
                  : 'bg-white/90 text-red-950 hover:bg-white shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <Flame className={`w-4 h-4 ${activeTab === 'aarti' ? 'text-amber-300' : 'text-red-900'}`} />
                <span className="text-sm">Aarti</span>
              </div>
              <span className="text-[10px] text-slate-500 font-marathi">आरती संग्रह</span>
            </button>

            {/* 4. Memories */}
            <button
              onClick={() => handleNavClick('gallery')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-md border-2 border-amber-300'
                  : 'bg-white/90 text-red-950 hover:bg-white shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className={`w-4 h-4 ${activeTab === 'gallery' ? 'text-amber-300' : 'text-red-900'}`} />
                <span className="text-sm">Memories</span>
              </div>
              <span className="text-[10px] text-slate-500 font-marathi">छायाचित्रे</span>
            </button>

            {/* 5. Accounts */}
            <button
              onClick={() => handleNavClick('accounts')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'accounts'
                  ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-md border-2 border-amber-300'
                  : 'bg-white/90 text-red-950 hover:bg-white shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className={`w-4 h-4 ${activeTab === 'accounts' ? 'text-amber-300' : 'text-red-900'}`} />
                <span className="text-sm">Accounts</span>
              </div>
              <span className="text-[10px] text-slate-500 font-marathi">जमा-खर्च</span>
            </button>

            {/* 6. Committee */}
            <button
              onClick={() => handleNavClick('committee')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                activeTab === 'committee'
                  ? 'bg-gradient-to-r from-red-800 to-red-950 text-amber-100 shadow-md border-2 border-amber-300'
                  : 'bg-white/90 text-red-950 hover:bg-white shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 ${activeTab === 'committee' ? 'text-amber-300' : 'text-red-900'}`} />
                <span className="text-sm">Committee</span>
              </div>
              <span className="text-[10px] text-slate-500 font-marathi">उत्सव समिती</span>
            </button>
          </div>
          {SHOW_NOMINATION_CTA && (
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeEZ2Hpizk_ySdCG9hBmA2i22sC6FqWa9lyqI3N25huP0NLXw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase tracking-wider text-xs bg-gradient-to-r from-red-800 via-festival-saffron to-red-900 text-white shadow-lg border-2 border-amber-300 hover:brightness-105 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Submit Nomination</span>
            </a>
          )}
        </div>
      )}
    </header>
  );
};

