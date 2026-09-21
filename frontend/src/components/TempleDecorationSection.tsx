import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  RefreshCw, 
  Maximize2, 
  Flame, 
  Gamepad2, 
  Heart, 
  Share2, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Monitor,
  Check,
  Play,
  Pause,
  ExternalLink
} from 'lucide-react';
import { 
  fetchTempleDecorationSlides, 
  DecorationSlide, 
  DEFAULT_DECORATION_SLIDES, 
  formatSafeDriveUrl 
} from '../services/googleSheetsService';
import { useBackButton } from '../hooks/useBackButton';

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

  // Active slide indices
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);

  // View presentation mode: 'reels' (vertical feed) vs 'classic' (16:9 side-by-side)
  // Default to reels mode on mobile, classic on large screens
  const [viewMode, setViewMode] = useState<'reels' | 'classic'>('reels');

  // Interactive reels state
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [modalFullscreenReels, setModalFullscreenReels] = useState<boolean>(false);
  useBackButton('fullscreen-reels', modalFullscreenReels, () => setModalFullscreenReels(false), 95);
  useBackButton('decor-image-modal', isImageModalOpen, () => setIsImageModalOpen(false), 90);
  const [directVideoError, setDirectVideoError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Playback & Interaction States
  const [isPlayingState, setIsPlayingState] = useState<Record<number, boolean>>({});
  const [showPlayIconIndex, setShowPlayIconIndex] = useState<number | null>(null);
  const [activatedDriveVideos, setActivatedDriveVideos] = useState<Record<number, boolean>>({});

  // Like counters with localStorage persistence (starts cleanly at 0 or user saved count)
  const [likesState, setLikesState] = useState<Record<string, { count: number; liked: boolean }>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('festival_reels_likes');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Could not read reels likes from localStorage', e);
      }
    }
    return {};
  });

  // Container refs for vertical scroll snap
  const reelsFeedRef = useRef<HTMLDivElement>(null);
  const fullscreenReelsFeedRef = useRef<HTMLDivElement>(null);
  const reelVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fullscreenVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const inlineClassicVideoRef = useRef<HTMLVideoElement>(null);

  // Touch swipe gesture tracking refs
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const isWheelThrottled = useRef<boolean>(false);

  // Sync when propSlides update
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
    const interval = setInterval(fetchLatest, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [customTempleImageUrl]);

  const slides = (propSlides && propSlides.length > 0) ? propSlides : internalSlides;

  // Selected reel category filter: 'all' | 'dance' | 'shloka' | 'singing' | 'piano' | 'games' | 'highlights'
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentReelSlides = React.useMemo(() => {
    if (selectedCategory === 'all') return slides;
    return slides.filter((s) => {
      const cat = (s.category || '').toLowerCase();
      const title = (s.title || '').toLowerCase();
      const sub = (s.subtitle || '').toLowerCase();
      if (selectedCategory === 'dance') return cat.includes('नृत्य') || title.includes('dance') || sub.includes('dance');
      if (selectedCategory === 'shloka') return cat.includes('श्लोक') || title.includes('shloka') || sub.includes('shloka');
      if (selectedCategory === 'singing') return cat.includes('गायन') || title.includes('sing') || sub.includes('sing');
      if (selectedCategory === 'piano') return cat.includes('पियानो') || title.includes('piano') || sub.includes('piano');
      if (selectedCategory === 'games') return cat.includes('खेळ') || title.includes('game') || title.includes('race') || sub.includes('game');
      if (selectedCategory === 'highlights') return cat.includes('उत्सव') || title.includes('day') || title.includes('aarti') || sub.includes('aarti') || !s.category;
      return true;
    });
  }, [slides, selectedCategory]);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      all: slides.length,
      dance: 0,
      shloka: 0,
      singing: 0,
      piano: 0,
      games: 0,
      highlights: 0
    };
    slides.forEach((s) => {
      const cat = (s.category || '').toLowerCase();
      const title = (s.title || '').toLowerCase();
      const sub = (s.subtitle || '').toLowerCase();
      if (cat.includes('नृत्य') || title.includes('dance') || sub.includes('dance')) counts.dance++;
      else if (cat.includes('श्लोक') || title.includes('shloka') || sub.includes('shloka')) counts.shloka++;
      else if (cat.includes('गायन') || title.includes('sing') || sub.includes('sing')) counts.singing++;
      else if (cat.includes('पियानो') || title.includes('piano') || sub.includes('piano')) counts.piano++;
      else if (cat.includes('खेळ') || title.includes('game') || title.includes('race') || sub.includes('game')) counts.games++;
      else counts.highlights++;
    });
    return counts;
  }, [slides]);

  // Active current slide for classic view
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

  // Toggle Like with animation & local persistence (clean starting from 0)
  const handleToggleLike = useCallback((slideId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikesState((prev) => {
      const current = prev[slideId] || { count: 0, liked: false };
      const nextLiked = !current.liked;
      const updated = {
        ...prev,
        [slideId]: {
          count: nextLiked ? current.count + 1 : Math.max(0, current.count - 1),
          liked: nextLiked
        }
      };
      try {
        localStorage.setItem('festival_reels_likes', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed saving likes', err);
      }
      return updated;
    });
    setToastMessage((prev) => (prev ? null : '❤️ जय गणेश! Liked'));
    setTimeout(() => setToastMessage(null), 1500);
  }, []);

  // Stop/pause all videos except the specified index so only ONE video plays at any time
  const stopAllOtherMedia = useCallback((exceptIdx?: number, isFullscreenTarget?: boolean) => {
    // 1. Pause HTML5 videos in reel feed
    reelVideoRefs.current.forEach((videoEl, idx) => {
      if (videoEl && idx !== exceptIdx && !videoEl.paused) {
        try {
          videoEl.pause();
        } catch {
          // ignore
        }
      }
    });

    // 2. Pause HTML5 videos in fullscreen modal
    fullscreenVideoRefs.current.forEach((videoEl, idx) => {
      if (videoEl && idx !== exceptIdx && !videoEl.paused) {
        try {
          videoEl.pause();
        } catch {
          // ignore
        }
      }
    });

    // 3. Pause classic 16:9 inline video if not active
    if (inlineClassicVideoRef.current && !inlineClassicVideoRef.current.paused) {
      if (exceptIdx === undefined || viewMode === 'reels') {
        try {
          inlineClassicVideoRef.current.pause();
        } catch {
          // ignore
        }
      }
    }

    // 4. Pause all YouTube iframes (both reel and fullscreen)
    if (typeof document !== 'undefined') {
      const ytIframes = document.querySelectorAll<HTMLIFrameElement>('iframe[data-reel-yt], iframe[data-fullscreen-yt]');
      ytIframes.forEach((iframe) => {
        const reelAttr = iframe.getAttribute('data-reel-yt');
        const fsAttr = iframe.getAttribute('data-fullscreen-yt');
        const frameIdx = Number(reelAttr ?? fsAttr);
        const isThisFullscreen = fsAttr !== null;

        // Pause if it's a different slide, or if we switched between reel/fullscreen
        if (frameIdx !== exceptIdx || isThisFullscreen !== Boolean(isFullscreenTarget)) {
          try {
            iframe.contentWindow?.postMessage(
              JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
              '*'
            );
          } catch {
            // ignore cross-origin error
          }
        }
      });
    }

    // 5. Deactivate other Google Drive videos so their iframes are unmounted (only exceptIdx remains active)
    setActivatedDriveVideos((prev) => {
      if (exceptIdx === undefined) return {};
      const keys = Object.keys(prev);
      if (keys.length === 1 && keys[0] === String(exceptIdx)) return prev;
      return { [exceptIdx]: true };
    });

    // 6. Sync isPlayingState
    setIsPlayingState((prev) => {
      const updated: Record<number, boolean> = {};
      if (exceptIdx !== undefined && prev[exceptIdx]) {
        updated[exceptIdx] = true;
      }
      return updated;
    });
  }, [viewMode]);

  // Handle direct tap/click on a video to play/pause or activate
  // Handle direct tap/click on a video to play/pause or activate
  const handleVideoClick = useCallback((idx: number, isFullscreen: boolean = false) => {
    const slideList = (isFullscreen || viewMode === 'reels') ? currentReelSlides : slides;
    const slide = slideList[idx];
    if (!slide) return;

    const isVid = slide.mediaType === 'video' || slide.mediaType === 'drive-video' || slide.mediaType === 'youtube';

    if (!isVid) {
      setIsImageModalOpen(true);
      return;
    }

    // 1. Google Drive Video: stop all others and activate only this one
    if (slide.mediaType === 'drive-video') {
      stopAllOtherMedia(idx, isFullscreen);
      setActivatedDriveVideos({ [idx]: true });
      setIsPlayingState({ [idx]: true });
      setShowPlayIconIndex(idx);
      setTimeout(() => setShowPlayIconIndex(null), 800);
      return;
    }

    // 2. Direct HTML5 Video
    const videoList = isFullscreen ? fullscreenVideoRefs.current : reelVideoRefs.current;
    const videoEl = videoList[idx];
    if (videoEl) {
      if (videoEl.paused) {
        stopAllOtherMedia(idx, isFullscreen);
        videoEl.muted = isMuted;
        videoEl.play().then(() => {
          setIsPlayingState({ [idx]: true });
        }).catch((err) => {
          console.warn('Play error:', err);
        });
      } else {
        videoEl.pause();
        setIsPlayingState({});
      }
      setShowPlayIconIndex(idx);
      setTimeout(() => setShowPlayIconIndex(null), 800);
      return;
    }

    // 3. YouTube Video via PostMessage
    if (slide.mediaType === 'youtube') {
      const selector = isFullscreen ? `iframe[data-fullscreen-yt="${idx}"]` : `iframe[data-reel-yt="${idx}"]`;
      const iframe = document.querySelector<HTMLIFrameElement>(selector);
      if (iframe && iframe.contentWindow) {
        const currentlyPlaying = isPlayingState[idx] === true;
        if (!currentlyPlaying) {
          stopAllOtherMedia(idx, isFullscreen);
          iframe.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'playVideo',
              args: ''
            }),
            '*'
          );
          setIsPlayingState({ [idx]: true });
        } else {
          iframe.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'pauseVideo',
              args: ''
            }),
            '*'
          );
          setIsPlayingState({});
        }
        setShowPlayIconIndex(idx);
        setTimeout(() => setShowPlayIconIndex(null), 800);
      }
    }
  }, [slides, currentReelSlides, viewMode, isMuted, isPlayingState, stopAllOtherMedia]);

  // Native share or clipboard copy
  const handleShareReel = useCallback((slide: DecorationSlide, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#temple-decoration` : '';
    const shareText = `🚩 प्राइड युनिव्हर्सल गणेशोत्सव २०२६: ${slide.title} - ${slide.subtitle || ''}`;

    if (navigator.share) {
      navigator.share({
        title: slide.title,
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setToastMessage('लिंक कॉपी झाली! (Link Copied)');
      setTimeout(() => setToastMessage(null), 2500);
    }
  }, []);

  // Smooth scroll to specific reel in vertical container
  const scrollToReel = useCallback((targetIndex: number, isFullscreen: boolean = false) => {
    const total = (isFullscreen || viewMode === 'reels') ? currentReelSlides.length : slides.length;
    if (targetIndex < 0 || targetIndex >= total) return;
    const container = isFullscreen ? fullscreenReelsFeedRef.current : reelsFeedRef.current;
    if (!container) return;

    // Immediately stop all other media so only target reel can play
    stopAllOtherMedia(targetIndex, isFullscreen);

    const targetChild = container.children[targetIndex] as HTMLElement;
    if (targetChild) {
      targetChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveReelIndex(targetIndex);
      setCurrentSlideIndex(targetIndex);
    }
  }, [slides.length, currentReelSlides.length, viewMode, stopAllOtherMedia]);

  // Touch swipe handlers to guarantee vertical swipe up / down on any mobile screen
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent, isFullscreen: boolean = false) => {
    if (touchStartY.current === null) return;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const duration = Date.now() - touchStartTime.current;
    touchStartY.current = null;

    // Fast swipe gesture: > 35px in under 700ms
    if (Math.abs(diffY) > 35 && duration < 700) {
      if (diffY > 0) {
        // Swipe up -> Next Reel
        scrollToReel(activeReelIndex + 1, isFullscreen);
      } else {
        // Swipe down -> Previous Reel
        scrollToReel(activeReelIndex - 1, isFullscreen);
      }
    }
  };

  // Mouse wheel scroll handler on desktop
  const handleWheelScroll = (e: React.WheelEvent, isFullscreen: boolean = false) => {
    if (isWheelThrottled.current) return;
    if (Math.abs(e.deltaY) > 25) {
      isWheelThrottled.current = true;
      if (e.deltaY > 0) {
        scrollToReel(activeReelIndex + 1, isFullscreen);
      } else {
        scrollToReel(activeReelIndex - 1, isFullscreen);
      }
      setTimeout(() => {
        isWheelThrottled.current = false;
      }, 450);
    }
  };

  // Setup IntersectionObserver for Embedded Reels Feed
  useEffect(() => {
    if (viewMode !== 'reels') return;
    const container = reelsFeedRef.current;
    if (!container) return;

    const children = Array.from(container.children);
    if (children.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-reel-index'));
            if (!isNaN(index)) {
              setActiveReelIndex(index);
              setCurrentSlideIndex(index);

              // Immediately pause all previous videos across HTML5, Drive & YouTube
              stopAllOtherMedia(index, false);

              // Play new video if this reel is a direct video
              const currentVideo = reelVideoRefs.current[index];
              if (currentVideo && currentReelSlides[index]?.mediaType === 'video') {
                currentVideo.muted = isMuted;
                currentVideo.defaultMuted = isMuted;
                currentVideo.play().then(() => {
                  setIsPlayingState({ [index]: true });
                }).catch(() => {});
              }
              // Play YouTube if active
              if (currentReelSlides[index]?.mediaType === 'youtube') {
                const iframe = document.querySelector<HTMLIFrameElement>(`iframe[data-reel-yt="${index}"]`);
                if (iframe && iframe.contentWindow) {
                  iframe.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
                    '*'
                  );
                  setIsPlayingState({ [index]: true });
                }
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.55
      }
    );

    children.forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
    };
  }, [viewMode, currentReelSlides, isMuted, stopAllOtherMedia]);

  // Setup IntersectionObserver for Fullscreen Reels Feed Modal
  useEffect(() => {
    if (!isImageModalOpen || !modalFullscreenReels) return;
    const container = fullscreenReelsFeedRef.current;
    if (!container) return;

    const children = Array.from(container.children);
    if (children.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-fullscreen-reel-index'));
            if (!isNaN(index)) {
              setActiveReelIndex(index);
              setCurrentSlideIndex(index);

              // Immediately pause all previous videos across HTML5, Drive & YouTube
              stopAllOtherMedia(index, true);

              const currentVideo = fullscreenVideoRefs.current[index];
              if (currentVideo && currentReelSlides[index]?.mediaType === 'video') {
                currentVideo.muted = isMuted;
                currentVideo.defaultMuted = isMuted;
                currentVideo.play().then(() => {
                  setIsPlayingState({ [index]: true });
                }).catch(() => {});
              }
              if (currentReelSlides[index]?.mediaType === 'youtube') {
                const iframe = document.querySelector<HTMLIFrameElement>(`iframe[data-fullscreen-yt="${index}"]`);
                if (iframe && iframe.contentWindow) {
                  iframe.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
                    '*'
                  );
                  setIsPlayingState({ [index]: true });
                }
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.55
      }
    );

    children.forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
    };
  }, [isImageModalOpen, modalFullscreenReels, currentReelSlides, isMuted, stopAllOtherMedia]);

  // When modal closes, immediately stop any playing media
  useEffect(() => {
    if (!isImageModalOpen) {
      stopAllOtherMedia();
    }
  }, [isImageModalOpen, stopAllOtherMedia]);

  // When switching viewMode, stop any playing media
  useEffect(() => {
    stopAllOtherMedia();
  }, [viewMode, stopAllOtherMedia]);

  // Sync mute property across all video elements when isMuted changes
  useEffect(() => {
    reelVideoRefs.current.forEach((video) => {
      if (video) {
        video.muted = isMuted;
        video.defaultMuted = isMuted;
      }
    });
    fullscreenVideoRefs.current.forEach((video) => {
      if (video) {
        video.muted = isMuted;
        video.defaultMuted = isMuted;
      }
    });
    if (inlineClassicVideoRef.current) {
      inlineClassicVideoRef.current.muted = isMuted;
      inlineClassicVideoRef.current.defaultMuted = isMuted;
    }
  }, [isMuted]);

  // Keyboard navigation for reels & modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isImageModalOpen) {
        if (e.key === 'Escape') {
          setIsImageModalOpen(false);
          setModalFullscreenReels(false);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          scrollToReel(activeReelIndex - 1, modalFullscreenReels);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          scrollToReel(activeReelIndex + 1, modalFullscreenReels);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageModalOpen, modalFullscreenReels, activeReelIndex, scrollToReel]);

  // Concise chip label helper
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
      return `${day}: ${rest.length > 12 ? `${rest.slice(0, 10)}…` : rest}`;
    }
    return clean.length > 16 ? `${clean.slice(0, 14)}…` : clean;
  };

  return (
    <section 
      id="temple-decoration" 
      className="relative overflow-hidden py-6 sm:py-16 px-2 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/40 to-[#FEF7DA] border-b border-amber-200 scroll-mt-24"
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
        {/* Main Card Container with edge-fitting padding on mobile */}
        <div className="bg-gradient-to-r from-amber-100/95 via-orange-50/95 to-amber-50 rounded-2xl sm:rounded-3xl p-2.5 sm:p-7 md:p-8 border-2 border-amber-300 shadow-xl overflow-hidden">
          
          {/* Top Section Header with View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 sm:pb-5 border-b border-amber-200/90 mb-4 sm:mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-900 font-extrabold text-xs uppercase tracking-widest shadow-2xs mb-2">
                <Sparkles className="w-3.5 h-3.5 text-festival-saffron" />
                <span>FESTIVAL LIVE GLIMPSES &amp; REELS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-red-950 font-festive leading-tight">
                थेट उत्सव क्षणचित्रे व रील्स
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 font-medium mt-0.5">
                दैनिक महाआरती दर्शन, बाप्पांची दिव्य आरास आणि आनंदोत्सव
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              {/* Mobile / Desktop View Mode Switcher */}
              <div className="inline-flex items-center bg-white/90 p-1 rounded-xl border border-amber-300 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('reels')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    viewMode === 'reels'
                      ? 'bg-gradient-to-r from-red-800 to-festival-saffron text-white shadow-xs'
                      : 'text-amber-950 hover:bg-amber-100/70'
                  }`}
                  title="Vertical Reels Feed Mode (Scroll Up & Down)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>रील्स फीड (Reels)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('classic')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    viewMode === 'classic'
                      ? 'bg-gradient-to-r from-red-800 to-festival-saffron text-white shadow-xs'
                      : 'text-amber-950 hover:bg-amber-100/70'
                  }`}
                  title="Classic 16:9 Showcase Mode"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>क्लासिक (Classic)</span>
                </button>
              </div>

              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-950 bg-amber-200/90 hover:bg-amber-300 px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  title="Refresh live media"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden xs:inline">Refresh</span>
                </button>
              )}
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-amber-200 px-4 py-2 rounded-2xl border border-amber-400 shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW MODE 1: VERTICAL REELS FEED (MOBILE & DESKTOP)       */}
          {/* Sized perfectly for Small, Medium & Big Mobile Screens    */}
          {/* NO SCROLLER / SCROLLBAR SHOWN                             */}
          {/* ========================================================= */}
          {viewMode === 'reels' ? (
            <div className="flex flex-col items-center w-full">
              {/* Category Filter Pills Bar */}
              <div className="w-full flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2.5 mb-3 no-scrollbar scrollbar-none max-w-full">
                {[
                  { id: 'all', label: 'सर्व रील्स', count: categoryCounts.all, icon: '✨' },
                  { id: 'dance', label: 'नृत्य', count: categoryCounts.dance, icon: '💃' },
                  { id: 'shloka', label: 'श्लोक', count: categoryCounts.shloka, icon: '📖' },
                  { id: 'singing', label: 'गायन', count: categoryCounts.singing, icon: '🎤' },
                  { id: 'piano', label: 'पियानो', count: categoryCounts.piano, icon: '🎹' },
                  { id: 'games', label: 'खेळ', count: categoryCounts.games, icon: '🏃‍♂️' },
                  { id: 'highlights', label: 'उत्सव क्षण', count: categoryCounts.highlights, icon: '🚩' }
                ].filter(c => c.count > 0).map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveReelIndex(0);
                        stopAllOtherMedia();
                        if (reelsFeedRef.current) {
                          reelsFeedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border flex-shrink-0 ${
                        isSelected
                          ? 'bg-gradient-to-r from-red-800 to-festival-saffron text-white border-amber-400 shadow-sm scale-105'
                          : 'bg-white/90 hover:bg-amber-100 text-slate-800 border-amber-300/80 shadow-2xs'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isSelected ? 'bg-black/30 text-amber-200' : 'bg-amber-200/80 text-amber-950'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-5 lg:gap-8 w-full">
                {/* The Vertical Snap-Scrolling Reels Stage: Responsively fitted for Small, Medium & Big Mobile Screens */}
                <div 
                  className="relative w-full max-w-full xs:max-w-[390px] sm:max-w-[420px] md:max-w-[440px] mx-auto h-[74dvh] min-h-[460px] max-h-[720px] sm:h-[640px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-amber-400/90 bg-black flex flex-col select-none touch-pan-y"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={(e) => handleTouchEnd(e, false)}
                  onWheel={(e) => handleWheelScroll(e, false)}
                >
                  {/* Reels Top Floating Header Bar */}
                  <div className="absolute top-0 inset-x-0 z-30 p-3 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between pointer-events-auto select-none">
                    {/* Active Reel Counter & Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 text-amber-200 text-[11px] font-extrabold shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      <span>Reel {activeReelIndex + 1} / {currentReelSlides.length}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Audio / Sound Toggle */}
                      <button
                        type="button"
                        onClick={() => setIsMuted((prev) => !prev)}
                        className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-400/40 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                        title={isMuted ? 'Unmute Sound (आवाज चालू करा)' : 'Mute Sound (आवाज बंद करा)'}
                        aria-label="Toggle Sound"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
                      </button>

                      {/* Fullscreen Expand */}
                      <button
                        type="button"
                        onClick={() => {
                          setModalFullscreenReels(true);
                          setIsImageModalOpen(true);
                        }}
                        className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-400/40 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                        title="Fullscreen Reels (पूर्ण स्क्रीन रील्स)"
                        aria-label="Fullscreen Reels"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Top Stories Progress Indicator */}
                  <div className="absolute top-1.5 inset-x-3 z-30 flex items-center pointer-events-none">
                    <div className="w-full bg-white/25 h-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-festival-saffron transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(4, ((activeReelIndex + 1) / Math.max(1, currentReelSlides.length)) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Scrollable Container with Vertical Snap-Scrolling (Scroll UP & DOWN - NO SCROLLER SHOWN) */}
                  <div
                    ref={reelsFeedRef}
                    className="w-full h-full overflow-y-scroll overscroll-y-contain snap-y snap-mandatory flex flex-col relative select-none no-scrollbar touch-pan-y"
                    style={{
                      scrollSnapType: 'y mandatory',
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                    tabIndex={0}
                    aria-label="Vertical Reels Feed. Scroll up or down."
                  >
                    {currentReelSlides.map((slide, idx) => {
                    const isVid = slide.mediaType === 'youtube' || slide.mediaType === 'drive-video' || slide.mediaType === 'video';
                    const isCurrent = idx === activeReelIndex;
                    const likeData = likesState[slide.id || `slide-${idx}`] || { count: 0, liked: false };

                    return (
                      <div
                        key={slide.id || idx}
                        data-reel-index={idx}
                        className="relative w-full h-full min-h-full max-h-full flex-shrink-0 flex items-center justify-center overflow-hidden snap-start snap-always bg-black"
                        style={{ 
                          scrollSnapAlign: 'start', 
                          scrollSnapStop: 'always',
                          height: '100%',
                          minHeight: '100%',
                          maxHeight: '100%'
                        }}
                      >
                        {/* Reel Media Background */}
                        {slide.mediaType === 'youtube' ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-black">
                            <iframe
                              data-reel-yt={idx}
                              src={`https://www.youtube.com/embed/${slide.youtubeId}?enablejsapi=1&autoplay=${isCurrent ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&playlist=${slide.youtubeId}&controls=0&playsinline=1&rel=0&modestbranding=1`}
                              title={slide.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              className="w-full h-full border-0 absolute inset-0 object-cover pointer-events-none"
                            />
                          </div>
                        ) : slide.mediaType === 'drive-video' ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-black">
                            {!activatedDriveVideos[idx] ? (
                              <div 
                                className="w-full h-full relative flex items-center justify-center cursor-pointer group"
                                onClick={() => {
                                  stopAllOtherMedia(idx, false);
                                  setActivatedDriveVideos({ [idx]: true });
                                  setIsPlayingState({ [idx]: true });
                                }}
                              >
                                <img
                                  src={slide.imageUrl || (slide.driveFileId ? `https://drive.google.com/thumbnail?id=${slide.driveFileId}&sz=w1600` : '/photos/memories_2025_idol.jpeg')}
                                  alt={slide.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover sm:object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/photos/memories_2025_idol.jpeg';
                                  }}
                                />
                                {/* Prominent Dual Play Action Overlay */}
                                <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-3 select-none p-4 text-center">
                                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-2xl border-2 border-white transition-all transform group-hover:scale-110 group-active:scale-95 animate-pulse">
                                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-1" />
                                  </div>
                                  <div className="flex flex-col items-center gap-2 max-w-xs">
                                    <span className="px-4 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-black shadow-md border border-red-400/50">
                                      ▶️ येथे प्ले करा (Tap to Play)
                                    </span>
                                    {slide.driveFileId && (
                                      <a
                                        href={`https://drive.google.com/file/d/${slide.driveFileId}/view`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-3.5 py-1 rounded-full bg-black/80 hover:bg-black text-amber-300 text-[11px] font-bold border border-amber-400/50 backdrop-blur-md shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                                      >
                                        <span>🎬 Google Drive मध्ये थेट HD पहा</span>
                                        <ExternalLink className="w-3 h-3 text-amber-400" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full relative">
                                <iframe
                                  src={`https://drive.google.com/file/d/${slide.driveFileId || ''}/preview`}
                                  title={slide.title}
                                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                                  allowFullScreen
                                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                                  className="w-full h-full border-0 absolute inset-0 object-contain z-10 pointer-events-auto"
                                />
                                {/* Top Fallback Bar if video is buffering or blocked in mobile webview */}
                                {slide.driveFileId && (
                                  <div className="absolute top-10 inset-x-3 z-30 flex items-center justify-between bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/40 text-xs shadow-lg pointer-events-auto">
                                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-amber-400" />
                                      व्हिडिओ सुरू न झाल्यास:
                                    </span>
                                    <a
                                      href={`https://drive.google.com/file/d/${slide.driveFileId}/view`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-0.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-sm active:scale-95"
                                    >
                                      <span>HD मध्ये उघडा</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : slide.mediaType === 'video' ? (
                          <div className="w-full h-full relative flex items-center justify-center bg-black">
                            <video
                              ref={(el) => { reelVideoRefs.current[idx] = el; }}
                              src={slide.videoUrl || slide.imageUrl}
                              poster={slide.imageUrl}
                              playsInline
                              loop
                              autoPlay={isCurrent}
                              preload="auto"
                              muted={isMuted}
                              onError={() => setDirectVideoError(true)}
                              className="w-full h-full object-cover sm:object-contain absolute inset-0"
                              onPlay={() => {
                                stopAllOtherMedia(idx, false);
                                setIsPlayingState({ [idx]: true });
                              }}
                              onPause={() => setIsPlayingState({})}
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full relative flex items-center justify-center bg-black pointer-events-none">
                            <img
                              src={slide.imageUrl}
                              alt={slide.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover pointer-events-none"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/photos/memories_2025_idol.jpeg';
                              }}
                            />
                          </div>
                        )}

                        {/* Transparent touch & click gesture overlay guaranteeing touch vertical pan on mobile */}
                        {(!activatedDriveVideos[idx] || slide.mediaType !== 'drive-video') && (
                          <div 
                            className="absolute inset-0 z-10 bg-transparent cursor-pointer touch-pan-y flex items-center justify-center"
                            onClick={() => handleVideoClick(idx, false)}
                          >
                            {showPlayIconIndex === idx && (
                              <div className="w-16 h-16 rounded-full bg-black/70 text-white flex items-center justify-center border border-white/50 backdrop-blur-md animate-scaleIn pointer-events-none shadow-2xl">
                                {isPlayingState[idx] ? <Play className="w-8 h-8 fill-white translate-x-0.5" /> : <Pause className="w-8 h-8 fill-white" />}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Subtle Dark Vignette Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50 pointer-events-none z-15" />

                        {/* Right-Side Interaction Rail (Instagram Reels / Shorts Style) */}
                        <div className="absolute right-2.5 bottom-20 z-20 flex flex-col items-center gap-3.5 select-none pointer-events-auto">
                          {/* Like Button */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleLike(slide.id || `slide-${idx}`, e)}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                            title="Love / जय गणेश"
                            aria-label="Like this reel"
                          >
                            <div className={`p-2.5 rounded-full backdrop-blur-md border transition-all active:scale-125 ${
                              likeData.liked
                                ? 'bg-red-600/90 text-white border-red-400 shadow-lg scale-110'
                                : 'bg-black/50 text-white/90 border-white/30 hover:bg-black/70'
                            }`}>
                              <Heart className={`w-5 h-5 ${likeData.liked ? 'fill-current text-white' : 'text-white'}`} />
                            </div>
                            <span className="text-[11px] font-extrabold text-white text-shadow-sm drop-shadow-md">
                              {likeData.count}
                            </span>
                          </button>

                          {/* Share Button */}
                          <button
                            type="button"
                            onClick={(e) => handleShareReel(slide, e)}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                            title="Share Reel (शेअर करा)"
                            aria-label="Share Reel"
                          >
                            <div className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white/90 border border-white/30 backdrop-blur-md transition-all active:scale-90">
                              <Share2 className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-extrabold text-white text-shadow-sm drop-shadow-md">
                              शेअर
                            </span>
                          </button>

                          {/* Direct Full HD Play in Google Drive / Native Player */}
                          {(slide.driveFileId || slide.videoUrl) && (
                            <a
                              href={slide.driveFileId ? `https://drive.google.com/file/d/${slide.driveFileId}/view` : slide.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex flex-col items-center gap-1 group cursor-pointer"
                              title="Open Full HD Video (थेट व्हिडिओ पहा)"
                              aria-label="Open Full HD Video"
                            >
                              <div className="p-2.5 rounded-full bg-red-600/90 hover:bg-red-500 text-white border border-red-400/60 backdrop-blur-md transition-all active:scale-90 shadow-lg">
                                <ExternalLink className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-black text-amber-200 text-shadow-sm drop-shadow-md whitespace-nowrap">
                                HD पहा
                              </span>
                            </a>
                          )}

                          {/* Scroll Up to Previous Reel Button */}
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                scrollToReel(idx - 1);
                              }}
                              className="p-2.5 rounded-full bg-black/60 hover:bg-black text-amber-300 border border-amber-400/50 backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-md"
                              title="Previous Reel (वर जा)"
                              aria-label="Previous Reel"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          )}

                          {/* Scroll Down to Next Reel Button */}
                          {idx < currentReelSlides.length - 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                scrollToReel(idx + 1);
                              }}
                              className="p-2.5 rounded-full bg-black/60 hover:bg-black text-amber-300 border border-amber-400/50 backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-md"
                              title="Next Reel (खाली जा)"
                              aria-label="Next Reel"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Bottom Slide Info Overlay */}
                        <div className="absolute bottom-3 inset-x-3 z-20 flex flex-col text-left select-none pr-14 pointer-events-none">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white font-extrabold text-[10px] uppercase tracking-wider mb-1.5 w-fit shadow-xs">
                            <span>{isVid ? '🎬 उत्सव Reel' : '📸 दिव्य क्षण'}</span>
                          </div>

                          <h4 className="text-sm sm:text-base font-black text-amber-200 font-festive leading-snug drop-shadow-md line-clamp-2">
                            {slide.title}
                          </h4>

                          {slide.subtitle && (
                            <p className="text-[11px] sm:text-xs text-slate-200 font-medium font-marathi mt-1 leading-relaxed drop-shadow-sm line-clamp-2">
                              {slide.subtitle}
                            </p>
                          )}

                          {/* First Reel Swipe Gesture Hint */}
                          {idx === 0 && (
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300/90 mt-2 animate-bounce">
                              <ChevronUp className="w-3.5 h-3.5" />
                              <span>वर स्वाइप करा / Scroll up for next reel</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Side Details & Quick Navigation Rail for Reels Mode */}
              <div className="w-full max-w-sm lg:max-w-md flex flex-col space-y-3.5 text-left">
                {/* Active Slide Spotlight Box */}
                <div className="bg-white/95 rounded-2xl p-4 border-2 border-amber-300/80 shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>Now Playing Reel {activeReelIndex + 1}/{currentReelSlides.length}</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      Pride 2026
                    </span>
                  </div>

                  <h4 className="font-black text-base sm:text-lg text-slate-900 leading-snug">
                    {currentReelSlides[activeReelIndex]?.title || currentSlide.title}
                  </h4>
                  {currentReelSlides[activeReelIndex]?.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed font-marathi">
                      {currentReelSlides[activeReelIndex].subtitle}
                    </p>
                  )}

                  {/* Audio Status & Fullscreen Trigger */}
                  <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition-all cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                      <span>{isMuted ? 'आवाज चालू करा (Unmute)' : 'आवाज सुरू आहे (Playing)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModalFullscreenReels(true);
                        setIsImageModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-800 to-festival-saffron px-3 py-1.5 rounded-xl shadow-xs hover:brightness-110 transition-all cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>पूर्ण स्क्रीन (Full View)</span>
                    </button>
                  </div>
                </div>

                {/* Festive Highlights Badges */}
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
                </div>

                {/* Jump to Reel Direct Pills */}
                {currentReelSlides.length > 1 && (
                  <div className="pt-2 border-t border-amber-200/90">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block mb-2">
                      ⚡ Jump to Specific Reel:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto no-scrollbar scrollbar-none">
                      {currentReelSlides.map((s, idx) => {
                        const isVid = s.mediaType === 'video' || s.mediaType === 'drive-video' || s.mediaType === 'youtube';
                        const chipLabel = getChipLabel(s.title);
                        const isSelected = idx === activeReelIndex;
                        return (
                          <button
                            key={s.id || idx}
                            type="button"
                            onClick={() => scrollToReel(idx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                              isSelected
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
          ) : (
            /* ========================================================= */
            /* VIEW MODE 2: CLASSIC 16:9 SHOWCASE (DESKTOP / WIDE VIEW)  */
            /* ========================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Left Column: Prominent Media Player (lg:col-span-7) */}
              <div className="min-w-0 lg:col-span-7 flex flex-col items-center justify-start w-full mx-auto">
                <div className="relative w-full max-w-2xl mx-auto group select-none">
                  {/* Clean 16:9 Aspect-Ratio Box */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400 bg-slate-950 mx-auto">
                    {/* YouTube */}
                    {currentSlide.mediaType === 'youtube' ? (
                      <div
                        onClick={() => setIsImageModalOpen(true)}
                        className="w-full h-full cursor-pointer relative"
                        role="button"
                        tabIndex={0}
                        title="Click for full video with sound"
                      >
                        <iframe
                          key={`yt-classic-${currentSlide.youtubeId || currentSlideIndex}`}
                          src={`https://www.youtube.com/embed/${currentSlide.youtubeId || ''}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${currentSlide.youtubeId || ''}&controls=0&playsinline=1&rel=0`}
                          title={currentSlide.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          className="w-full h-full border-0 absolute inset-0 z-0 pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-transparent z-10" />
                      </div>
                    ) : currentSlide.mediaType === 'video' ? (
                      /* Direct MP4 Video */
                      <div
                        onClick={() => setIsImageModalOpen(true)}
                        className="w-full h-full cursor-pointer relative"
                        role="button"
                        tabIndex={0}
                        title="Click for full video with sound"
                      >
                        <video
                          ref={inlineClassicVideoRef}
                          key={`inline-video-${currentSlide.id || currentSlideIndex}`}
                          src={currentSlide.videoUrl || currentSlide.imageUrl}
                          poster={currentSlide.imageUrl}
                          autoPlay
                          muted={isMuted}
                          loop
                          playsInline
                          preload="auto"
                          onError={() => setDirectVideoError(true)}
                          className="w-full h-full object-contain sm:object-cover absolute inset-0 z-0 pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-transparent z-10" />
                      </div>
                    ) : currentSlide.mediaType === 'drive-video' ? (
                      /* Google Drive Preview Player */
                      <div className="w-full h-full relative bg-black">
                        <iframe
                          key={`drive-classic-${currentSlide.driveFileId || currentSlideIndex}`}
                          src={`https://drive.google.com/file/d/${currentSlide.driveFileId}/preview`}
                          title={currentSlide.title}
                          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                          allowFullScreen
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                          className="w-full h-full border-0 absolute inset-0 z-10 pointer-events-auto"
                        />
                      </div>
                    ) : (
                      /* Static Image */
                      <div 
                        onClick={() => setIsImageModalOpen(true)}
                        className="w-full h-full cursor-pointer relative"
                        role="button"
                        tabIndex={0}
                        title="Click to view full photo"
                      >
                        <img 
                          src={currentSlide.imageUrl || '/photos/memories_2025_idol.jpeg'} 
                          alt={currentSlide.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/photos/memories_2025_idol.jpeg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* External Control Bar below 16:9 player */}
                <div className="w-full max-w-2xl mx-auto flex items-center justify-between mt-3 px-0.5 sm:px-1 select-none gap-1 sm:gap-2">
                  {slides.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        stopAllOtherMedia();
                        setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
                      }}
                      className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-950 font-bold text-xs flex items-center gap-1 border border-amber-300 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
                      title="Previous"
                    >
                      <ChevronLeft className="w-4 h-4 text-amber-700" />
                      <span className="hidden xs:inline">Prev</span>
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100 px-2 sm:px-2.5 py-0.5 rounded-lg border border-amber-300/80 shrink-0 whitespace-nowrap">
                      {currentSlideIndex + 1} / {slides.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {currentSlide.driveFileId && (
                      <a
                        href={`https://drive.google.com/file/d/${currentSlide.driveFileId}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                        title="Google Drive मध्ये थेट पहा"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">HD पहा</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setModalFullscreenReels(false);
                        setIsImageModalOpen(true);
                      }}
                      className="px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-800 to-festival-saffron text-white text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer hover:brightness-110 shrink-0"
                      title="Full Screen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Full Screen</span>
                    </button>

                    {slides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          stopAllOtherMedia();
                          setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
                        }}
                        className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-950 font-bold text-xs flex items-center gap-1 border border-amber-300 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
                        title="Next"
                      >
                        <span className="hidden xs:inline">Next</span>
                        <ChevronRight className="w-4 h-4 text-amber-700" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Tangy Details & Moments */}
              <div className="min-w-0 lg:col-span-5 flex flex-col space-y-3.5 text-left">
                <div className="bg-white/95 rounded-2xl p-4 border-2 border-amber-300/80 shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>{isCurrentVideo ? '🎬 Video' : '📸 Moment'} • Slide {currentSlideIndex + 1}/{slides.length}</span>
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
                </div>

                {slides.length > 1 && (
                  <div className="pt-2 border-t border-amber-200/90">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block mb-2">
                      ⚡ Quick Jump:
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
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* FULLSCREEN REELS / PHOTO MODAL (100% Mobile Full-Bleed)    */}
      {/* NO SCROLLER / SCROLLBAR SHOWN                             */}
      {/* ========================================================= */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/98 sm:bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 overflow-hidden animate-fadeIn select-none"
          onClick={() => {
            setIsImageModalOpen(false);
            setModalFullscreenReels(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Festival Photo & Video Showcase"
        >
          <div
            className="w-full h-full sm:max-w-md md:max-w-lg sm:h-[90vh] sm:rounded-3xl bg-black overflow-hidden flex flex-col relative my-0 sm:my-auto border-0 sm:border-2 sm:border-amber-400 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={(e) => handleTouchEnd(e, true)}
            onWheel={(e) => handleWheelScroll(e, true)}
          >
            {/* Modal Header Bar */}
            <div className="absolute top-0 inset-x-0 z-40 p-3 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between select-none pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white font-extrabold text-[11px] uppercase tracking-wider">
                  🎬 Reels Feed
                </span>
                <span className="text-white/80 text-xs font-bold">
                  {activeReelIndex + 1} / {currentReelSlides.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black text-amber-300 border border-white/20 backdrop-blur-sm cursor-pointer"
                  title="Toggle Audio"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsImageModalOpen(false);
                    setModalFullscreenReels(false);
                  }}
                  className="p-2 rounded-full bg-black/60 hover:bg-red-700 text-white border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
                  aria-label="Close popup"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Vertical Snap-Scrolling Container inside Fullscreen Modal (NO SCROLLER) */}
            <div
              ref={fullscreenReelsFeedRef}
              className="w-full h-full overflow-y-scroll overscroll-y-contain snap-y snap-mandatory flex flex-col relative select-none no-scrollbar touch-pan-y"
              style={{
                scrollSnapType: 'y mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {currentReelSlides.map((slide, idx) => {
                const isCurrent = idx === activeReelIndex;
                const likeData = likesState[slide.id || `slide-${idx}`] || { count: 0, liked: false };
                const isVid = slide.mediaType === 'youtube' || slide.mediaType === 'drive-video' || slide.mediaType === 'video';

                return (
                  <div
                    key={`modal-${slide.id || idx}`}
                    data-fullscreen-reel-index={idx}
                    className="relative w-full h-full min-h-full max-h-full flex-shrink-0 flex items-center justify-center overflow-hidden snap-start snap-always bg-black"
                    style={{ 
                      scrollSnapAlign: 'start', 
                      scrollSnapStop: 'always',
                      height: '100%',
                      minHeight: '100%',
                      maxHeight: '100%'
                    }}
                  >
                    {slide.mediaType === 'youtube' ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black">
                        <iframe
                          data-fullscreen-yt={idx}
                          src={`https://www.youtube.com/embed/${slide.youtubeId}?enablejsapi=1&autoplay=${isCurrent ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&playsinline=1&rel=0`}
                          title={slide.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0 absolute inset-0 object-contain z-10 pointer-events-auto"
                        />
                      </div>
                    ) : slide.mediaType === 'drive-video' ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black">
                        <iframe
                          src={`https://drive.google.com/file/d/${slide.driveFileId || ''}/preview`}
                          title={slide.title}
                          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                          allowFullScreen
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                          className="w-full h-full border-0 absolute inset-0 object-contain z-10 pointer-events-auto"
                        />
                        {/* Direct Open Button inside Fullscreen Modal */}
                        {slide.driveFileId && (
                          <div className="absolute top-14 inset-x-4 z-30 flex items-center justify-between bg-black/85 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl border border-amber-400/40 shadow-xl max-w-md mx-auto pointer-events-auto">
                            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              व्हिडिओ सुरू न झाल्यास:
                            </span>
                            <a
                              href={`https://drive.google.com/file/d/${slide.driveFileId}/view`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                            >
                              <span>HD पहा</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    ) : slide.mediaType === 'video' ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black">
                        <video
                          ref={(el) => { fullscreenVideoRefs.current[idx] = el; }}
                          src={slide.videoUrl || slide.imageUrl}
                          poster={slide.imageUrl}
                          playsInline
                          loop
                          controls
                          autoPlay={isCurrent}
                          preload="auto"
                          muted={isMuted}
                          onError={() => setDirectVideoError(true)}
                          className="w-full h-full object-contain absolute inset-0 z-10 pointer-events-auto"
                          onPlay={() => {
                            stopAllOtherMedia(idx, true);
                            setIsPlayingState({ [idx]: true });
                          }}
                          onPause={() => setIsPlayingState({})}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full relative flex items-center justify-center bg-black pointer-events-none">
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain pointer-events-none"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/photos/memories_2025_idol.jpeg';
                          }}
                        />
                      </div>
                    )}

                    {/* Transparent touch layer for photo slides only (so videos receive click/play controls) */}
                    {!isVid && (
                      <div 
                        className="absolute inset-0 z-10 bg-transparent cursor-pointer touch-pan-y"
                        onClick={() => setIsMuted((prev) => !prev)}
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none z-15" />

                    {/* Right Rail */}
                    <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(slide.id || `slide-${idx}`, e)}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                        title="Love / जय गणेश"
                      >
                        <div className={`p-3 rounded-full backdrop-blur-md border transition-all active:scale-125 ${
                          likeData.liked
                            ? 'bg-red-600/90 text-white border-red-400 shadow-xl'
                            : 'bg-black/50 text-white border-white/30 hover:bg-black/70'
                        }`}>
                          <Heart className={`w-5 h-5 ${likeData.liked ? 'fill-current text-white' : 'text-white'}`} />
                        </div>
                        <span className="text-xs font-bold text-white drop-shadow-md">
                          {likeData.count}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleShareReel(slide, e)}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                        title="Share Reel"
                      >
                        <div className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/30 backdrop-blur-md transition-all active:scale-90">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-white drop-shadow-md">
                          शेअर
                        </span>
                      </button>

                      {/* Direct HD Open in Drive */}
                      {(slide.driveFileId || slide.videoUrl) && (
                        <a
                          href={slide.driveFileId ? `https://drive.google.com/file/d/${slide.driveFileId}/view` : slide.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex flex-col items-center gap-1 group cursor-pointer"
                          title="Open HD Video"
                        >
                          <div className="p-3 rounded-full bg-red-600/90 hover:bg-red-500 text-white border border-red-400/60 backdrop-blur-md transition-all active:scale-90 shadow-xl">
                            <ExternalLink className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-amber-200 drop-shadow-md whitespace-nowrap">
                            HD पहा
                          </span>
                        </a>
                      )}

                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToReel(idx - 1, true);
                          }}
                          className="p-2.5 rounded-full bg-black/60 text-amber-300 border border-amber-400/40 backdrop-blur-md cursor-pointer shadow-md"
                          title="Previous Reel"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                      )}

                      {idx < currentReelSlides.length - 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToReel(idx + 1, true);
                          }}
                          className="p-2.5 rounded-full bg-black/60 text-amber-300 border border-amber-400/40 backdrop-blur-md cursor-pointer shadow-md"
                          title="Next Reel"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-6 inset-x-4 z-20 flex flex-col text-left pr-16 select-none pointer-events-none">
                      <h4 className="text-base sm:text-lg font-black text-amber-200 font-festive drop-shadow-md">
                        {slide.title}
                      </h4>
                      {slide.subtitle && (
                        <p className="text-xs sm:text-sm text-slate-200 font-medium font-marathi mt-1 drop-shadow-sm">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

TempleDecorationSection.displayName = 'TempleDecorationSection';
