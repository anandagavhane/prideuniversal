import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, RefreshCw, ZoomIn, ZoomOut, X } from 'lucide-react';
import { fetchDriveFolderPhotos } from '../services/googleSheetsService';
import { useBackButton } from '../hooks/useBackButton';

export interface CarouselSlide {
  id: string;
  name?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title: string;
  subtitle: string;
  category: string;
  badge?: string;
}

// Local photo dictionary mapping known photo keys/names to local static paths
export const LOCAL_PHOTO_MAP: Record<string, string> = {
  memories_visrjan_2025: '/photos/memories_visrjan_2025.jpg',
  memories_mahaprasad4: '/photos/memories_mahaprasad4.jpeg',
  memories_mahaprasad5: '/photos/memories_mahaprasad5.jpeg',
  memories_prasthan_2025: '/photos/memories_prasthan_2025.jpg',
  memories_mahaprasad1: '/photos/memories_mahaprasad1.jpeg',
  memories_mahaprasad2: '/photos/memories_mahaprasad2.jpeg',
  memories_mahaprasad3: '/photos/memories_mahaprasad3.jpeg',
  memories_mahaprasad_serve: '/photos/memories_mahaprasad_serve.jpeg',
  memories_advik_2025: '/photos/memories_advik_2025.jpg',
  img_20250908_wa0020: '/photos/img_20250908_wa0020.jpg',
  img_20250907_wa0118: '/photos/img_20250907_wa0118.jpg',
  memories_2025_ganesh_booking: '/photos/memories_2025_ganesh_booking.jpeg',
  img_20250907_wa0114: '/photos/img_20250907_wa0114.jpg',
  img_20250907_wa0048: '/photos/img_20250907_wa0048.jpg',
  img_20250907_wa0044: '/photos/img_20250907_wa0044.jpg',
  img_20250906_wa0049: '/photos/img_20250906_wa0049.jpg',
  memories_ganapati_devotte1: '/photos/memories_ganapati_devotte1.jpeg',
  memories_ganapati_devotee2: '/photos/memories_ganapati_devotee2.jpeg',
  memories_2025_idol: '/photos/memories_2025_idol.jpeg',
  memories_2025_idol2: '/photos/memories_2025_idol2.jpeg',
  memories_2025_idol3: '/photos/memories_2025_idol3.jpeg',
  memories_2025_idol_croped: '/photos/memories_2025_idol_croped.jpeg',
  memories_2025_aarti: '/photos/memories_2025_aarti.jpeg',
  img_20250906_wa0110: '/photos/img_20250906_wa0110.jpg',
  img_20250906_wa0108: '/photos/img_20250906_wa0108.jpg',
  img_20250830_wa0005: '/photos/img_20250830_wa0005.jpg',
  img_20250830_wa0009: '/photos/img_20250830_wa0009.jpg',
  img_20250907_wa0029: '/photos/img_20250907_wa0029.jpg',
  img_20250906_wa0112: '/photos/img_20250906_wa0112.jpg',
  img_20250830_wa0007: '/photos/img_20250830_wa0007.jpg'
};

/**
 * Searches for a local matching photo from the public/photos bundle
 */
export function findLocalPhotoMatch(nameOrId?: string): string | null {
  if (!nameOrId) return null;
  const clean = nameOrId
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/\s*-\s*copy/gi, '')
    .replace(/-/g, '_')
    .trim();

  for (const [k, v] of Object.entries(LOCAL_PHOTO_MAP)) {
    const kClean = k.toLowerCase().replace(/-/g, '_');
    if (clean === kClean || clean.includes(kClean) || kClean.includes(clean)) {
      return v;
    }
  }
  return null;
}

/**
 * Converts any Google Drive link or File ID into a high-speed direct CDN image stream URL
 */
