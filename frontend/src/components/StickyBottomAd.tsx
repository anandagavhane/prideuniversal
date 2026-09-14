import React, { useState, useEffect } from 'react';
import { X, Phone, ExternalLink, Megaphone } from 'lucide-react';
import { SponsorAd, DEFAULT_SPONSOR_ADS } from '../services/adService';

interface StickyBottomAdProps {
  ads?: SponsorAd[];
}

export const StickyBottomAd: React.FC<StickyBottomAdProps> = ({
  ads = DEFAULT_SPONSOR_ADS
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const activeAds = ads.length > 0 ? ads : DEFAULT_SPONSOR_ADS;
  const currentAd = activeAds[currentIndex % activeAds.length];

  // Auto-rotate every 7 seconds
  useEffect(() => {
    if (activeAds.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeAds.length]);

  if (isDismissed || !currentAd) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-gradient-to-r from-red-950 via-slate-900 to-red-950 text-amber-100 border-t-2 border-amber-400/80 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] p-2 animate-slideUp">
      <div className="flex items-center justify-between gap-2">
        {/* Ad Image / Icon */}
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 border border-amber-400/50 flex-shrink-0">
          <img
            src={currentAd.imageUrl}
            alt={currentAd.companyName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/photos/memories_2025_idol2.jpeg';
            }}
          />
        </div>

        {/* Ad Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-red-950">
              प्रायोजक
            </span>
            <span className="text-xs font-black text-amber-200 truncate">
              {currentAd.companyName}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 truncate leading-tight mt-0.5">
            {currentAd.title}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {currentAd.phone && (
            <a
              href={`tel:${currentAd.phone.replace(/[^0-9+]/g, '')}`}
              className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs active:scale-95"
              title="Call sponsor"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}

          {currentAd.linkUrl && (
            <a
              href={currentAd.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-lg bg-red-800 text-amber-100 border border-amber-300/60 text-[10px] font-bold shadow-xs active:scale-95 flex items-center gap-1"
            >
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Dismiss Button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors"
            aria-label="Close ad"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

