import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Clock, Calendar, Phone, Trophy, DollarSign } from 'lucide-react';
import { AccountsData, NominationsDashboardData, NotificationItem, EventItem, SelectedEmcee, CompetitionWinner } from '../types';
import { buildSearchIndex, searchFestivalIndex, QUICK_SEARCH_TAGS, SearchResultItem } from '../services/searchService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts?: AccountsData | null;
  notifications?: NotificationItem[] | null;
  nominations?: NominationsDashboardData | null;
  schedule?: EventItem[] | null;
  selectedEmcees?: SelectedEmcee[] | null;
  winners?: CompetitionWinner[] | null;
  onNavigateSection: (sectionId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  accounts,
  notifications,
  nominations,
  schedule,
  selectedEmcees,
  winners,
  onNavigateSection
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Build unified search index memoized with dynamic sheets data
  const searchIndex = useMemo(() => {
    return buildSearchIndex(accounts, notifications, nominations, schedule, selectedEmcees, winners);
  }, [accounts, notifications, nominations, schedule, selectedEmcees, winners]);

  // Compute matched results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchFestivalIndex(query, searchIndex);
  }, [query, searchIndex]);

  // Auto focus input when opened & reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset selectedIndex on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current && results.length > 0) {
      const activeEl = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, results.length]);

  // Global Keyboard Navigation (Arrow Keys, Enter, Esc)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    if (item.targetAartiId) {
      window.dispatchEvent(new CustomEvent('select-aarti', { detail: item.targetAartiId }));
    }
    // Allow smooth modal fade out before scrolling
    setTimeout(() => {
      onNavigateSection(item.sectionId);
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-amber-400/80 overflow-hidden z-10 my-8 sm:my-12 transition-all flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Search Festival Portal"
      >
        {/* Search Header Bar */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-b border-amber-400/30 flex items-center justify-between text-amber-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-200 leading-tight">
                शोधा / Search Portal
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-300/80">
                आरती, स्पर्धा, हिशोब, वेळापत्रक, संपर्क किंवा सूचना शोधा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-200/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-3 sm:p-4 bg-amber-50/50 border-b border-amber-200/60">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-amber-700 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="उदा. आरती वेळ, डान्स, हिशोब, महाप्रसाद, schedule, committee..."
              className="w-full pl-11 pr-20 py-3 rounded-2xl bg-white border-2 border-amber-300/90 focus:border-red-600 focus:ring-4 focus:ring-amber-400/30 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium shadow-inner transition-all outline-none"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-12 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="absolute right-3 hidden sm:flex items-center text-[10px] font-bold text-amber-800/80 bg-amber-200/60 border border-amber-300 px-1.5 py-0.5 rounded-md select-none">
              ESC
            </div>
          </div>
        </div>

        {/* Results / Suggestions Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-4 divide-y divide-amber-100">
          {/* 1. Empty Query State: Show Popular Search Tags */}
          {!query.trim() && (
            <div className="py-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>लोकप्रिय शोध / Quick Searches:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_SEARCH_TAGS.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(tag.query);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-amber-50 text-red-950 border border-amber-300 hover:border-red-600 hover:bg-amber-200 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>{tag.label}</span>
                    <ArrowRight className="w-3 h-3 text-red-800" />
                  </button>
                ))}
              </div>

              {/* Portal Directory Shortcuts */}
              <div className="mt-6 pt-4 border-t border-amber-200/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateSection('aarti');
                  }}
                  className="p-2.5 rounded-xl bg-amber-100/50 hover:bg-amber-100 border border-amber-200 transition-all text-amber-950 font-bold flex flex-col items-center gap-1"
                >
                  <span className="text-xl">🪔</span>
                  <span>दैनिक महाआरती</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateSection('schedule');
                  }}
                  className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all text-blue-950 font-bold flex flex-col items-center gap-1"
                >
                  <span className="text-xl">📅</span>
                  <span>१२ दिवस वेळापत्रक</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateSection('competitions');
                  }}
                  className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all text-purple-950 font-bold flex flex-col items-center gap-1"
                >
                  <span className="text-xl">🏆</span>
                  <span>सांस्कृतिक स्पर्धा</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateSection('accounts');
                  }}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all text-emerald-950 font-bold flex flex-col items-center gap-1"
                >
                  <span className="text-xl">💰</span>
                  <span>जमा-खर्च हिशोब</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Matched Search Results List */}
          {query.trim() && results.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-500 mb-2.5 px-1 flex items-center justify-between">
                <span>
                  {results.length} निकाल सापडले ({results.length} results found):
                </span>
                <span className="text-[11px] text-amber-800 font-normal hidden sm:inline">
                  नेव्हिगेट करण्यासाठी ↑ ↓ वापरा, निवडण्यासाठी Enter दाबा
                </span>
              </div>

              <div ref={resultsContainerRef} className="space-y-2">
                {results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all border flex items-start gap-3 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-100/90 via-amber-50 to-white border-red-600 shadow-md ring-2 ring-amber-400/40 translate-x-1'
                          : 'bg-white border-amber-200/80 hover:bg-amber-50/40 hover:border-amber-400'
                      }`}
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-amber-100/80 border border-amber-300/80 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                        {item.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${item.categoryColor}`}>
                            {item.categoryLabel}
                          </span>
                          {item.timeOrDate && (
                            <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>{item.timeOrDate}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Jump Action Indicator */}
                      <div className="self-center flex-shrink-0">
                        <div className={`p-2 rounded-xl transition-all ${
                          isSelected 
                            ? 'bg-red-800 text-white shadow-md' 
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. No Results State */}
          {query.trim() && results.length === 0 && (
            <div className="py-10 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-2xl mb-3 shadow-inner">
                🌺
              </div>
              <h3 className="text-base font-black text-slate-800">
                '{query}' साठी कोणताही निकाल सापडला नाही
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                कृपया वेगळा शब्द टाकून पहा. तुम्ही मराठी किंवा इंग्रजीत शोधू शकता (उदा. आरती, डान्स, महाप्रसाद, हिशोब, committee).
              </p>

              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => setQuery('aarti')}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-red-900 text-xs font-bold rounded-full border border-amber-300 transition-colors"
                >
                  🪔 Aarti
                </button>
                <button
                  onClick={() => setQuery('dance')}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-red-900 text-xs font-bold rounded-full border border-amber-300 transition-colors"
                >
                  💃 Dance
                </button>
                <button
                  onClick={() => setQuery('mahaprasad')}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-red-900 text-xs font-bold rounded-full border border-amber-300 transition-colors"
                >
                  🍽️ Mahaprasad
                </button>
                <button
                  onClick={() => setQuery('accounts')}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-red-900 text-xs font-bold rounded-full border border-amber-300 transition-colors"
                >
                  💰 Accounts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-[10px] font-mono">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-[10px] font-mono">Enter</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-[10px] font-mono">Esc</kbd>
              <span>to close</span>
            </span>
          </div>

          <div className="font-semibold text-amber-900 flex items-center gap-1">
            <span>Pride Universal २०२६</span>
          </div>
        </div>
      </div>
    </div>
  );
};

