import React, { useState, useEffect } from 'react';
import { Sparkles, X, ZoomIn, ChevronLeft, ChevronRight, RefreshCw, Layers, Film, Maximize2, Camera, Flame, Gamepad2, Heart } from 'lucide-react';
import { 
  fetchTempleDecorationSlides, 
  DecorationSlide, 
  DEFAULT_DECORATION_SLIDES, 
  formatSafeDriveUrl 
} from '../services/googleSheetsService';

interface TempleDecorationSectionProps {
  customTempleImageUrl?: string;
  slides?: DecorationSlide[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const TempleDecorationSection: React.FC<TempleDecorationSectionProps> = React.memo(({
  customTempleImageUrl,
  slides: propSlides,
  onRefresh,
  isRefreshing = false
}) => {
  const [internalSlides, setInternalSlides] = useState<DecorationSlide[]>(() => {
    if (propSlides && propSlides.length > 0) return propSlides;
    if (customTempleImageUrl) {
      return [
        {
          id: 'custom-decor-1',
          imageUrl: formatSafeDriveUrl(customTempleImageUrl),
          title: 'श्री गणेश दिव्य दर्शन व उत्सव क्षणचित्रे',
          subtitle: 'प्राइड युनिव्हर्सल बाप्पांचे तेजस्वी स्वरूप व थेट क्षणचित्रे'
        }
      ];
    }
    return DEFAULT_DECORATION_SLIDES;
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  // Sync when propSlides from App.tsx (auto-sync / manual sync) updates
  useEffect(() => {
    if (propSlides && propSlides.length > 0) {
      setInternalSlides(propSlides);
    }
  }, [propSlides]);

  // Real-time synchronization: polls Google Sheets every 15s with cache: 'no-store'
  useEffect(() => {
    if (customTempleImageUrl) return;

    let isMounted = true;
    const fetchLatest = () => {
      fetchTempleDecorationSlides().then((fetchedSlides) => {
        if (isMounted && fetchedSlides && fetchedSlides.length > 0) {
          setInternalSlides(fetchedSlides);
        }
      });
    };

    fetchLatest();
    // 15-second real-time polling interval
    const interval = setInterval(fetchLatest, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [customTempleImageUrl]);

  const slides = (propSlides && propSlides.length > 0) ? propSlides : internalSlides;

  const currentSlide = slides[currentSlideIndex] || slides[0] || {
    id: 'fallback',
    imageUrl: '/photos/memories_2025_idol.jpeg',
    title: 'श्री गणेश मूर्ती दिव्य दर्शन',
    subtitle: 'सोसायटीच्या लाडक्या बाप्पांचे तेजस्वी स्वरूप'
  };

  const isCurrentVideo = 
    currentSlide.mediaType === 'youtube' || 
    currentSlide.mediaType === 'drive-video' || 
    currentSlide.mediaType === 'video';

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  // Concise, distinctive chip label helper
  const getChipLabel = (title: string) => {
    const clean = title.trim();
    if (/Day\s*2/i.test(clean)) return 'Day 2 Aarti';
    if (/Day\s*3/i.test(clean)) return 'Day 3 Aarti';
    if (/Day\s*4/i.test(clean)) return 'Day 4 Games';
    if (/Morning Aarti/i.test(clean)) return 'Morning Aarti';
    if (/Bappa/i.test(clean)) return 'Bappa Darshan';
    const dayMatch = clean.match(/^(Day\s*\d+)\s*[-:]?\s*(.*)$/i);
    if (dayMatch) {
      const day = dayMatch[1];
      const rest = dayMatch[2].trim();
      const shortRest = rest.length > 12 ? `${rest.slice(0, 10)}…` : rest;
      return `${day}: ${shortRest}`;
    }
    return clean.length > 16 ? `${clean.slice(0, 14)}…` : clean;
  };

  // Auto-advance carousel every 6 seconds (paused on hover, modal open, or when video is playing)
  useEffect(() => {
    if (isHovered || isImageModalOpen || isCurrentVideo || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isHovered, isImageModalOpen, isCurrentVideo, slides.length]);

  // Close modal on Escape key and enable Arrow key navigation
  useEffect(() => {
    if (!isImageModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isImageModalOpen, slides.length]);

  return (
    <section 
      id="temple-decoration" 
      className="relative overflow-hidden py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/40 to-[#FEF7DA] border-b border-amber-200 scroll-mt-24"
    >
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/ganu2.webp')" }}
      ></div>

      {/* Decorative Glow Accents */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-amber-300/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Card Container */}
        <div className="bg-gradient-to-r from-amber-100/95 via-orange-50/95 to-amber-50 rounded-3xl p-5 sm:p-7 md:p-8 border-2 border-amber-300 shadow-xl overflow-hidden">
          
          {/* Top Full-Width Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-amber-200/90 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-900 font-extrabold text-xs uppercase tracking-widest shadow-2xs mb-2">
                <Sparkles className="w-3.5 h-3.5 text-festival-saffron" />
                <span>FESTIVAL LIVE GLIMPSES &amp; REELS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-red-950 font-festive leading-tight">
                थेट उत्सव क्षणचित्रे व व्हिडिओ
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 font-medium mt-0.5">
                दैनिक महाआरती दर्शन, बाप्पांची दिव्य आरास आणि आनंदाचे क्षण
              </p>
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-bold text-red-950 bg-amber-200/90 hover:bg-amber-300 px-3.5 py-1.5 rounded-xl border border-amber-300 shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="रिफ्रेश करा / Refresh live media"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            )}
          </div>

          {/* 2-Column Responsive Grid with min-w-0 to Prevent Any Overflow */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Prominent Media Player (lg:col-span-7) */}
            <div className="min-w-0 lg:col-span-7 flex flex-col justify-start">
              <div 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full group select-none"
              >
                {/* Clean Aspect-Ratio Box Constrained to Column Width */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400 bg-slate-950">
                  {/* Inline Auto-Executing Media: YouTube */}
                  {currentSlide.mediaType === 'youtube' ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${currentSlide.youtubeId || ''}?autoplay=1&mute=1&loop=1&playlist=${currentSlide.youtubeId || ''}&controls=1&modestbranding=1&playsinline=1&rel=0`}
                      title={currentSlide.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0 absolute inset-0 z-0"
                    />
                  ) : currentSlide.mediaType === 'drive-video' ? (
                    /* Inline Auto-Executing Media: Google Drive Preview */
                    <iframe
                      src={currentSlide.embedUrl || `https://drive.google.com/file/d/${currentSlide.driveFileId}/preview`}
                      title={currentSlide.title}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      className="w-full h-full border-0 absolute inset-0 z-0"
                    />
                  ) : currentSlide.mediaType === 'video' ? (
                    /* Inline Auto-Executing Media: Direct MP4/WebM */
                    <video
                      src={currentSlide.videoUrl || currentSlide.imageUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      className="w-full h-full object-cover absolute inset-0 z-0"
                    />
                  ) : (
                    /* Static Image Slide (Click to Zoom) */
                    <div 
                      onClick={() => setIsImageModalOpen(true)}
                      className="w-full h-full cursor-pointer relative"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsImageModalOpen(true);
                        }
                      }}
                      title="फोटो मोठा करून पाहण्यासाठी क्लिक करा / Click to view full photo"
                    >
                      <img 
                        src={currentSlide.imageUrl || '/photos/memories_2025_idol.jpeg'} 
                        alt={currentSlide.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/photos/memories_2025_idol.jpeg';
                        }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30"></div>

                      {/* Center Hover Zoom Hint */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                        <span className="px-3.5 py-1.5 rounded-full bg-black/80 text-amber-200 text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs border border-amber-300/60 shadow-xl">
                          <ZoomIn className="w-4 h-4 text-amber-300" />
                          <span>मोठे करून पहा (Click to Zoom)</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Top Floating Badge & Action Controls */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                    {isCurrentVideo ? (
                      <span className="px-3 py-1 rounded-full bg-red-950/90 text-amber-200 text-[11px] font-extrabold border border-amber-300/60 backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                        <Film className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span>व्हिडिओ / Video Reel</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-black/70 text-amber-300 text-[11px] font-extrabold border border-amber-300/40 backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>थेट उत्सव क्षणचित्र</span>
                      </span>
                    )}

                    <div className="flex items-center gap-2 pointer-events-auto">
                      {/* Fullscreen Expand Action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsImageModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-full bg-black/80 hover:bg-black text-amber-300 text-[11px] font-bold border border-amber-300/50 backdrop-blur-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-md"
                        title="Full Screen / मोठा करून पहा"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Full Screen</span>
                      </button>

                      {slides.length > 1 && (
                        <span className="px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-bold border border-white/20 backdrop-blur-xs flex items-center gap-1 shadow-md">
                          <Layers className="w-3 h-3 text-amber-300" />
                          <span>{currentSlideIndex + 1} / {slides.length}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Previous / Next Slide Arrows */}
                  {slides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/75 hover:bg-black text-white hover:text-amber-300 border border-white/30 backdrop-blur-xs shadow-lg transition-all active:scale-90 z-20 cursor-pointer"
                        aria-label="Previous photo or video"
                        title="Previous (←)"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/75 hover:bg-black text-white hover:text-amber-300 border border-white/30 backdrop-blur-xs shadow-lg transition-all active:scale-90 z-20 cursor-pointer"
                        aria-label="Next photo or video"
                        title="Next (→)"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
                    <span className="text-xs sm:text-sm font-black text-amber-200 uppercase tracking-wide truncate pr-2 drop-shadow-md">
                      {currentSlide.title}
                    </span>
                    {!isCurrentVideo && (
                      <span className="text-[10px] font-bold text-white/90 bg-black/70 px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20 flex-shrink-0">
                        <ZoomIn className="w-3 h-3 text-amber-300" /> पाहा
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pagination Dots below player */}
              {slides.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-3 select-none">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 transition-all rounded-full cursor-pointer ${
                        idx === currentSlideIndex 
                          ? 'w-7 bg-red-700' 
                          : 'w-2 bg-amber-400/60 hover:bg-amber-500'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Tangy Details & Moments (lg:col-span-5) */}
            <div className="min-w-0 lg:col-span-5 flex flex-col space-y-3.5 text-left">
              
              {/* Tangy Active Slide Spotlight Box */}
              <div className="bg-white/95 rounded-2xl p-4 border-2 border-amber-300/80 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>{isCurrentVideo ? '🎬 Video Reel' : '📸 Live Moment'} • Slide {currentSlideIndex + 1}/{slides.length}</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    Pride 2026
                  </span>
                </div>
                <h4 className="font-black text-base sm:text-lg text-slate-900 leading-snug">
                  {currentSlide.title}
                </h4>
                {currentSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed font-marathi">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Tangy Festive Highlights Badges */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-amber-100/70 hover:bg-amber-100 p-2.5 rounded-xl border border-amber-200/80 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-red-700 text-white flex items-center justify-center flex-shrink-0 text-sm shadow-2xs">
                    <Flame className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-red-950 block leading-tight">
                      दैनिक मंगल आरती व दर्शन (Daily Aarti)
                    </span>
                    <span className="text-[11px] text-slate-600 truncate block">
                      सकाळी ८:०० व संध्याकाळी ७:३० ची महाआरती व गजर
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-orange-100/70 hover:bg-orange-100 p-2.5 rounded-xl border border-orange-200/80 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-sm shadow-2xs">
                    <Gamepad2 className="w-4 h-4 text-yellow-200" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-red-950 block leading-tight">
                      खेळ, स्पर्धा व जल्लोष (Fun &amp; Games)
                    </span>
                    <span className="text-[11px] text-slate-600 truncate block">
                      २ मिनिटांचे खेळ, मुलांच्या स्पर्धा व उत्साही क्षण
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-amber-50 hover:bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/80 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center flex-shrink-0 text-sm shadow-2xs">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-red-950 block leading-tight">
                      सोसायटी एकोपा व भक्ती (Community Spirit)
                    </span>
                    <span className="text-[11px] text-slate-600 truncate block">
                      सर्व रहिवासी, महिला व बालगोपाळांचा सहभाग
                    </span>
                  </div>
                </div>
              </div>

              {/* Tangy Quick Switch Pills */}
              {slides.length > 1 && (
                <div className="pt-2 border-t border-amber-200/90">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block mb-2">
                    ⚡ थेट फोटो व व्हिडिओ निवडा (Quick Jump):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {slides.map((s, idx) => {
                      const isVid = s.mediaType === 'video' || s.mediaType === 'drive-video' || s.mediaType === 'youtube';
                      const chipLabel = getChipLabel(s.title);
                      return (
                        <button
                          key={s.id || idx}
                          type="button"
                          onClick={() => setCurrentSlideIndex(idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                            idx === currentSlideIndex
                              ? 'bg-gradient-to-r from-red-800 to-festival-saffron text-white border-amber-400 shadow-sm scale-105'
                              : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-200/90 shadow-2xs'
                          }`}
                        >
                          <span>{isVid ? '🎬' : '📷'}</span>
                          <span>{chipLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>

      {/* Fullscreen Photo & Video Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-fadeIn"
          onClick={() => setIsImageModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Festival Photo & Video Showcase"
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border-2 border-amber-400 relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-amber-100 border-b border-amber-400/40 shrink-0 select-none">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="text-lg flex-shrink-0">{isCurrentVideo ? '🎬' : '📸'}</span>
                <div className="min-w-0">
                  <h3 className="font-festive font-bold text-sm sm:text-base text-amber-200 truncate">
                    {currentSlide.title || (isCurrentVideo ? 'उत्सव व्हिडिओ' : 'उत्सव क्षणचित्र')}
                  </h3>
                  <p className="text-[11px] text-amber-300/80 truncate">
                    {currentSlide.subtitle || 'प्राइड युनिव्हर्सल गणेशोत्सव २०२६'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                {slides.length > 1 && (
                  <span className="px-2.5 py-1 rounded-lg bg-black/50 text-amber-200 text-xs font-bold border border-amber-400/30">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                )}
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-2.5 py-1 rounded-lg text-amber-200 hover:text-white hover:bg-red-700/80 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-amber-400/40 bg-black/30"
                  aria-label="Close popup"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4 text-amber-300" />
                  <span>बंद करा / Close</span>
                </button>
              </div>
            </div>

            {/* Media Container with Navigation */}
            <div className="relative flex-1 min-h-[240px] max-h-[70vh] bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
              {currentSlide.mediaType === 'youtube' ? (
                <div className="w-full aspect-video max-w-4xl max-h-[66vh] mx-auto bg-black rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
                  <iframe
                    src={`${currentSlide.embedUrl || `https://www.youtube.com/embed/${currentSlide.youtubeId}`}?autoplay=1&rel=0`}
                    title={currentSlide.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : currentSlide.mediaType === 'drive-video' ? (
                <div className="w-full aspect-video max-w-4xl max-h-[66vh] mx-auto bg-black rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
                  <iframe
                    src={currentSlide.embedUrl || (currentSlide.driveFileId ? `https://drive.google.com/file/d/${currentSlide.driveFileId}/preview` : currentSlide.videoUrl || currentSlide.imageUrl)}
                    title={currentSlide.title}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : currentSlide.mediaType === 'video' ? (
                <div className="w-full max-h-[66vh] mx-auto bg-black rounded-lg overflow-hidden shadow-2xl flex items-center justify-center">
                  <video
                    src={currentSlide.videoUrl || currentSlide.imageUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-auto h-auto max-w-full max-h-[64vh] object-contain mx-auto rounded-lg shadow-2xl"
                  />
                </div>
              ) : (
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.title}
                  referrerPolicy="no-referrer"
                  className="w-auto h-auto max-w-full max-h-[64vh] object-contain mx-auto rounded-lg shadow-2xl transition-all duration-200 block"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/photos/memories_2025_idol.jpeg';
                  }}
                />
              )}

              {slides.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-amber-300 hover:text-white border border-amber-400/50 shadow-2xl transition-transform active:scale-90 z-20 cursor-pointer"
                    aria-label="Previous slide"
                    title="Previous (←)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-amber-300 hover:text-white border border-amber-400/50 shadow-2xl transition-transform active:scale-90 z-20 cursor-pointer"
                    aria-label="Next slide"
                    title="Next (→)"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer Caption */}
            <div className="px-4 py-3 bg-slate-900 border-t border-amber-400/20 text-slate-300 text-xs shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-amber-300 block sm:inline mr-2">
                  {currentSlide.title}
                </span>
                {currentSlide.subtitle && (
                  <span className="text-slate-400 text-[11px]">
                    {currentSlide.subtitle}
                  </span>
                )}
              </div>

              {slides.length > 1 && (
                <div className="flex items-center gap-1.5 self-center sm:self-auto">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === currentSlideIndex 
                          ? 'w-5 bg-amber-400' 
                          : 'w-1.5 bg-slate-600 hover:bg-slate-500'
                      }`}
                      aria-label={`Jump to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

TempleDecorationSection.displayName = 'TempleDecorationSection';
