import React from 'react';
import { Users, Phone, Laptop, Trophy, Sparkles } from 'lucide-react';
import { COMMITTEE_DATA } from '../data/scheduleData';

export const CommitteeSection: React.FC = () => {
  return (
    <section 
      id="committee" 
      className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/40 to-[#FEF7DA] scroll-mt-28 border-b border-amber-200"
    >
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/memories_2025_idol3.jpeg')" }}
      ></div>

      {/* Decorative Traditional Glow Accents */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header matching Canva */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block mb-3 font-marathi">
            ॥ गणपती बाप्पा मोरया ॥
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-950 font-festive tracking-tight mb-2">
            BEHIND THE CELEBRATION
          </h2>

          <p className="text-base sm:text-lg text-amber-900 font-semibold font-marathi">
            आयोजक समिती व स्वयंसेवक मंडळ
          </p>

          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Dedicated resident committee working selflessly to bring our society together with devotion and harmony.
          </p>
        </div>

        {/* 2 Columns Grid for Committee Departments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {COMMITTEE_DATA.map((dept, idx) => {
            const isHighlighted = dept.highlight;
            return (
              <div
                key={idx}
                className={`rounded-3xl p-6 sm:p-7 border-2 shadow-md relative overflow-hidden festive-card-hover flex flex-col justify-between transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-gradient-to-br from-amber-100/90 via-orange-50/70 to-white border-amber-500 ring-2 ring-amber-400/30 shadow-lg'
                    : 'bg-gradient-to-br from-[#fff7de] to-white border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-amber-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-xs ${
                        isHighlighted
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-400 text-white'
                          : 'bg-amber-400/30 border-amber-400 text-red-900'
                      }`}>
                        {dept.department.includes('MANAGEMENT') ? (
                          <Users className={`w-6 h-6 ${isHighlighted ? 'text-white' : 'text-red-800'}`} />
                        ) : dept.department.includes('TEMPLE') || dept.department.includes('DECORATION') ? (
                          <Sparkles className={`w-6 h-6 ${isHighlighted ? 'text-white' : 'text-amber-600'}`} />
                        ) : dept.department.includes('EVENTS') ? (
                          <Trophy className="w-6 h-6 text-red-700" />
                        ) : (
                          <Laptop className="w-6 h-6 text-festival-saffron" />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block">
                          Department {idx + 1}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-red-950 font-festive leading-tight">
                          {dept.department}
                        </h3>
                      </div>
                    </div>

                    {isHighlighted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-red-700 to-festival-saffron text-white px-2.5 py-1 rounded-full shadow-xs flex-shrink-0">
                        <span>★ Key Incharge</span>
                      </span>
                    )}
                  </div>

                  {/* Members List */}
                  <div className="space-y-3.5">
                    {dept.members.map((member, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-white/95 p-4 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between gap-4 hover:border-amber-300 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base">👤</span>
                            <h4 className="font-extrabold text-slate-900 text-sm">
                              {member.name}
                            </h4>
                          </div>
                          {member.role && (
                            <p className="text-xs text-amber-800 font-semibold pl-6 mt-0.5">
                              {member.role}
                            </p>
                          )}
                        </div>

                        {member.phone && (
                          <a
                            href={`tel:${member.phone.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-colors flex-shrink-0"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{member.phone}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Auspicious Society Blessing Banner with Divine Ganesha Frame */}
        <div className="bg-gradient-to-r from-red-950 via-festival-darkRed to-red-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Framed Divine Ganesha Photo */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative group w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-300 ring-4 ring-amber-500/30 bg-slate-950">
                <img 
                  src="/photos/memories_2025_idol3.jpeg" 
                  alt="Lord Ganesha Blessing Pride Universal" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <span className="absolute bottom-2 inset-x-0 text-center text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                  ॥ विघ्नहर्ता ॥
                </span>
              </div>
            </div>

            {/* Blessing Prayer & Society Message */}
            <div className="md:col-span-8 text-center md:text-left space-y-3">
              <span className="inline-block text-2xl animate-pulse">🌺</span>
              <h3 className="text-2xl sm:text-3xl font-black font-festive text-amber-300">
                ॥ गणपती बाप्पा मोरया ॥
              </h3>
              <p className="text-sm sm:text-base text-amber-100/95 font-marathi font-medium leading-relaxed">
                सुखकर्ता, दुःखहर्ता, विघ्नहर्ता गणपती बाप्पा आपल्या प्राइड युनिव्हर्सल परिवारावर सदैव कृपादृष्टी ठेवोत!
              </p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                May Lord Ganesha bestow good health, prosperity, peace, and eternal harmony upon every resident family. Let us celebrate this 12-day festival with supreme devotion, unity, and shared joy.
              </p>
              <div className="pt-2">
                <span className="inline-block text-[11px] font-bold text-amber-300/90 tracking-widest uppercase bg-black/40 px-3 py-1 rounded-full border border-amber-400/30">
                  Pride Universal Residential Society • Ganesh Festival 2026
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
