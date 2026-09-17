import React, { useState, useEffect, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { AccountsData, NominationsDashboardData, EventItem } from '../types';
import { HeroCarousel } from './HeroCarousel';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  accounts?: AccountsData;
  nominations?: NominationsDashboardData;
  schedule?: EventItem[];
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, schedule }) => {
  // Countdown to festival Day 1 Aagaman IST
  const festivalTargetDate = useMemo(() => {
    if (schedule && schedule.length > 0 && schedule[0].dateStr) {
      return new Date(`${schedule[0].dateStr}T16:00:00+05:30`).getTime();
    }
    return new Date('2026-09-14T16:00:00+05:30').getTime();
  }, [schedule]);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isAagamanCompleted, setIsAagamanCompleted] = useState<boolean>(() => {
    return Date.now() >= festivalTargetDate;
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = festivalTargetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsAagamanCompleted(true);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
        setIsAagamanCompleted(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [festivalTargetDate]);

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#ffda6a]/40 via-[#feeeaa]/50 to-[#FEF7DA] pt-10 sm:pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-300 scroll-mt-32">
      {/* Ambient Festive Ganesha Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/ganpati_home_page.jpg')" }}
      ></div>

      {/* Decorative Traditional Rangoli / Mandala Background Watermarks */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">

        {/* Sacred Chanting Header */}
        <div className="inline-block animate-pulse mb-3">
          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#cc0000] tracking-wide font-marathi drop-shadow-sm">
            ॥ गणपती बाप्पा मोरया ॥
          </span>
        </div>

        {/* Pride Universal Super-heading */}
        <div className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-widest text-slate-800 mb-1">
          Pride Universal
        </div>

        {/* Main Festival Title matching Canva typography */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase mb-4 leading-tight">
          <span className="bg-gradient-to-r from-red-800 via-orange-600 to-red-900 bg-clip-text text-transparent drop-shadow-sm font-festive">
            GANESH FESTIVAL 2026
          </span>
        </h1>

        {/* Core Values Tagline */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-base font-semibold text-amber-900/90 bg-amber-100/80 px-4 py-2 rounded-full border border-amber-300/80 mb-6 shadow-sm">
          <span>• {schedule && schedule.length > 0 ? `${schedule.length} Days` : '12 Days'}</span>
          <span className="text-amber-400">•</span>
          <span>• Devotion</span>
          <span className="text-amber-400">•</span>
          <span>• Culture</span>
          <span className="text-amber-400">•</span>
          <span>• Togetherness</span>
        </div>

        {/* Marathi Subtext */}
        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-700 font-medium font-marathi leading-relaxed mb-8 px-2">
          चला, एकत्र येऊया… भक्ती, आनंद आणि एकोप्याने गणेशोत्सव साजरा करूया!
        </p>

        {/* Countdown Timer Card to 14 Sep Aagaman - Auto-hides once time reaches 00 / Aagaman is completed */}
        {!isAagamanCompleted && (
          <div className="max-w-xl mx-auto bg-gradient-to-r from-red-900 via-festival-darkRed to-red-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-amber-400/60 mb-10 transition-all duration-500">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider text-amber-300 font-bold mb-3">
              <Clock className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Grand Aagaman Countdown (14 Sep 2026, 4:00 PM)</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="bg-black/30 rounded-xl p-2.5 border border-amber-400/20">
                <span className="block text-2xl sm:text-4xl font-extrabold text-amber-300 font-festive">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] sm:text-xs text-amber-100 uppercase tracking-wider">Days</span>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5 border border-amber-400/20">
                <span className="block text-2xl sm:text-4xl font-extrabold text-amber-300 font-festive">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] sm:text-xs text-amber-100 uppercase tracking-wider">Hours</span>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5 border border-amber-400/20">
                <span className="block text-2xl sm:text-4xl font-extrabold text-amber-300 font-festive">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] sm:text-xs text-amber-100 uppercase tracking-wider">Mins</span>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5 border border-amber-400/20">
                <span className="block text-2xl sm:text-4xl font-extrabold text-amber-300 font-festive">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] sm:text-xs text-amber-100 uppercase tracking-wider">Secs</span>
              </div>
            </div>
          </div>
        )}

        {/* Grand Festival Highlights Image Carousel */}
        <HeroCarousel onNavigate={onNavigate} />
      </div>
    </section>
  );
};
