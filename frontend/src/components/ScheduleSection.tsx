import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { FESTIVAL_SCHEDULE } from '../data/scheduleData';
import { EventItem } from '../types';

export const ScheduleSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: 'All 12 Days' },
    { id: 'Aagaman', label: '🪔 Aagaman' },
    { id: 'Games', label: '🏆 Fun & Games' },
    { id: 'Cultural', label: '🎭 Cultural Night' },
    { id: 'Puja', label: '🍽️ Puja & Mahaprasad' },
    { id: 'Visarjan', label: '🌊 Visarjan' }
  ];

  const filteredEvents = selectedCategory === 'All'
    ? FESTIVAL_SCHEDULE
    : FESTIVAL_SCHEDULE.filter(e => e.category === selectedCategory);

  return (
    <section 
      id="schedule" 
      className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/40 to-[#FEF7DA] scroll-mt-28 border-b border-amber-200"
    >
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/memories_2025_idol2.jpeg')" }}
      ></div>

      {/* Decorative Traditional Glow Accents */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header matching Canva */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-red-900 font-bold text-xs uppercase tracking-widest mb-3">
            <Calendar className="w-3.5 h-3.5 text-festival-saffron" />
            <span>📅 FESTIVAL SCHEDULE</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-950 tracking-tight font-festive mb-2">
            श्री गणेश उत्सव कार्यक्रम
          </h2>
          
          <p className="text-base sm:text-lg text-amber-900 font-semibold font-marathi">
            १२ दिवस • भक्ती • संस्कृती • एकोप्याचा उत्सव
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            From 14 September 2026 to 25 September 2026 at Pride Universal Society Premises
          </p>
        </div>

        {/* Filter Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-red-800 to-festival-saffron text-white shadow-md scale-105'
                  : 'bg-amber-100/70 text-slate-700 hover:bg-amber-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 12-Day Grid of Cards (Matching the Canva design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: EventItem) => (
            <div
              key={event.day}
              className={`relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between festive-card-hover border ${
                event.highlight
                  ? 'bg-gradient-to-br from-[#ffda6a]/30 via-[#fff7de] to-[#fccd71]/20 border-amber-400 shadow-md'
                  : 'bg-white border-amber-200 shadow-sm'
              }`}
            >
              {/* Milestone Tag */}
              {event.highlight && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-red-700 to-festival-orange text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow border border-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Grand Milestone</span>
                </div>
              )}

              <div>
                {/* Day and Timing Header */}
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-3 mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-md">
                    {event.displayDate}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-red-700">
                    <Clock className="w-3.5 h-3.5 text-festival-saffron" />
                    {event.time}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {event.title}
                </h3>

                {/* Event Description */}
                {event.description && (
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {event.description}
                  </p>
                )}
              </div>

              {/* Card Footer with Venue */}
              <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-600" />
                  <span>Society Stage / Premises</span>
                </span>
                <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  Day {event.day}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Festival Mega Highlights Showcase */}
        <div className="mt-14">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
              ✨ 4 Key Festival Milestones
            </span>
            <h3 className="text-2xl font-black text-red-950 font-festive">
              महोत्सवाचे प्रमुख आकर्षण व क्षणचित्रे
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Aagaman */}
            <div className="bg-white rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md group festive-card-hover flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img 
                  src="/photos/img_20250906_wa0108.jpg" 
                  alt="Ganesh Aagaman Procession" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 bg-red-700/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow border border-amber-300">
                  Day 1 • 14 Sep
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-sm text-red-950 font-festive mb-1">
                    Grand Aagaman (आगमन)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    Main Gate welcome with live Dhol Tasha, lezim troupe, flower shower, and traditional sthapana puja.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Cultural Night & Bal Gopal */}
            <div className="bg-white rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md group festive-card-hover flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img 
                  src="/photos/memories_advik_2025.jpg" 
                  alt="Little Devotees & Bal Gopal Celebration" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 bg-festival-saffron/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow border border-amber-300">
                  Day 7 • 20 Sep
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-sm text-red-950 font-festive mb-1">
                    Cultural Night & Bal Gopal (सांस्कृतिक)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    Atharvashirsha pathan, fancy dress, kids dance performances, and vibrant cultural evening.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Mahaprasad */}
            <div className="bg-white rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md group festive-card-hover flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img 
                  src="/photos/memories_mahaprasad1.jpeg" 
                  alt="Satyanarayan Puja & Mahaprasad Feast" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 bg-amber-600/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow border border-amber-300">
                  Day 11 • 24 Sep
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-sm text-red-950 font-festive mb-1">
                    Satyanarayan Puja & Mahaprasad
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    Auspicious community Satyanarayan Puja followed by grand society Mahaprasad feast.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Visarjan & Prasthan */}
            <div className="bg-white rounded-2xl overflow-hidden border-2 border-amber-400 ring-2 ring-amber-300/30 shadow-md group festive-card-hover flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img 
                  src="/photos/memories_visrjan_2025.jpg" 
                  alt="Pride Universal Ganesh Visarjan Procession Topper" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 bg-festival-darkRed/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow border border-amber-300">
                  Day 12 • 25 Sep
                </div>
                <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-red-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                  ⭐ Topper
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-sm text-red-950 font-festive mb-1">
                    Visarjan Miravnuk (विसर्जन)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    Final ceremonial Uttarpuja, collective Maha Aarti, and emotional farewell chants: "पुढच्या वर्षी लवकर या!".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
