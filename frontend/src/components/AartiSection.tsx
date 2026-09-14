import React from 'react';
import { Flame, Clock } from 'lucide-react';

export const AartiSection: React.FC = () => {
  const aartiTimings = [
    {
      session: 'Morning Aarti (सकाळची आरती)',
      time: '8:00 AM',
      icon: '🌅',
      details: 'Daily morning prayers, Atharvashirsha pathan, and naivedya offering.',
      guidelines: 'Devotees are requested to bring fresh flowers, durva, and clean prasad by 7:45 AM.'
    },
    {
      session: 'Evening Maha Aarti (संध्याकाळची महाआरती)',
      time: '7:30 PM',
      icon: '🪔',
      details: 'Daily evening community Maha Aarti with Dhol Tasha, conch, and collective chanting.',
      guidelines: 'All society resident families gather together in traditional attire. Daily prasad distribution follows.'
    }
  ];

  return (
    <section 
      id="aarti" 
      className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/40 to-[#FEF7DA] scroll-mt-28 border-b border-amber-200"
    >
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.08] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/ganu2.webp')" }}
      ></div>

      {/* Decorative Traditional Glow Accents */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-red-900 font-bold text-xs uppercase tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5 text-festival-saffron" />
            <span>DAILY DEVOTIONAL SCHEDULE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-950 font-festive tracking-tight mb-2">
            श्री गणेश नित्य आरती
          </h2>

          <p className="text-base sm:text-lg text-amber-900 font-semibold font-marathi">
            ॥ सुखकर्ता दुःखहर्ता वार्ता विघ्नाची, नुरवी पुरवी प्रेम कृपा जयाची ॥
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Join the daily morning and evening Aarti sessions with your family at the society mandap.
          </p>
        </div>

        {/* 2 Primary Daily Aarti Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {aartiTimings.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-[#fff7de] via-white to-[#fccd71]/20 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md relative overflow-hidden festive-card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{item.icon}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black bg-red-700 text-white px-3 py-1 rounded-full shadow">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Daily at {item.time}</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-red-950 font-festive mb-2">
                {item.session}
              </h3>

              <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed">
                {item.details}
              </p>

              <div className="pt-4 border-t border-amber-200/80 text-xs text-amber-950 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                <span className="font-bold block text-red-800 mb-0.5">Seva & Prasad Guidelines:</span>
                <span>{item.guidelines}</span>
              </div>
            </div>
          ))}
        </div>


        {/* Special Spiritual Programs banner */}
        <div className="bg-gradient-to-r from-red-900 to-festival-darkRed text-white rounded-2xl p-6 shadow-md border-2 border-amber-400">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-extrabold text-2xl flex-shrink-0">
                🪔
              </div>
              <div>
                <h4 className="font-bold text-base text-amber-200 font-festive">
                  Day 11 Special: Shri Satyanarayan Maha Puja & Mahaprasad
                </h4>
                <p className="text-xs text-amber-100/90 mt-0.5">
                  Thursday, 24 September 2026 • Puja: 4:00 PM • Mahaprasad Feast: 8:00 PM onwards. All society resident families are cordially invited!
                </p>
              </div>
            </div>

            <a
              href="#schedule"
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-red-950 shadow transition-all flex-shrink-0"
            >
              Full Program Timeline
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
