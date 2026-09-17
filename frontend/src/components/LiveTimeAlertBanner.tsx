import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Calendar, 
  Clock, 
  X, 
  ChevronRight, 
  Sparkles, 
  Bell, 
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { EventItem } from '../types';
import { FESTIVAL_SCHEDULE } from '../data/scheduleData';

interface LiveAlertItem {
  id: string;
  type: 'aarti' | 'schedule';
  title: string;
  marathiTitle: string;
  timeStr: string;
  sessionTime: Date;
  alertStart: Date;
  alertEnd: Date;
  targetSection: 'aarti' | 'schedule';
  description?: string;
}

interface LiveTimeAlertBannerProps {
  schedule?: EventItem[];
  onNavigate: (sectionId: string) => void;
}

/**
 * Parses time strings like "8:00 AM", "7:30 PM", "8:30 PM", "4:00 PM onwards", "9:00 AM & 6:30 PM"
 * into an array of Date objects for a specific base date.
 */
function parseTimesForDate(baseDate: Date, timeStr: string): Date[] {
  const times: Date[] = [];
  // Regex to match "8:00 AM", "7:30 PM", "4:00 PM", etc.
  const regex = /(\d{1,2}):(\d{2})\s*(AM|PM)/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(timeStr)) !== null) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    const sessionDate = new Date(baseDate.getTime());
    sessionDate.setHours(hours, minutes, 0, 0);
    times.push(sessionDate);
  }

  // Fallback for formats without minutes like "4 PM"
  if (times.length === 0) {
    const fallbackRegex = /(\d{1,2})\s*(AM|PM)/gi;
    let fbMatch: RegExpExecArray | null;
    while ((fbMatch = fallbackRegex.exec(timeStr)) !== null) {
      let hours = parseInt(fbMatch[1], 10);
      const meridiem = fbMatch[2].toUpperCase();
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;

      const sessionDate = new Date(baseDate.getTime());
      sessionDate.setHours(hours, 0, 0, 0);
      times.push(sessionDate);
    }
  }

  return times;
}