export function formatDriveImageUrl(urlOrId?: string): string {
  if (!urlOrId) return '';
  if (urlOrId.startsWith('/')) {
    return urlOrId;
  }
  const match =
    urlOrId.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    urlOrId.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    urlOrId.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/) ||
    urlOrId.match(/^([a-zA-Z0-9_-]{20,})$/);

  if (match && match[1]) {
    // Direct Google CDN endpoint delivers crisp images immediately
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return urlOrId;
}

export const HERO_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 'c1',
    imageUrl: '/photos/memories_2025_idol_croped.jpeg',
    title: 'श्री गणेश मुख्य दर्शन (Divine Bappa Darshan)',
    subtitle: 'प्राइड युनिव्हर्सल परिवाराचे आराध्य दैवत विघ्नहर्ता गणपती बाप्पांचे मंगलमय दर्शन.',
    category: 'Darshan',
    badge: '👑 मुख्य दर्शन'
  },
  {
    id: 'c2',
    imageUrl: '/photos/img_20250908_wa0020.jpg',
    title: 'केबल ब्रिज भव्य विसर्जन मिरवणूक (Visarjan Night Procession)',
    subtitle: 'सुवर्ण रोषणाईने झगमगणाऱ्या केबल ब्रिजवरून बाप्पांची अथांग भक्तीमय अंतिम मिरवणूक.',
    category: 'Visarjan',
    badge: '⭐ विसर्जन सोहळा'
  },
  {
    id: 'c3',
    imageUrl: '/photos/memories_2025_idol.jpeg',
    title: 'मंदिर व मंडप कलात्मक सजावट (Temple & Mandap Decoration)',
    subtitle: 'प्रसाद जाधव व राहुल वाळुंज यांच्या कलात्मक संयोजनाने साकारलेली सुवर्ण रोषणाई व मखर.',
    category: 'Decoration',
    badge: '✨ मंडप सजावट'
  },
  {
    id: 'c4',
    imageUrl: '/photos/img_20250906_wa0108.jpg',
    title: 'भव्य बाईक रॅली व बाप्पांचे आगमन (Grand Aagaman Rally)',
    subtitle: 'भगवे ध्वज, ढोल-ताशांचा निनाद आणि तरुणाईच्या जल्लोषात बाप्पांचे वाजत-गाजत आगमन.',
    category: 'Aagaman',
    badge: '🪔 आगमन रॅली'
  },
  {
    id: 'c5',
    imageUrl: '/photos/memories_2025_aarti.jpeg',
    title: 'सामूहिक संध्या महाआरती (Sandhya Maha Aarti)',
    subtitle: 'सर्व रहिवासी, महिला व बालकांच्या उपस्थितीत बाप्पांची मंगल आरती व दीप आराधना.',
    category: 'Aarti',
    badge: '🙏 महाआरती'
  },
  {
    id: 'c6',
    imageUrl: '/photos/img_20250906_wa0110.jpg',
    title: 'पारंपारिक लेझीम व महिला मंडळ नृत्य (Traditional Lezim)',
    subtitle: 'पारंपारिक नऊवारी साड्या नेसून महिला व युवतींनी बाप्पांच्या स्वागतात सादर केलेले लेझीम.',
    category: 'Cultural',
    badge: '💃 सांस्कृतिक'
  },
  {
    id: 'c7',
    imageUrl: '/photos/memories_mahaprasad_serve.jpeg',
    title: 'सोसायटी महाप्रसाद सोहळा (Community Mahaprasad)',
    subtitle: 'सत्यनारायण पूजेनंतर सर्व सोसायटी सदस्यांचा एकत्र स्नेहभोजन व महाप्रसाद सोहळा.',
    category: 'Mahaprasad',
    badge: '🍽️ महाप्रसाद'
  },
  {
    id: 'c8',
    imageUrl: '/photos/memories_visrjan_2025.jpg',
    title: 'पुढच्या वर्षी लवकर या! (Final Visarjan Ceremony)',
    subtitle: 'गुलाल व फुलांच्या उधळणीत बाप्पांना भावपूर्ण निरोप व पुढच्या वर्षाची आस.',
    category: 'Visarjan',
    badge: '🌊 अंतिम निरोप'
  }
];

