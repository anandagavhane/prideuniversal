import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, RefreshCw, ExternalLink } from 'lucide-react';
import { FESTIVAL_SCHEDULE } from '../data/scheduleData';
import { EventItem } from '../types';

interface ScheduleSectionProps {
  scheduleData?: EventItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = React.memo(({
  scheduleData,
  isLoading = false,
  onRefresh,
  lastUpdated
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const activeEvents = scheduleData && scheduleData.length > 0 ? scheduleData : FESTIVAL_SCHEDULE;

  const standardCategoryIcons: Record<string, string> = {
    'Aagaman': '🪔',
    'Games': '🏆',
    'Cultural': '🎭',
    'Puja': '🍽️',
    'Visarjan': '🌊'
  };

  const presentCategories = Array.from(new Set(activeEvents.map(e => e.category).filter(Boolean)));
  const categories = [
    { id: 'All', label: `All (${activeEvents.length} Days)` },
    ...presentCategories.map(cat => ({
      id: cat,
      label: `${standardCategoryIcons[cat] || '✨'} ${cat}`
    }))
  ];

  const highlightEvents = activeEvents.filter(e => e.highlight);
  const displayMilestones = highlightEvents.length > 0 
    ? highlightEvents 
    : activeEvents.slice(0, 4);

  const getMilestonePhoto = (ev: EventItem) => {
    const cat = (ev.category || '').toLowerCase();
    const title = (ev.title || '').toLowerCase();
    if (cat.includes('aagaman') || title.includes('aagaman')) {
      return '/photos/img_20250906_wa0108.jpg';
    }
    if (cat.includes('visarjan') || title.includes('visarjan')) {
      return '/photos/memories_visrjan_2025.jpg';
    }
    if (cat.includes('puja') || title.includes('satyanarayan') || title.includes('mahaprasad')) {
      return '/photos/memories_mahaprasad1.jpeg';
    }
    if (title.includes('drawing') || title.includes('painting')) {
      return '/photos/img_20250830_wa0005.jpg';
    }
    if (cat.includes('cultural') || title.includes('dance') || title.includes('atharvashirsha')) {
      return '/photos/memories_advik_2025.jpg';
    }
    if (cat.includes('games') || title.includes('game')) {
      return '/photos/img_20250906_wa0110.jpg';
    }
    return '/photos/memories_2025_idol2.jpeg';
  };

  const filteredEvents = selectedCategory === 'All'
    ? activeEvents
    : activeEvents.filter(e => e.category === selectedCategory);

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
            {activeEvents.length > 0 ? `${activeEvents.length} दिवस` : '१२ दिवस'} • भक्ती • संस्कृती • एकोप्याचा उत्सव
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {activeEvents.length > 0 && activeEvents[0].displayDate && activeEvents[activeEvents.length - 1].displayDate
              ? `From ${activeEvents[0].displayDate.replace(/^Day \d+\s*-\s*/, '')} to ${activeEvents[activeEvents.length - 1].displayDate.replace(/^Day \d+\s*-\s*/, '')} at Pride Universal Society Premises`
              : 'From 14 September 2026 to 25 September 2026 at Pride Universal Society Premises'}
          </p>

          {/* Live Schedule Status & Manual Refresh Bar */}
          <div className="mt-4 inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>Live Schedule</span>
            {lastUpdated && (
              <span className="text-[11px] text-emerald-600 hidden sm:inline">
                • {lastUpdated}
              </span>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Refresh schedule"
                className="ml-1 p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-700 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
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

        {/* Grid of Cards (Matching the Canva design) */}
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
        {displayMilestones.length > 0 && (
          <div className="mt-14">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
                ✨ {displayMilestones.length} Key Festival Milestones
              </span>
              <h3 className="text-2xl font-black text-red-950 font-festive">
                महोत्सवाचे प्रमुख आकर्षण व क्षणचित्रे
              </h3>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${displayMilestones.length <= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-5`}>
              {displayMilestones.map((milestone) => {
                const isVisarjan = (milestone.category || '').toLowerCase().includes('visarjan') || milestone.day === activeEvents.length;
                return (
                  <div 
                    key={milestone.day}
                    className={`bg-white rounded-2xl overflow-hidden border-2 ${
                      isVisarjan ? 'border-amber-400 ring-2 ring-amber-300/30' : 'border-amber-300'
                    } shadow-md group festive-card-hover flex flex-col justify-between`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img 
                        src={getMilestonePhoto(milestone)} 
                        alt={milestone.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-red-700/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow border border-amber-300">
                        Day {milestone.day} • {milestone.displayDate.replace(/^Day \d+\s*-\s*/, '')}
                      </div>
                      {isVisarjan && (
                        <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-red-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                          ⭐ Topper
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-sm text-red-950 font-festive mb-1">
                          {milestone.title}
                        </h4>
                        {milestone.description && (
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-[10px] text-amber-800 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-red-600" />
                          {milestone.time}
                        </span>
                        <span className="bg-amber-100/80 px-2 py-0.5 rounded-full">
                          {milestone.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

ScheduleSection.displayName = 'ScheduleSection';