export const LiveTimeAlertBanner: React.FC<LiveTimeAlertBannerProps> = ({
  schedule = FESTIVAL_SCHEDULE,
  onNavigate
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('dismissed_live_alerts');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Keep internal clock updated every 15 seconds for reactive timing
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Compute all potential alerts for today
  const activeAlerts = useMemo(() => {
    const now = currentTime;
    const today = new Date(now.getTime());
    const pad = (n: number) => n.toString().padStart(2, '0');
    const todayDateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    const candidates: LiveAlertItem[] = [];

    // 1. DAILY AARTI TIMINGS (Applicable every single day)
    // Morning Aarti: 8:00 AM (Alert window: 7:30 AM – 9:00 AM)
    const morningAartiTime = new Date(today.getTime());
    morningAartiTime.setHours(8, 0, 0, 0);
    candidates.push({
      id: `aarti-morning-${todayDateStr}`,
      type: 'aarti',
      title: 'Morning Aarti & Atharvashirsha Pathan',
      marathiTitle: 'सकाळची मंगल आरती व अथर्वशीर्ष पठण',
      timeStr: '8:00 AM',
      sessionTime: morningAartiTime,
      alertStart: new Date(morningAartiTime.getTime() - 30 * 60 * 1000), // -30 minutes
      alertEnd: new Date(morningAartiTime.getTime() + 60 * 60 * 1000),   // +1 hour (60 mins)
      targetSection: 'aarti',
      description: 'Daily morning prayers, Atharvashirsha pathan, and naivedya offering.'
    });

    // Evening Maha Aarti: 7:30 PM (Alert window: 7:00 PM – 8:30 PM)
    const eveningAartiTime = new Date(today.getTime());
    eveningAartiTime.setHours(19, 30, 0, 0);
    candidates.push({
      id: `aarti-evening-${todayDateStr}`,
      type: 'aarti',
      title: 'Evening Maha Aarti & Dhol Tasha',
      marathiTitle: 'संध्याकाळची महाआरती व गजर',
      timeStr: '7:30 PM',
      sessionTime: eveningAartiTime,
      alertStart: new Date(eveningAartiTime.getTime() - 30 * 60 * 1000), // -30 minutes
      alertEnd: new Date(eveningAartiTime.getTime() + 60 * 60 * 1000),   // +1 hour (60 mins)
      targetSection: 'aarti',
      description: 'Grand community Maha Aarti with traditional instruments and collective chanting.'
    });

    // 2. DAY'S SCHEDULED FESTIVAL EVENTS
    // Find events matching today's date
    const todayEvents = schedule.filter(ev => ev.dateStr === todayDateStr);
    todayEvents.forEach((ev, idx) => {
      const sessionTimes = parseTimesForDate(today, ev.time);
      sessionTimes.forEach((sTime, tIdx) => {
        candidates.push({
          id: `schedule-${todayDateStr}-${ev.day}-${idx}-${tIdx}`,
          type: 'schedule',
          title: ev.title,
          marathiTitle: ev.title,
          timeStr: ev.time,
          sessionTime: sTime,
          alertStart: new Date(sTime.getTime() - 30 * 60 * 1000), // -30 minutes
          alertEnd: new Date(sTime.getTime() + 60 * 60 * 1000),   // +1 hour (60 mins)
          targetSection: 'schedule',
          description: ev.description
        });
      });
    });

    // Filter candidates by:
    // now is within [alertStart, alertEnd] (auto-shows 30 min before, auto-closes after 1 hour)
    // and not dismissed in this session
    const nowMs = now.getTime();
    return candidates.filter(item => {
      const isInWindow = nowMs >= item.alertStart.getTime() && nowMs <= item.alertEnd.getTime();
      const isDismissed = dismissedAlertIds.includes(item.id);
      return isInWindow && !isDismissed;
    });
  }, [currentTime, schedule, dismissedAlertIds]);

  const handleDismiss = (id: string) => {
    const updated = [...dismissedAlertIds, id];
    setDismissedAlertIds(updated);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('dismissed_live_alerts', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
    }
  };

  if (activeAlerts.length === 0) {
    return null;
  }

  // Display top alert
  const primaryAlert = activeAlerts[0];
  const nowMs = currentTime.getTime();
  const sessionMs = primaryAlert.sessionTime.getTime();
  const alertEndMs = primaryAlert.alertEnd.getTime();

  const isLiveNow = nowMs >= sessionMs;
  const minutesUntilStart = Math.max(1, Math.round((sessionMs - nowMs) / (60 * 1000)));
  const minutesUntilAutoClose = Math.max(1, Math.round((alertEndMs - nowMs) / (60 * 1000)));

  return (
    <div className="sticky top-[98px] sm:top-[106px] z-40 px-3 sm:px-4 py-1.5 max-w-5xl mx-auto w-full animate-fadeIn">
      <div className={`relative overflow-hidden rounded-2xl p-3 sm:p-3.5 shadow-xl border-2 transition-all backdrop-blur-md ${
        isLiveNow
          ? 'bg-gradient-to-r from-red-950/95 via-red-900/95 to-amber-950/95 border-amber-400 text-amber-100 shadow-[0_4px_25px_rgba(220,38,38,0.35)]'
          : 'bg-gradient-to-r from-amber-900/95 via-orange-950/95 to-red-950/95 border-amber-300 text-amber-100 shadow-[0_4px_25px_rgba(245,175,25,0.35)]'
      }`}>
        {/* Ambient Pulsing Glow Accents */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: Icon & Badge & Title */}
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            {/* Animated Icon Box */}
            <div className={`p-2.5 rounded-xl flex-shrink-0 shadow-md ${
              isLiveNow 
                ? 'bg-red-700/80 text-amber-200 ring-2 ring-amber-400/60 animate-pulse' 
                : 'bg-amber-600/80 text-amber-100'
            }`}>
              {primaryAlert.type === 'aarti' ? (
                <Flame className="w-5 h-5 text-amber-300" />
              ) : (
                <Calendar className="w-5 h-5 text-amber-300" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                {/* Live / Starting Soon Badge */}
                {isLiveNow ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>थेट चालू आहे / LIVE NOW</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-red-950 shadow-xs">
                    <Bell className="w-3 h-3 text-red-950 animate-bounce" />
                    <span>लवकरच सुरू होत आहे • {minutesUntilStart} मिनिटे</span>
                  </span>
                )}

                {/* Timing Details */}
                <span className="text-[11px] font-bold text-amber-200/90 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span>{primaryAlert.timeStr}</span>
                  <span className="text-amber-400/80">• (Auto-closes in {minutesUntilAutoClose}m)</span>
                </span>
              </div>

              {/* Title Header */}
              <h4 className="font-festive font-black text-sm sm:text-base text-amber-100 truncate">
                {primaryAlert.marathiTitle}
              </h4>
              <p className="text-[11px] text-amber-200/80 truncate hidden sm:block">
                {primaryAlert.title}
              </p>
            </div>
          </div>

          {/* Right: Quick Action CTAs & Dismiss Button */}
          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <button
              onClick={() => onNavigate(primaryAlert.targetSection)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 text-red-950 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>{primaryAlert.type === 'aarti' ? 'आरती संग्रह पहा' : 'वेळापत्रक पहा'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Manual Dismiss (X) */}
            <button
              onClick={() => handleDismiss(primaryAlert.id)}
              className="p-1.5 rounded-lg text-amber-300/80 hover:text-white hover:bg-black/30 transition-all cursor-pointer"
              title="Dismiss for this session (Auto-closes after 2 hours)"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