interface HeroCarouselProps {
  slides?: CarouselSlide[];
  onNavigate?: (sectionId: string) => void;
  autoPlayInterval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides: initialSlides = HERO_CAROUSEL_SLIDES,
  autoPlayInterval = 4000
}) => {
  const [activeSlides, setActiveSlides] = useState<CarouselSlide[]>(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageFallbacks, setImageFallbacks] = useState<Record<string, string>>({});
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAutoZoom, setIsAutoZoom] = useState(true);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  useBackButton('hero-zoom-modal', isZoomModalOpen, () => setIsZoomModalOpen(false), 85);
  const [modalZoomScale, setModalZoomScale] = useState(1);

  const loadPhotos = useCallback(async () => {
    try {
      const drivePhotos = await fetchDriveFolderPhotos();
      if (drivePhotos && drivePhotos.length > 0) {
        const mappedSlides: CarouselSlide[] = drivePhotos.map((p, idx) => ({
          id: p.id,
          name: p.name,
          imageUrl: p.imageUrl,
          thumbnailUrl: p.thumbnailUrl,
          title: p.title || `गणेशोत्सव २०२६ क्षणचित्र #${idx + 1}`,
          subtitle: p.subtitle || 'प्राइड युनिव्हर्सल गणेशोत्सव २०२६ थेट क्षणचित्रे',
          category: 'Live',
          badge: '📸 उत्सव २०२६'
        }));
        setActiveSlides(mappedSlides);
      }
    } catch (err) {
      console.warn('Error loading drive photos:', err);
    }
  }, []);

  // Fetch photos on mount, on window focus, and periodically every 30 seconds
  useEffect(() => {
    loadPhotos();

    const handleFocus = () => {
      loadPhotos();
    };
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      loadPhotos();
    }, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [loadPhotos]);

  const handleManualRefresh = async () => {
    setIsSyncing(true);
    await loadPhotos();
    setTimeout(() => setIsSyncing(false), 600);
  };

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleNext = useCallback(() => {
    setIsImageLoading(true);
    setActiveSlides((currentSlides) => {
      setCurrentIndex((prev) => (prev + 1) % currentSlides.length);
      return currentSlides;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setIsImageLoading(true);
    setActiveSlides((currentSlides) => {
      setCurrentIndex((prev) => (prev - 1 + currentSlides.length) % currentSlides.length);
      return currentSlides;
    });
  }, []);

  // Keyboard navigation when zoom modal is open
  useEffect(() => {
    if (!isZoomModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomModalOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomModalOpen, handlePrev, handleNext]);

  // Auto-play timer management
  useEffect(() => {
    if (isPlaying && !isHovered) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, autoPlayInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, autoPlayInterval, handleNext]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const currentSlide = activeSlides[currentIndex] || activeSlides[0] || initialSlides[0];

  // Resolve the active image URL with hierarchical fallback
  const resolvedImageUrl =
    imageFallbacks[currentSlide.id] ||
    formatDriveImageUrl(currentSlide.imageUrl || currentSlide.thumbnailUrl) ||
    findLocalPhotoMatch(currentSlide.name || currentSlide.title || currentSlide.id) ||
    '/photos/memories_2025_idol_croped.jpeg';

  const handleImageError = () => {
    const slide = currentSlide;
    console.warn(`[HeroCarousel] Failed to load image: ${slide.imageUrl} for ${slide.name || slide.title}`);

    // If current was direct lh3, try drive thumbnail endpoint
    if (!imageFallbacks[slide.id] && slide.id && slide.id.length > 20) {
      setImageFallbacks((prev) => ({
        ...prev,
        [slide.id]: `https://drive.google.com/thumbnail?id=${slide.id}&sz=w1600`
      }));
      return;
    }

    // If not already fallen back, try local matching
    const localMatch = findLocalPhotoMatch(slide.name || slide.title || slide.id);
    if (localMatch) {
      setImageFallbacks((prev) => ({
        ...prev,
        [slide.id]: localMatch
      }));
      return;
    }

    // Ultimate safe fallback to festive hero image
    setImageFallbacks((prev) => ({
      ...prev,
      [slide.id]: '/photos/memories_2025_idol_croped.jpeg'
    }));
  };

  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto mb-14 px-2 sm:px-4">
      {/* Grand Full-Page Carousel Container */}
      <div
        className="relative w-full rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl border-2 sm:border-3 border-amber-400/80 bg-slate-950 h-[480px] sm:h-[580px] md:h-[660px] lg:h-[720px] max-h-[82vh] select-none group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Ambient Blurred Background of current slide with Auto-Zoom */}
        <div
          className={`absolute inset-0 bg-cover bg-center blur-3xl opacity-45 pointer-events-none transition-all duration-700 ${
            isAutoZoom ? 'animate-ambient-zoom' : 'scale-110'
          }`}
          style={{ backgroundImage: `url('${resolvedImageUrl}')` }}
        ></div>

        {/* Foreground Centered Image strictly fitted with Auto-Zoom */}
        <div 
          className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-6 z-10 overflow-hidden cursor-zoom-in group/img"
          onClick={() => {
            setModalZoomScale(1);
            setIsZoomModalOpen(true);
          }}
          title="Click to Zoom Fullscreen"
        >
          <img
            key={`${currentSlide.id}-${imageFallbacks[currentSlide.id] || 'primary'}`}
            src={resolvedImageUrl}
            alt={currentSlide.title}
            referrerPolicy="no-referrer"
            onLoad={() => setIsImageLoading(false)}
            onError={handleImageError}
            className={`w-full h-full object-contain mx-auto rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-opacity duration-500 will-change-transform select-none ${
              isAutoZoom ? 'animate-carousel-zoom' : ''
            } ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
          />

          {/* Hover Zoom Hint Badge */}
          <div className="absolute top-4 right-4 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 text-amber-200 text-xs font-bold border border-amber-300/40 shadow-xl backdrop-blur-md">
              <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
              <span>Zoom View</span>
            </span>
          </div>
        </div>

        {/* Top Floating Badges & Controls Bar */}
        <div className="absolute top-3 inset-x-3 sm:top-5 sm:inset-x-6 flex items-center justify-between z-20 pointer-events-none">
          {/* Section Indicator */}
          <div className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/85 backdrop-blur-md text-amber-200 border border-amber-400/40 text-xs sm:text-sm font-bold shadow-xl">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
            <span>गणेशोत्सव २०२६ थेट क्षणचित्रे • FESTIVAL 2026 LIVE</span>
          </div>

          {/* Right Controls: Index Badge + Auto-Zoom Toggle + Sync Button + Pause/Play */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm text-amber-300 font-mono bg-black/80 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-amber-400/30 shadow-xl font-bold">
              {currentIndex + 1} / {activeSlides.length}
            </span>

            {/* Auto-Zoom Indicator & Toggle */}
            <button
              onClick={() => setIsAutoZoom(prev => !prev)}
              className={`px-2.5 py-1 rounded-full backdrop-blur-md border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xl ${
                isAutoZoom 
                  ? 'bg-amber-400 text-red-950 border-amber-300 font-black shadow-amber-400/20' 
                  : 'bg-black/80 text-amber-200/80 border-amber-400/30 hover:text-white'
              }`}
              title={isAutoZoom ? 'Auto Zoom ON (Click to toggle)' : 'Auto Zoom OFF (Click to toggle)'}
              aria-label="Toggle Auto Zoom"
            >
              <ZoomIn className={`w-3.5 h-3.5 ${isAutoZoom ? 'text-red-950 animate-pulse' : 'text-amber-300'}`} />
              <span className="hidden sm:inline">Auto Zoom</span>
            </button>

            <button
              onClick={handleManualRefresh}
              className={`p-1.5 sm:p-2 rounded-full bg-black/80 backdrop-blur-md hover:bg-amber-400 hover:text-red-950 text-amber-200 border border-amber-400/30 shadow-xl transition-all cursor-pointer ${
                isSyncing ? 'animate-spin text-amber-300' : ''
              }`}
              title="Refresh photos"
              aria-label="Refresh photos"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(prev => !prev)}
              className="p-1.5 sm:p-2 rounded-full bg-black/80 backdrop-blur-md hover:bg-amber-400 hover:text-red-950 text-amber-200 border border-amber-400/30 shadow-xl transition-all cursor-pointer"
              title={isPlaying ? 'Pause Auto-play' : 'Resume Auto-play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/65 hover:bg-amber-400 hover:text-red-950 text-white transition-all shadow-2xl active:scale-95 border border-white/20 cursor-pointer"
          aria-label="Previous slide"
          title="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/65 hover:bg-amber-400 hover:text-red-950 text-white transition-all shadow-2xl active:scale-95 border border-white/20 cursor-pointer"
          aria-label="Next slide"
          title="Next slide"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 sm:p-6 md:p-8 z-20 text-left">
          <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white font-festive drop-shadow-md">
              {currentSlide.title}
            </h3>
            {currentSlide.badge && (
              <span className="text-[11px] sm:text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-red-950 px-3 py-0.5 rounded-full border border-amber-300 shadow-md">
                {currentSlide.badge}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm md:text-base text-amber-100/95 font-marathi leading-relaxed line-clamp-2 drop-shadow-sm mb-3.5 max-w-3xl">
            {currentSlide.subtitle}
          </p>

          {/* Dots Pagination - cleanly scrollable without visible scrollbar */}
          <div 
            className="flex items-center gap-1 sm:gap-1.5 max-w-full overflow-x-auto py-1 no-scrollbar select-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {activeSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsImageLoading(true);
                }}
                className={`shrink-0 transition-all duration-300 cursor-pointer rounded-full ${
                  idx === currentIndex
                    ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-gradient-to-r from-amber-400 to-yellow-300 shadow-sm'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                title={slide.title}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Interactive Zoom Modal */}
      {isZoomModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomModalOpen(false)}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-2 sm:p-4 text-white z-20" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-amber-300 font-festive">
                {currentSlide.title}
              </span>
              {currentSlide.badge && (
                <span className="text-[10px] font-black bg-amber-400 text-red-950 px-2 py-0.5 rounded-full">
                  {currentSlide.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Scale Buttons */}
              <button
                onClick={() => setModalZoomScale(prev => Math.max(1, prev - 0.25))}
                disabled={modalZoomScale <= 1}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white cursor-pointer transition-all"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-amber-300 min-w-10 text-center">
                {Math.round(modalZoomScale * 100)}%
              </span>
              <button
                onClick={() => setModalZoomScale(prev => Math.min(2.5, prev + 0.25))}
                disabled={modalZoomScale >= 2.5}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white cursor-pointer transition-all"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="p-1.5 rounded-lg bg-red-800/80 hover:bg-red-700 text-white cursor-pointer transition-all ml-2"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Zoomed Image */}
          <div 
            className="relative flex-1 flex items-center justify-center overflow-auto p-2"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={resolvedImageUrl}
              alt={currentSlide.title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl transition-transform duration-300 select-none cursor-grab active:cursor-grabbing"
              style={{ transform: `scale(${modalZoomScale})` }}
              draggable={false}
            />

            {/* Modal Prev / Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-amber-400 hover:text-red-950 text-white transition-all shadow-2xl active:scale-95 border border-white/20 cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-amber-400 hover:text-red-950 text-white transition-all shadow-2xl active:scale-95 border border-white/20 cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Footer Bar */}
          <div className="p-3 text-center text-xs sm:text-sm text-amber-200/90 font-marathi bg-black/60 backdrop-blur-md rounded-xl max-w-2xl mx-auto mb-2" onClick={e => e.stopPropagation()}>
            {currentSlide.subtitle}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
