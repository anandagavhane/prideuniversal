import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { AccountsData, NominationsDashboardData } from '../types';
import { HeroCarousel } from './HeroCarousel';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  accounts: AccountsData;
  nominations: NominationsDashboardData;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, accounts, nominations }) => {
  // Countdown to 14 September 2026, 4:00 PM IST
  const festivalTargetDate = new Date('2026-09-14T16:00:00+05:30').getTime();
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
        {/* Official Society Emblem - Circular */}
        <div className="mb-4 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl border-4 border-amber-300 ring-4 ring-amber-500/20 bg-slate-950 flex items-center justify-center p-1 group-hover:scale-105 transition-all duration-300">
              <img 
                src="/logo.png" 
                alt="Pride Universal Ganeshotsav 2026 Emblem" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>

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
          <span>• 12 Days</span>
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

        {/* Divine Darshan Spotlight Card */}
        <div className="max-w-4xl mx-auto mb-12 bg-gradient-to-br from-amber-100/90 via-white to-amber-50/90 rounded-3xl p-4 sm:p-6 border-2 border-amber-300 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Framed Ganesha Photo */}
            <div className="md:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400 aspect-[4/3] bg-amber-950">
                <img 
                  src="/photos/memories_2025_idol_croped.jpeg" 
                  alt="Lord Ganesha - Pride Universal Darshan" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-3 right-3 text-left text-white">
                  <span className="text-[11px] font-bold text-amber-300 tracking-wider uppercase block">
                    ॥ श्री गणेशाय नमः ॥
                  </span>
                  <span className="text-xs font-semibold text-slate-100 font-marathi">
                    Pride Universal Bappa Darshan
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Sacred Shloka & Blessing Text */}
            <div className="md:col-span-7 text-left space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-900 text-[11px] font-bold uppercase tracking-wider">
                <span>🌺</span>
                <span>DIVINE BLESSINGS & CELEBRATION</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-red-950 font-festive leading-snug">
                मंगलमूर्ती मोरया • सुखकर्ता दुःखहर्ता
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-amber-900 font-marathi leading-relaxed italic bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।<br />
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
              </p>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                Pride Universal warmly welcomes all residents and families to celebrate 12 auspicious days of devotion, cultural performances, and joyous community togetherness.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="bg-amber-200/70 text-amber-950 font-bold px-2.5 py-1 rounded-md">
                  ✨ 14 Sep: Grand Aagaman
                </span>
                <span className="bg-amber-200/70 text-amber-950 font-bold px-2.5 py-1 rounded-md">
                  🪔 Daily Aarti: 8:00 AM &amp; 7:30 PM
                </span>
                <span className="bg-amber-200/70 text-amber-950 font-bold px-2.5 py-1 rounded-md">
                  🍽️ 24 Sep: Mahaprasad
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards (exact replica of Canva design buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          {/* Card 1: Event Schedule */}
          <button
            onClick={() => onNavigate('schedule')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[#f19a5c] to-[#f9db6f] text-red-950 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#fcd146] hover:-translate-y-1 focus:outline-none flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📅</div>
              <h3 className="text-xl font-black text-[#800020] uppercase font-festive tracking-tight leading-snug">
                Event<br />Schedule
              </h3>
              <p className="text-xs text-amber-950 font-medium mt-2">
                12 Days detailed timeline from Aagaman to Visarjan Miravnuk.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-900 group-hover:translate-x-1 transition-transform">
              <span>View Timeline</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 2: Games & Competitions */}
          <button
            onClick={() => onNavigate('competitions')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[#f19a5c] to-[#f9db6f] text-red-950 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#fcd146] hover:-translate-y-1 focus:outline-none flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-xl font-black text-[#800020] uppercase font-festive tracking-tight leading-snug">
                Games &<br />Competition
              </h3>
              <p className="text-xs text-amber-950 font-medium mt-2">
                Dance, Drawing, Singing, Shloka, Races, and Fun Challenges.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-900 group-hover:translate-x-1 transition-transform">
              <span>Explore & Nominate</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 3: Photo Gallery */}
          <button
            onClick={() => onNavigate('gallery')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[#f19a5c] to-[#f9db6f] text-red-950 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#fcd146] hover:-translate-y-1 focus:outline-none flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📸</div>
              <h3 className="text-xl font-black text-[#800020] uppercase font-festive tracking-tight leading-snug">
                Photo<br />Gallery
              </h3>
              <p className="text-xs text-amber-950 font-medium mt-2">
                Relive memories of devotion, cultural night, and grand celebrations.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-900 group-hover:translate-x-1 transition-transform">
              <span>View Photos</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 4: Ganapati Celebration / Accounts */}
          <button
            onClick={() => onNavigate('accounts')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[#f19a5c] to-[#f9db6f] text-red-950 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#fcd146] hover:-translate-y-1 focus:outline-none flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🌺</div>
              <h3 className="text-xl font-black text-[#800020] uppercase font-festive tracking-tight leading-snug">
                Ganapati<br />Celebration
              </h3>
              <p className="text-xs text-amber-950 font-medium mt-2">
                Live accounts ledger: Collections ({accounts?.totalCollectionsFormatted || '₹5,100'}) & Puja details.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-900 group-hover:translate-x-1 transition-transform">
              <span>View Financials</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Live Nominations & Collections Ticker */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Nominations Ticker */}
          <div 
            onClick={() => onNavigate('nominations')}
            className="cursor-pointer bg-white/80 backdrop-blur rounded-xl p-4 border border-amber-300 flex items-center justify-between hover:bg-amber-50/80 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                🏆
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Total Nominations</span>
                <span className="text-xl font-extrabold text-red-900 font-festive">
                  {nominations?.totalNominations ?? 67} entries registered
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-600 flex items-center gap-0.5">
              Dashboard <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Accounts Ticker */}
          <div 
            onClick={() => onNavigate('accounts')}
            className="cursor-pointer bg-white/80 backdrop-blur rounded-xl p-4 border border-amber-300 flex items-center justify-between hover:bg-amber-50/80 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                ₹
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Live Fund Collection</span>
                <span className="text-xl font-extrabold text-emerald-800 font-festive">
                  {accounts?.totalCollectionsFormatted || '₹5,100'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
              Overview <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
