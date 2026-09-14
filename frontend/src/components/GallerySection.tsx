import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Image as ImageIcon, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/scheduleData';
import { GalleryPhoto } from '../types';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const categories = [
    { id: 'All', label: 'All Photos (सर्व क्षणचित्रे)' },
    { id: 'Aarti & Darshan', label: '🙏 Darshan & Aarti (दर्शन व आरती)' },
    { id: 'Aagaman', label: '🪔 Aagaman (आगमन)' },
    { id: 'Cultural', label: '💃 Events & Cultural (सांस्कृतिक स्पर्धा)' },
    { id: 'Mahaprasad', label: '🍽️ Mahaprasad (महाप्रसाद)' },
    { id: 'Visarjan', label: '🌊 Visarjan (विसर्जन)' },
  ];

  const filteredPhotos = activeCategory === 'All'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(p => p.category === activeCategory);

  const selectedPhoto = (selectedIndex !== null && selectedIndex >= 0 && selectedIndex < filteredPhotos.length)
    ? filteredPhotos[selectedIndex]
    : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && filteredPhotos.length > 0) {
      setSelectedIndex((selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null && filteredPhotos.length > 0) {
      setSelectedIndex((selectedIndex + 1) % filteredPhotos.length);
    }
  };

  // Keyboard navigation (Esc, Left, Right) & prevent background scroll
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => 
          prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : null
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => 
          prev !== null ? (prev + 1) % filteredPhotos.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedIndex, filteredPhotos.length]);

  return (
    <section 
      id="gallery" 
      className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/40 to-[#FEF7DA] scroll-mt-28 border-b border-amber-200"
    >
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/memories_2025_idol3.jpeg')" }}
      ></div>

      {/* Decorative Traditional Glow Accents */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header matching Canva */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-red-900 font-bold text-xs uppercase tracking-widest mb-3">
            <ImageIcon className="w-3.5 h-3.5 text-festival-saffron" />
            <span>📸 FESTIVAL MEMORIES & DARSHAN</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-950 font-festive tracking-tight mb-2">
            उत्सव स्मृती व क्षणचित्रे
          </h2>

          <p className="text-base sm:text-lg text-amber-900 font-semibold leading-relaxed font-marathi">
            ✨ प्राइड युनिव्हर्सल सोसायटीच्या गणेशोत्सवाची अविस्मरणीय छायाचित्रे आणि भक्तीमय आठवणी.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => {
            const count = cat.id === 'All' 
              ? GALLERY_PHOTOS.length 
              : GALLERY_PHOTOS.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-red-800 to-festival-saffron text-white shadow-md scale-105'
                    : 'bg-amber-100/70 text-slate-700 hover:bg-amber-200/70'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === cat.id ? 'bg-amber-300 text-red-950 font-extrabold' : 'bg-amber-200 text-slate-800'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setSelectedIndex(idx)}
              className={`group relative bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer festive-card-hover flex flex-col ${
                photo.isTopper
                  ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                  : 'border-amber-200 shadow-sm hover:shadow-xl'
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-3 rounded-full bg-white/30 backdrop-blur-md text-white shadow-lg">
                    <ZoomIn className="w-6 h-6" />
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-red-800/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-amber-300/40">
                  {photo.category}
                </span>

                {/* Topper / Featured Badge */}
                {(photo.badge || photo.isTopper) && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-yellow-300 text-red-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg border border-amber-200 flex items-center gap-1 animate-pulse">
                    {photo.badge || '⭐ Visarjan Topper'}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-red-800 transition-colors line-clamp-1">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-marathi">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen Lightbox Modal with Next/Prev navigation (Portalized to document.body) */}
        {selectedPhoto && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-fadeIn"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Modal Dialog Box - strictly viewport-constrained */}
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[86vh] sm:max-h-[84vh] flex flex-col overflow-hidden shadow-2xl border-2 border-amber-400 relative my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar with Title, Counter and Close Action */}
              <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-amber-100 border-b border-amber-400/40 shrink-0 select-none">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="text-base sm:text-lg flex-shrink-0">📸</span>
                  <h3 className="font-festive font-bold text-sm sm:text-base text-amber-200 truncate">
                    {selectedPhoto.title}
                  </h3>
                  {selectedPhoto.badge && (
                    <span className="hidden md:inline-flex text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-red-950 px-2 py-0.5 rounded-full border border-amber-300 flex-shrink-0">
                      {selectedPhoto.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className="text-xs text-amber-300 font-mono bg-black/40 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {(selectedIndex || 0) + 1} / {filteredPhotos.length}
                  </span>
                  <span className="hidden sm:inline-flex text-[11px] font-semibold bg-amber-900/60 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {selectedPhoto.category}
                  </span>
                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="p-1 sm:p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-red-700/80 transition-all cursor-pointer"
                    aria-label="Close"
                    title="Close (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Image Preview Container - Flex child strictly bounded so photo fits completely */}
              <div className="relative flex-1 min-h-[200px] max-h-[64vh] sm:max-h-[66vh] bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-auto h-auto object-contain mx-auto rounded-lg shadow-2xl transition-all duration-200 select-none block"
                  style={{
                    maxHeight: 'min(58vh, calc(82vh - 140px))',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                />

                {/* Prev / Next controls */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-amber-400 hover:text-red-950 text-white transition-all shadow-xl z-20 active:scale-95 border border-white/20 cursor-pointer"
                  aria-label="Previous photo"
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-amber-400 hover:text-red-950 text-white transition-all shadow-xl z-20 active:scale-95 border border-white/20 cursor-pointer"
                  aria-label="Next photo"
                  title="Next (Right Arrow)"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Caption Bar */}
              <div className="shrink-0 p-3 sm:p-4 bg-gradient-to-b from-white to-amber-50/80 border-t border-amber-200">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-red-950 font-festive">
                      {selectedPhoto.title}
                    </span>
                    {selectedPhoto.badge && (
                      <span className="md:hidden text-[10px] font-bold bg-amber-300 text-red-950 px-2 py-0.5 rounded-full">
                        {selectedPhoto.badge}
                      </span>
                    )}
                  </div>
                  <span className="sm:hidden text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    {selectedPhoto.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-marathi max-h-16 overflow-y-auto pr-1">
                  {selectedPhoto.caption}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </section>
  );
};
