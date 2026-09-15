import React, { useState, useEffect } from 'react';
import { Sparkles, X, ZoomIn, ChevronLeft, ChevronRight, RefreshCw, Layers } from 'lucide-react';
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

export const TempleDecorationSection: React.FC<TempleDecorationSectionProps> = ({
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
          title: 'भव्य गणेश मंदिर व मखर सजावट',
          subtitle: 'पारंपरिक सुवर्ण मखर व विलोभनीय विद्युत रोषणाई'
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

  // Auto-advance carousel every 4.5 seconds (paused on hover or when modal is open)
  useEffect(() => {
    if (isHovered || isImageModalOpen || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered, isImageModalOpen, slides.length]);

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentSlideIndex] || slides[0] || {
    id: 'fallback',
    imageUrl: '/photos/memories_2025_idol.jpeg',
    title: 'श्री गणेश मूर्ती दिव्य दर्शन',
    subtitle: 'सोसायटीच्या लाडक्या बाप्पांचे तेजस्वी स्वरूप'
  };

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
      className="relative overflow-hidden py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/40 to-[#FEF7DA] border-b border-amber-200 scroll-mt-24"
    >
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/ganu2.webp')" }}
      ></div>

      {/* Decorative Glow Accents */}
      <div className="absolute -top-12 -right-12 w-72 h-72 bg-amber-300/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Ganapati Temple & Mandap Decoration Feature Card */}
        <div className="bg-gradient-to-r from-amber-100/95 via-orange-50/95 to-amber-50 rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-amber-300 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Small Size Decoration Carousel Card */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div 
                onClick={() => setIsImageModalOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full group cursor-pointer select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsImageModalOpen(true);
                  }
                }}
                title="फोटो मोठा करून पाहण्यासाठी क्लिक करा / Click to view full photo in popup"
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400 bg-slate-950">
                  <img 
                    src={currentSlide.imageUrl} 
                    alt={currentSlide.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/photos/memories_2025_idol.jpeg';
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25"></div>

                  {/* Top Counter Badge & Zoom Hint */}
                  <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-amber-300 text-[10px] font-black border border-amber-300/40 backdrop-blur-xs flex items-center gap-1">
                      <span>🌺</span>
                      <span>मखर आरास</span>
                    </span>
                    {slides.length > 1 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold border border-white/20 backdrop-blur-xs flex items-center gap-1">
                        <Layers className="w-2.5 h-2.5 text-amber-300" />
                        <span>{currentSlideIndex + 1} / {slides.length}</span>
                      </span>
                    )}
                  </div>

                  {/* Center Hover Zoom Hint */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/80 text-amber-200 text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs border border-amber-300/60 shadow-xl">
                      <ZoomIn className="w-4 h-4 text-amber-300" />
                      <span>मोठे करून पहा (Click to View)</span>
                    </span>
                  </div>

                  {/* Previous / Next Chevron Buttons */}
                  {slides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-amber-300 border border-white/20 backdrop-blur-xs shadow-md transition-all active:scale-90 z-10 cursor-pointer"
                        aria-label="Previous decoration slide"
                        title="Previous photo"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-amber-300 border border-white/20 backdrop-blur-xs shadow-md transition-all active:scale-90 z-10 cursor-pointer"
                        aria-label="Next decoration slide"
                        title="Next photo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Bottom Title & Zoom Label */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider truncate pr-2">
                      {currentSlide.title}
                    </span>
                    <span className="text-[10px] font-bold text-white/90 bg-black/60 px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20 flex-shrink-0">
                      <ZoomIn className="w-3 h-3 text-amber-300" /> पाहा
                    </span>
                  </div>
                </div>
              </div>

              {/* Pagination Dot Indicators below carousel */}
              {slides.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-3 select-none">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 transition-all rounded-full cursor-pointer ${
                        idx === currentSlideIndex 
                          ? 'w-6 bg-red-700' 
                          : 'w-2 bg-amber-400/60 hover:bg-amber-500'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Side Details & Attribution */}
            <div className="md:col-span-7 space-y-3.5 text-left">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-900 font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-red-700" />
                  <span>GANAPATI TEMPLE &amp; MANDAP DECORATION</span>
                </div>

                {onRefresh && (
                  <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-900 bg-amber-200/80 hover:bg-amber-300 px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    title="रिफ्रेश करा / Refresh photos"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-red-950 font-festive">
                दिव्य मंदिर, मखर व विद्युत रोषणाई (Altar &amp; Temple Design)
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                पारंपरिक फुले, नयनरम्य विद्युत रोषणाई, सुवर्ण झालर आणि भव्य मखर सजावटीने बाप्पांचा दरबार सजवला आहे. सर्व भाविकांना प्रसन्न व भक्तिमय वातावरणात दर्शनाचा अलौकिक लाभ मिळतो.
              </p>
              
              {/* Decoration Leads attribution */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="bg-white px-4 py-2.5 rounded-xl border border-amber-300 shadow-xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-700 to-festival-saffron text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    P
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-amber-800">Temple Decoration Lead</span>
                    <span className="font-extrabold text-sm text-slate-900">Prasad Jadhav</span>
                  </div>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-xl border border-amber-300 shadow-xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    R
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-amber-800">Mandap &amp; Lighting Lead</span>
                    <span className="font-extrabold text-sm text-slate-900">Rahul Walunj</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Temple & Mandap Decoration Photo Popup Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-fadeIn"
          onClick={() => setIsImageModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Ganapati Temple & Mandap Decoration Photo"
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border-2 border-amber-400 relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar with Title and Close Action */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-amber-100 border-b border-amber-400/40 shrink-0 select-none">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="text-lg flex-shrink-0">🌺</span>
                <div className="min-w-0">
                  <h3 className="font-festive font-bold text-sm sm:text-base text-amber-200 truncate">
                    {currentSlide.title || 'गणेश मंदिर व भव्य मखर सजावट'}
                  </h3>
                  <p className="text-[11px] text-amber-300/80 truncate">
                    {currentSlide.subtitle || 'Ganapati Temple & Mandap Decoration'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                {slides.length > 1 && (
                  <span className="px-2.5 py-1 rounded-lg bg-black/50 text-amber-200 text-xs font-bold border border-amber-400/30">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                )}
                {/* Close Button with X */}
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

            {/* Photo Preview Container with Prev/Next Navigation */}
            <div className="relative flex-1 min-h-[240px] max-h-[68vh] bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                referrerPolicy="no-referrer"
                className="w-auto h-auto max-w-full max-h-[64vh] object-contain mx-auto rounded-lg shadow-2xl transition-all duration-200 block"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/photos/memories_2025_idol.jpeg';
                }}
              />

              {/* In-Modal Prev/Next Navigation Arrows */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-amber-300 hover:text-white border border-amber-400/50 shadow-2xl transition-transform active:scale-90 z-20 cursor-pointer"
                    aria-label="Previous decoration photo"
                    title="Previous photo (←)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-amber-300 hover:text-white border border-amber-400/50 shadow-2xl transition-transform active:scale-90 z-20 cursor-pointer"
                    aria-label="Next decoration photo"
                    title="Next photo (→)"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Bottom Caption Bar */}
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
};

