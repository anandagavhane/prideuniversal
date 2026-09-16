import React, { useState, useEffect, useCallback } from 'react';
import { Bell, ChevronRight, ChevronLeft, X, Sparkles, AlertTriangle, Calendar, RefreshCw, Download, ExternalLink } from 'lucide-react';
import { NotificationItem } from '../types';

interface FlashNoteBannerProps {
  onNavigate: (sectionId: string, linkText?: string) => void;
  notifications?: NotificationItem[];
  onOpenNotifications?: () => void;
}

export const FlashNoteBanner: React.FC<FlashNoteBannerProps> = ({ 
  onNavigate, 
  notifications = [],
  onOpenNotifications
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeNotifs = notifications.filter(n => n.active);

  const handleNext = useCallback(() => {
    if (activeNotifs.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % activeNotifs.length);
  }, [activeNotifs.length]);

  const handlePrev = useCallback(() => {
    if (activeNotifs.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + activeNotifs.length) % activeNotifs.length);
  }, [activeNotifs.length]);

  // Auto-rotate notices every 6 seconds
  useEffect(() => {
    if (activeNotifs.length <= 1) return;
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, [activeNotifs.length, handleNext]);

  if (!isVisible || activeNotifs.length === 0) return null;

  const currentNotif = activeNotifs[currentIndex % activeNotifs.length];
  if (!currentNotif) return null;

  const getBadgeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-3 h-3 text-red-950" />;
      case 'event':
        return <Calendar className="w-3 h-3 text-red-950" />;
      case 'alert':
      case 'info':
      default:
        return <Sparkles className="w-3 h-3 text-red-950" />;
    }
  };

  const getBadgeText = (type: NotificationItem['type']) => {
    switch (type) {
      case 'urgent':
        return '⚡ URGENT';
      case 'event':
        return '🌺 EVENT';
      case 'alert':
        return '📢 ALERT';
      case 'info':
      default:
        return '✨ NOTICE';
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#7B1113] via-[#8B0000] to-[#7B1113] text-white border-b-2 border-amber-400 shadow-md relative z-40 overflow-hidden">
      {/* Background Animated Subtle Glow */}
      <div className="absolute top-0 right-1/3 w-64 h-full bg-amber-400/10 blur-xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Badge & Dynamic Notice Text */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-center md:text-left flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-red-950 font-black px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider shadow-sm border border-amber-200 flex-shrink-0 animate-pulse">
            {getBadgeIcon(currentNotif.type)}
            <span>{getBadgeText(currentNotif.type)}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-amber-200 font-bold font-festive flex-shrink-0">
            <Bell className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>{currentNotif.title}:</span>
          </div>

          <div className="text-xs text-slate-100 truncate max-w-xl font-marathi">
            <span>{currentNotif.message}</span>
          </div>

          {activeNotifs.length > 1 && (
            <span className="text-[10px] font-bold text-amber-300/80 bg-black/20 px-1.5 py-0.2 rounded font-mono">
              {currentIndex + 1}/{activeNotifs.length}
            </span>
          )}
        </div>

        {/* Right: Controls, CTA, & Dismiss Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Stepper Buttons */}
          {activeNotifs.length > 1 && (
            <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5 border border-amber-400/30">
              <button
                onClick={handlePrev}
                className="p-1 rounded hover:bg-white/20 text-amber-200 transition-colors cursor-pointer"
                title="Previous notice"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded hover:bg-white/20 text-amber-200 transition-colors cursor-pointer"
                title="Next notice"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {(() => {
            const rawLink = currentNotif.linkSectionId || (
              currentNotif.linkText?.toLowerCase().endsWith('.apk') || 
              currentNotif.linkText?.startsWith('http') || 
              ['update', 'download', 'apk', 'schedule', 'competitions', 'nominations', 'accounts', 'aarti', 'gallery', 'committee', 'sponsors'].includes(currentNotif.linkText?.toLowerCase() || '') 
                ? currentNotif.linkText 
                : undefined
            );
            if (!rawLink && !currentNotif.linkText) return null;

            const linkTarget = (rawLink || currentNotif.linkText || '').trim();
            const lowerTarget = linkTarget.toLowerCase();
            const isApk = lowerTarget.endsWith('.apk') || 
              lowerTarget === 'update' || 
              lowerTarget === 'download' || 
              lowerTarget === 'apk' ||
              (currentNotif.linkText && currentNotif.linkText.toLowerCase().endsWith('.apk'));
            const isExternal = /^(https?:\/\/)/i.test(linkTarget);
            const displayLabel = currentNotif.linkText || (isApk ? 'Download App (APK)' : isExternal ? 'Open Link' : 'View Details');

            return (
              <button
                onClick={() => onNavigate(linkTarget, displayLabel)}
                className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-red-950 px-3 py-1 rounded-lg shadow transition-all hover:scale-105 cursor-pointer"
              >
                <span>{displayLabel}</span>
                {isApk ? (
                  <Download className="w-3.5 h-3.5 text-red-950" />
                ) : isExternal ? (
                  <ExternalLink className="w-3.5 h-3.5 text-red-950" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-red-950" />
                )}
              </button>
            );
          })()}

          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <span>सर्व सूचना ({activeNotifs.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsVisible(false)}
            title="Dismiss notice"
            className="p-1 rounded-lg text-amber-300/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
