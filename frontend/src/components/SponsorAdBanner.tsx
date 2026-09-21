import React, { useState, useEffect, useCallback } from 'react';
import { Phone, ExternalLink, ChevronLeft, ChevronRight, Sparkles, Megaphone, RefreshCw, X, ZoomIn } from 'lucide-react';
import { SponsorAd, DEFAULT_SPONSOR_ADS } from '../services/adService';
import { useBackButton } from '../hooks/useBackButton';

interface SponsorAdBannerProps {
  variant?: 'top' | 'mid' | 'bottom';
  ads?: SponsorAd[];
  onNavigateToCommittee?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const SponsorAdBanner: React.FC<SponsorAdBannerProps> = React.memo(({
  variant = 'top',
  ads = DEFAULT_SPONSOR_ADS,
  onNavigateToCommittee,
  onRefresh,
  isRefreshing = false
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  useBackButton('sponsor-image-modal', isImageModalOpen, () => setIsImageModalOpen(false), 85);

  const activeAds = ads.length > 0 ? ads : DEFAULT_SPONSOR_ADS;
  const currentAd = activeAds[currentIndex % activeAds.length];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeAds.length);
  }, [activeAds.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  }, [activeAds.length]);

  // Auto-advance banner every 6 seconds (paused if hovered or modal is open)
  useEffect(() => {
    if (isPaused || isImageModalOpen || activeAds.length <= 1) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [isPaused, isImageModalOpen, handleNext, activeAds.length]);

  // Handle Escape key and prevent background body scrolling while modal is open
  useEffect(() => {
    if (!isImageModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isImageModalOpen]);

  if (!currentAd) return null;

  // 1. TOP COMPACT RIBBON VARIANT
  if (variant === 'top') {
    return (
      <div 
        className="w-full bg-gradient-to-r from-amber-500/15 via-red-950/10 to-amber-500/15 border-y border-amber-400/40 py-2 px-3 sm:px-6 relative overflow-hidden transition-all"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Left: Sponsored Badge & Company Headline */}
          <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
            <span className="flex-shrink-0 text-[10px] sm:text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-red-800 text-amber-100 border border-amber-300/80 shadow-xs flex items-center gap-1">
              <Megaphone className="w-3 h-3 text-amber-300" />
              <span>प्रायोजक / Sponsor</span>
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                  {currentAd.companyName}:
                </span>
                <span className="text-xs text-slate-700 font-medium truncate hidden md:inline">
                  {currentAd.tagline}
                </span>
                <span className="text-xs text-slate-700 font-medium truncate md:hidden">
                  {currentAd.title}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions & Carousel Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
            {currentAd.phone && (
              <a
                href={`tel:${currentAd.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-transform active:scale-95"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </a>
            )}

            {currentAd.linkUrl && (
              <a
                href={currentAd.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-800 hover:bg-red-900 text-amber-100 border border-amber-300/60 shadow-xs transition-transform active:scale-95"
              >
                <span>Offer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* Carousel Arrow Steppers */}
            {activeAds.length > 1 && (
              <div className="flex items-center gap-1 ml-1 border-l border-amber-400/50 pl-2">
                <button
                  onClick={handlePrev}
                  className="p-1 rounded hover:bg-black/10 text-slate-700 transition-colors"
                  aria-label="Previous sponsor ad"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold text-slate-600 font-mono">
                  {currentIndex + 1}/{activeAds.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-1 rounded hover:bg-black/10 text-slate-700 transition-colors"
                  aria-label="Next sponsor ad"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. MID-PAGE SHOWCASE VARIANT (Between Schedule & Competitions)
  return (
    <section 
      id="sponsors"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 scroll-mt-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-amber-400/70 bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 p-4 sm:p-6 md:p-8">
        {/* Decorative Festive Auras */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Tag & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-300/60 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] sm:text-xs font-black uppercase px-3 py-1 rounded-full bg-gradient-to-r from-red-800 to-red-950 text-amber-200 border border-amber-300 shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>उत्सव विशेष जाहिराती / Festival Special Advertisements</span>
            </span>
            <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
              {currentAd.badgeText} ({currentIndex + 1}/{activeAds.length})
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            {/* Stepper Buttons */}
            {activeAds.length > 1 && (
              <div className="flex items-center gap-1 bg-white/70 border border-amber-300/80 rounded-lg p-0.5 shadow-2xs">
                <button
                  onClick={handlePrev}
                  className="px-2 py-1 rounded hover:bg-amber-200 text-slate-800 transition-colors flex items-center gap-0.5 text-xs font-bold cursor-pointer"
                  title="Previous sponsor"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden xs:inline">Prev</span>
                </button>
                <span className="text-xs font-bold text-slate-700 px-1 font-mono">
                  {currentIndex + 1} of {activeAds.length}
                </span>
                <button
                  onClick={handleNext}
                  className="px-2 py-1 rounded hover:bg-amber-200 text-slate-800 transition-colors flex items-center gap-0.5 text-xs font-bold cursor-pointer"
                  title="Next sponsor"
                >
                  <span className="hidden xs:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-800 border border-amber-300 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                title="Refresh ads"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            )}

            {onNavigateToCommittee && (
              <button
                onClick={onNavigateToCommittee}
                className="text-xs font-bold text-red-900 hover:text-red-700 underline underline-offset-2 transition-colors cursor-pointer"
              >
                प्रायोजक व्हा
              </button>
            )}
          </div>
        </div>

        {/* Quick Sponsor Selector Pills (Allows user to immediately jump to any sponsor) */}
        {activeAds.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-thin relative z-10">
            {activeAds.map((ad, idx) => (
              <button
                key={ad.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer border ${
                  idx === currentIndex
                    ? 'bg-red-800 text-amber-100 border-amber-400 shadow-sm scale-105'
                    : 'bg-white/70 text-slate-700 hover:bg-white border-slate-200'
                }`}
              >
                {ad.companyName}
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center relative z-10">
          {/* Ad Image / Poster (Clickable to open full popup) */}
          <div 
            onClick={() => setIsImageModalOpen(true)}
            className="md:col-span-5 h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300/80 bg-slate-900 group relative cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsImageModalOpen(true);
              }
            }}
            title="फोटो मोठा करून पाहण्यासाठी क्लिक करा / Click to view photo in popup"
          >
            <img
              src={currentAd.imageUrl}
              alt={currentAd.companyName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback to local image if remote image fails
                (e.target as HTMLImageElement).src = '/photos/memories_2025_idol2.jpeg';
              }}
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <span className="px-3.5 py-1.5 rounded-full bg-black/75 text-amber-200 text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs border border-amber-300/60 shadow-xl">
                <ZoomIn className="w-4 h-4 text-amber-300" />
                <span>मोठे करून पहा (Click to View)</span>
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between p-3 pointer-events-none">
              <span className="text-xs font-bold text-amber-200 truncate">
                {currentAd.companyName}
              </span>
              <span className="text-[10px] font-bold text-white/90 bg-black/60 px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                <ZoomIn className="w-3 h-3 text-amber-300" /> पाहा
              </span>
            </div>
          </div>

          {/* Ad Details & Action */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                {currentAd.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {currentAd.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 font-medium mt-2 leading-relaxed">
                {currentAd.tagline}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-5 pt-4 border-t border-amber-200 flex flex-wrap items-center gap-3">
              {currentAd.phone && (
                <a
                  href={`tel:${currentAd.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-transform active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: {currentAd.phone}</span>
                </a>
              )}

              {currentAd.linkUrl && (
                <a
                  href={currentAd.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-red-800 to-red-950 text-amber-100 border border-amber-300 shadow-md hover:brightness-110 transition-all active:scale-95"
                >
                  <span>विशेष ऑफर पहा / View Offer</span>
                  <ExternalLink className="w-4 h-4 text-amber-300" />
                </a>
              )}

              {/* Indicator Dots */}
              {activeAds.length > 1 && (
                <div className="flex items-center gap-1.5 ml-auto">
                  {activeAds.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentIndex ? 'w-6 bg-red-800' : 'w-2 bg-amber-400/60 hover:bg-amber-500'
                      }`}
                      aria-label={`Slide to ad ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sponsor Photo Popup Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-fadeIn"
          onClick={() => setIsImageModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${currentAd.companyName} Photo`}
        >
          {/* Modal Card - strictly viewport-constrained */}
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-2 border-amber-400 relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar with Title, Counter and Close Button */}
            <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-amber-100 border-b border-amber-400/40 shrink-0 select-none">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="text-base sm:text-lg flex-shrink-0">📢</span>
                <div className="min-w-0">
                  <h3 className="font-festive font-bold text-sm sm:text-base text-amber-200 truncate">
                    {currentAd.companyName}
                  </h3>
                  <p className="text-[11px] text-amber-300/80 truncate">
                    {currentAd.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {activeAds.length > 1 && (
                  <span className="text-xs text-amber-300 font-mono bg-black/40 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {currentIndex + 1} / {activeAds.length}
                  </span>
                )}
                {/* Close button with X */}
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-2.5 py-1 rounded-lg text-amber-200 hover:text-white hover:bg-red-700/80 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-amber-400/40 bg-black/30"
                  aria-label="Close popup"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4 text-amber-300" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Photo Preview Container - Strictly bounded with object-contain */}
            <div className="relative flex-1 min-h-[200px] max-h-[64vh] sm:max-h-[66vh] bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
              <img
                src={currentAd.imageUrl}
                alt={currentAd.companyName}
                referrerPolicy="no-referrer"
                className="w-auto h-auto max-w-full max-h-[60vh] sm:max-h-[63vh] object-contain mx-auto rounded-lg shadow-2xl transition-all duration-200 block"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/photos/memories_2025_idol2.jpeg';
                }}
              />

              {/* Prev / Next controls inside popup */}
              {activeAds.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-amber-400 hover:text-red-950 text-white transition-all shadow-xl z-20 active:scale-95 border border-white/20 cursor-pointer"
                    aria-label="Previous sponsor"
                    title="Previous sponsor"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-amber-400 hover:text-red-950 text-white transition-all shadow-xl z-20 active:scale-95 border border-white/20 cursor-pointer"
                    aria-label="Next sponsor"
                    title="Next sponsor"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Actions / Footer */}
            <div className="shrink-0 p-3 sm:p-4 bg-gradient-to-b from-white to-amber-50 border-t border-amber-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                  {currentAd.category}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 font-medium line-clamp-2">
                  {currentAd.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                {currentAd.phone && (
                  <a
                    href={`tel:${currentAd.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-transform active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: {currentAd.phone}</span>
                  </a>
                )}
                {currentAd.linkUrl && (
                  <a
                    href={currentAd.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-800 to-red-950 text-amber-100 border border-amber-300 shadow-xs hover:brightness-110 transition-all active:scale-95"
                  >
                    <span>विशेष ऑफर पहा / View Offer</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                  </a>
                )}
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer border border-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

SponsorAdBanner.displayName = 'SponsorAdBanner';

