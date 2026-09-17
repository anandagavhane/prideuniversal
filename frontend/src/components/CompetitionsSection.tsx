import React, { useState, useMemo } from 'react';
import { Trophy, Play, ExternalLink, ArrowRight, CheckCircle2, Users, Search, X, Filter, FileSpreadsheet, Sparkles } from 'lucide-react';
import { GOOGLE_NOMINATION_FORM_URL } from '../services/googleSheetsService';
import { exportToExcel, normalizeCategory, isExcludedCategory } from '../services/nominationService';
import { CompetitionWinner, CompetitionParticipant } from '../types';

interface CompetitionsSectionProps {
  onOpenVideo: () => void;
  onNavigateToNominations: () => void;
  totalNominations: number;
  winners?: CompetitionWinner[];
  participants?: CompetitionParticipant[];
  onOpenNominationModal?: (category?: string) => void;
}

export const CompetitionsSection: React.FC<CompetitionsSectionProps> = React.memo(({
  onOpenVideo,
  onNavigateToNominations,
  totalNominations,
  winners = [],
  participants = [],
  onOpenNominationModal
}) => {
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedWingFilter, setSelectedWingFilter] = useState<'All' | 'A' | 'B'>('All');
  const [participantSearchQuery, setParticipantSearchQuery] = useState<string>('');
  const competitionCards = [
    {
      title: '💃 Dance',
      marathi: 'नृत्य स्पर्धा',
      desc: 'Solo, Duet, and Group performances. Classical, Semi-Classical, Folk & Bollywood.',
      hasVideo: true,
      rules: 'Duration: 3 to 5 minutes. Submit audio track to committee in advance.',
      hasWinners: true,
      winnerBadge: '🏆 Winners Out'
    },
    {
      title: '🎤 Singing',
      marathi: 'गायन स्पर्धा',
      desc: 'Devotional Abhang, Bhakti Geet, Classical & Light Music singing for kids & adults.',
      rules: 'Karaoke or live acoustic instruments permitted.',
      hasWinners: true,
      winnerBadge: '🏆 Winners Out'
    },
    {
      title: '🎨 Drawing',
      marathi: 'चित्रकला स्पर्धा',
      desc: 'Express creativity with eco-friendly Lord Ganesha and social themes.',
      rules: 'Drawing paper will be provided. Bring your own colours & pencils.',
      hasWinners: true,
      winnerBadge: '🏆 Winners Out'
    },
    {
      title: '🎭 Drama',
      marathi: 'नाट्य व अभिनय',
      desc: 'Short skits, monologue / ekpatri abhinay, and mythological enactments.',
      rules: 'Duration: 5 to 10 minutes. Clean family comedy or social message.'
    },
    {
      title: '📖 Shloka',
      marathi: 'श्लोक व स्तोत्र पठण',
      desc: 'Ganesh Atharvashirsha, Ramraksha, and Sanskrit shloka chanting with correct pronunciation.',
      rules: 'Age categories: Below 10 yrs, 10-18 yrs, and Adults.',
      hasWinners: true,
      winnerBadge: '🏆 Winner Out'
    },
    {
      title: '⭐ Emcee / Host',
      marathi: 'निवेदन व सूत्रसंचालन',
      desc: 'Anchor festival events, cultural nights, and games as the voice of Pride Universal.',
      rules: 'Marathi & Hindi bilingual hosting skills.',
      selectedBadge: '✨ 6 Hosts Selected'
    },
    {
      title: '🎹 Piano / Instrumental',
      marathi: 'वाद्य संगीत',
      desc: 'Keyboard, harmonium, flute, violin, or acoustic solo instrumental showcase.',
      rules: 'Original compositions or devotional bhajans welcome.',
      hasWinners: true,
      winnerBadge: '🏆 Winner Out'
    }
  ];

  const getCardWinners = (title: string) => {
    if (!winners || winners.length === 0) return [];
    const t = title.toLowerCase();
    return winners.filter(w => {
      const g = w.gameName.toLowerCase();
      if (t.includes('dance') && g.includes('dance')) return true;
      if (t.includes('singing') && g.includes('singing')) return true;
      if (t.includes('drawing') && g.includes('drawing')) return true;
      if (t.includes('shloka') && g.includes('shloka')) return true;
      if ((t.includes('piano') || t.includes('instrumental')) && (g.includes('piano') || g.includes('instrumental'))) return true;
      return false;
    });
  };

  const getCardParticipants = (title: string) => {
    if (!participants || participants.length === 0) return [];
    const t = title.toLowerCase();
    return participants.filter(p => {
      if (isExcludedCategory(p.eventCategory)) return false;
      const c = p.eventCategory.toLowerCase();
      if (t.includes('dance') && c.includes('dance')) return true;
      if (t.includes('singing') && c.includes('singing')) return true;
      if (t.includes('drawing') && c.includes('drawing')) return true;
      if (t.includes('drama') && c.includes('drama')) return true;
      if (t.includes('shloka') && c.includes('shloka')) return true;
      if (t.includes('emcee') && (c.includes('emcee') || c.includes('host'))) return true;
      if ((t.includes('piano') || t.includes('instrumental')) && (c.includes('piano') || c.includes('instrumental'))) return true;
      return false;
    });
  };

  const openCategoryParticipants = (categoryName: string) => {
    setSelectedCategoryFilter(normalizeCategory(categoryName));
    setSelectedWingFilter('All');
    setParticipantSearchQuery('');
    setIsParticipantsModalOpen(true);
  };

  // Distinct category list for modal tabs
  const categoryTabs = useMemo(() => {
    const defaultTabs = ['All', 'Dance', 'Drawing', 'Drama', 'Emcee / Host', 'Piano Play', 'Rangoli', 'Shloka', 'Singing'];
    const dynamicCats = Array.from(new Set(participants.map(p => normalizeCategory(p.eventCategory))))
      .filter(c => !isExcludedCategory(c));
    dynamicCats.forEach(c => {
      if (!defaultTabs.some(t => t.toLowerCase() === c.toLowerCase())) {
        defaultTabs.push(c);
      }
    });
    return defaultTabs;
  }, [participants]);

  const filteredParticipants = useMemo(() => {
    if (!participants || participants.length === 0) return [];
    return participants.filter(p => {
      if (isExcludedCategory(p.eventCategory)) return false;
      if (selectedCategoryFilter !== 'All') {
        const sel = normalizeCategory(selectedCategoryFilter).toLowerCase();
        const cat = normalizeCategory(p.eventCategory).toLowerCase();
        const match = sel === cat
          || (sel.includes('dance') && cat.includes('dance'))
          || (sel.includes('drawing') && cat.includes('drawing'))
          || (sel.includes('drama') && cat.includes('drama'))
          || (sel.includes('singing') && cat.includes('singing'))
          || (sel.includes('shloka') && cat.includes('shloka'))
          || (sel.includes('rangoli') && cat.includes('rangoli'))
          || ((sel.includes('piano') || sel.includes('instrumental')) && (cat.includes('piano') || cat.includes('instrumental')))
          || ((sel.includes('emcee') || sel.includes('host')) && (cat.includes('emcee') || cat.includes('host')))
          || cat.includes(sel);
        if (!match) return false;
      }
      if (selectedWingFilter !== 'All') {
        if (p.wing !== selectedWingFilter) return false;
      }
      if (participantSearchQuery.trim()) {
        const q = participantSearchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchFlat = p.flatNumber.toLowerCase().includes(q);
        const matchWing = p.wing.toLowerCase().includes(q);
        const matchCat = normalizeCategory(p.eventCategory).toLowerCase().includes(q) || p.eventCategory.toLowerCase().includes(q);
        if (!matchName && !matchFlat && !matchWing && !matchCat) return false;
      }
      return true;
    });
  }, [participants, selectedCategoryFilter, selectedWingFilter, participantSearchQuery]);

  return (
    <section 
      id="competitions" 
      className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/40 to-[#FEF7DA] scroll-mt-28 border-b border-amber-200"
    >
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.08] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/ganesh1.avif')" }}
      ></div>

      {/* Decorative Traditional Glow Accents */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header matching Canva */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-3">
            Pride Universal Ganapati Festival 2026
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-950 font-festive tracking-tight mb-2">
            🏅 Games & Events Nomination
          </h2>
          <p className="text-lg sm:text-xl font-bold text-amber-900 font-marathi">
            🎭 कलागुणांना व्यासपीठ, उत्सवाला आपली साथ!
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Participate, showcase your talent, and create joyful memories with our society family.
          </p>
        </div>

        {/* Master Nomination CTA Banner */}
        <div className="bg-gradient-to-r from-red-800 via-festival-saffron to-red-900 rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl border-2 border-amber-300 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <span className="inline-block text-amber-200 text-xs sm:text-sm uppercase tracking-widest font-bold mb-2">
            Official Participant Registration Form
          </span>

          <h3 className="text-2xl sm:text-4xl font-extrabold font-festive text-white mb-3">
            🏆 Nomination
          </h3>

          <p className="text-xs sm:text-base text-amber-100 max-w-2xl mx-auto mb-6">
            Fill the society nomination form online. Choose your favourite competitions, performances, and fun race events!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenNominationModal ? onOpenNominationModal() : window.open(GOOGLE_NOMINATION_FORM_URL, '_blank')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-300 text-red-950 shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-amber-200 cursor-pointer"
            >
              <Trophy className="w-5 h-5 text-red-900" />
              <span>Register Online Nomination</span>
              <Sparkles className="w-4 h-4 text-red-800" />
            </button>

            <button
              onClick={() => openCategoryParticipants('All')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md border border-amber-300 transition-all"
            >
              <Users className="w-4 h-4 text-amber-100" />
              <span>👥 View Participants Roster ({participants?.length || totalNominations})</span>
            </button>

            <button
              onClick={onNavigateToNominations}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-black/30 hover:bg-black/40 text-amber-100 border border-amber-300/40 transition-all"
            >
              <span>View Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-300/30 flex flex-wrap items-center justify-center gap-2 text-xs text-amber-100">
            <div className="inline-flex items-center gap-2 bg-black/25 px-3.5 py-1.5 rounded-full border border-amber-300/40">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Event &amp; Competition Leads:</span>
              <strong className="text-white font-black">Priyesh</strong>
              <span className="text-amber-400">•</span>
              <strong className="text-white font-black">Prafull &amp; Vijay</strong>
            </div>
          </div>
        </div>

        {/* Video Showcase & Cultural Patron Feature Row */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Video Showcase Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border-2 border-amber-300 shadow-md flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 shadow-inner">
                <Play className="w-7 h-7 fill-red-700 ml-0.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Featured Video</span>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 font-festive">
                  Ganesh Festival Dance & Cultural Showcase
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Watch previous years' cultural performances, kids' dances, drama skits, and devotional celebrations to get inspired!
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-amber-100">
              <span className="text-xs font-medium text-amber-900">
                🎬 Highlights from Pride Universal Pandal Stage
              </span>
              <button
                onClick={onOpenVideo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white shadow transition-all flex-shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Click to see video</span>
              </button>
            </div>
          </div>

          {/* Cultural Inspiration / Arts Patron Frame */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-red-500/10 rounded-2xl p-4 border-2 border-amber-300 shadow-md flex items-center gap-4 relative overflow-hidden">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-md border-2 border-amber-400 flex-shrink-0 bg-amber-950">
              <img 
                src="/photos/ganesh1.avif" 
                alt="Lord Ganesha - Patron of Arts & Intellect" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-red-800 bg-red-100/90 px-2.5 py-0.5 rounded-full border border-red-200 uppercase tracking-wider inline-block mb-1">
                कला व विद्या अधिष्ठाता
              </span>
              <h4 className="font-bold text-sm text-slate-900 font-festive leading-snug">
                बुद्धी आणि कलेची देवता
              </h4>
              <p className="text-xs text-slate-600 font-marathi mt-1 leading-relaxed">
                श्री गणेशाच्या कृपेने आपल्या सोसायटीतील सर्व कलाकारांच्या सुप्त कलागुणांना उत्तम व्यासपीठ मिळो!
              </p>
              <div className="mt-2 text-[11px] font-semibold text-amber-900">
                ✨ Dance • Music • Drama • Art
              </div>
            </div>
          </div>
        </div>

        {/* Competition Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitionCards.map((card, idx) => {
            const cardParticipants = getCardParticipants(card.title);
            return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between festive-card-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-red-950 font-festive flex items-center gap-1.5">
                    <span>{card.title}</span>
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {cardParticipants.length > 0 && (
                      <button
                        type="button"
                        onClick={() => openCategoryParticipants(card.title)}
                        className="text-[10px] font-extrabold text-blue-900 bg-blue-100 hover:bg-blue-200 border border-blue-300 px-2 py-0.5 rounded-full shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                        title="Click to view registered participants"
                      >
                        <Users className="w-2.5 h-2.5" />
                        <span>{cardParticipants.length} Entries</span>
                      </button>
                    )}
                    {card.selectedBadge && (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full shadow-xs">
                        {card.selectedBadge}
                      </span>
                    )}
                    {card.winnerBadge && (
                      <span className="text-[10px] font-extrabold text-amber-950 bg-gradient-to-r from-amber-200 to-yellow-300 border border-amber-400 px-2 py-0.5 rounded-full shadow-xs">
                        {card.winnerBadge}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded font-marathi">
                      {card.marathi}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-amber-100">
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{card.rules}</span>
                </div>

                {/* Announced Winners Preview with Names */}
                {(() => {
                  const cardWinners = getCardWinners(card.title);
                  if (cardWinners.length === 0) return null;
                  return (
                    <div className="mb-3.5 p-2.5 rounded-xl bg-amber-50/90 border border-amber-300/80 shadow-xs">
                      <div className="flex items-center justify-between text-[11px] font-black text-amber-950 mb-1.5 pb-1 border-b border-amber-200">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-600" />
                          <span>🏆 विजेते (Announced Winners)</span>
                        </span>
                        <span className="text-[10px] text-amber-700 font-bold uppercase">{cardWinners.length} Winners</span>
                      </div>
                      <div className="space-y-1">
                        {cardWinners.map((w, wIdx) => {
                          const medal = w.rank.includes('1') ? '🥇' : w.rank.includes('2') ? '🥈' : '🥉';
                          return (
                            <div key={wIdx} className="flex items-center justify-between text-xs bg-white/90 px-2 py-1 rounded-lg border border-amber-200/70">
                              <span className="font-bold text-red-950 truncate max-w-[140px] sm:max-w-[180px]">
                                {medal} {w.winnerName}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap ml-1">
                                {w.wing} • {w.flatNumber}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenNominationModal ? onOpenNominationModal(card.title) : window.open(GOOGLE_NOMINATION_FORM_URL, '_blank')}
                    className="flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-red-800 via-red-700 to-amber-700 hover:brightness-110 text-white shadow-xs transition-all cursor-pointer"
                  >
                    Nominate Now
                  </button>
                  {card.hasWinners && (
                    <a
                      href="#winners"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('winners');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-center py-2 px-2.5 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-colors flex items-center justify-center gap-1 flex-shrink-0"
                      title="View Winners"
                    >
                      <span>🏆 Winners</span>
                    </a>
                  )}
                  {card.hasVideo && (
                    <button
                      onClick={onOpenVideo}
                      title="Watch Video"
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer flex-shrink-0"
                    >
                      <Play className="w-4 h-4 fill-red-700" />
                    </button>
                  )}
                </div>

                {/* View Participants Button */}
                {cardParticipants.length > 0 && (
                  <button
                    type="button"
                    onClick={() => openCategoryParticipants(card.title)}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-bold bg-blue-50/90 hover:bg-blue-100 text-blue-900 border border-blue-200 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Users className="w-3.5 h-3.5 text-blue-700" />
                    <span>View {cardParticipants.length} Registered Participants ➔</span>
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* Bal Gopal & Little Devotees Talent Showcase Card */}
        <div className="mt-12 bg-gradient-to-r from-amber-100/90 via-orange-50/90 to-amber-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 relative group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-2 border-amber-400 bg-amber-950">
                <img 
                  src="/photos/memories_advik_2025.jpg" 
                  alt="Little Devotees - Pride Universal Kids Celebration" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <span className="absolute bottom-2.5 left-3 text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                  👶 बालगोपाळ & Little Devotees
                </span>
              </div>
            </div>

            <div className="md:col-span-7 space-y-2.5 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-800 bg-red-100 px-3 py-1 rounded-full border border-red-200 inline-block">
                ✨ बालगोपाळ कलाविष्कार
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-red-950 font-festive">
                लहान मुलांचा सळसळता आनंद व सहभाग
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Dance, Drawing, Shloka Recitation, Singing, आणि मजेदार शर्यती! सोसायटीतील सर्व लहान मुलांना व्यासपीठावर आपल्या कलागुणांचे सादरीकरण करण्याची सुवर्णसंधी. प्रत्येक चिमुकल्या कलाकाराचा गौरव केला जाईल.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onOpenNominationModal ? onOpenNominationModal('Drawing') : window.open(GOOGLE_NOMINATION_FORM_URL, '_blank')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white shadow transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>Register Child Now</span>
                </button>
                <button
                  onClick={onNavigateToNominations}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-950 bg-amber-200/80 hover:bg-amber-300 border border-amber-400/60 transition-all"
                >
                  <span>View Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 👥 Live Competition Participants Roster Modal */}
        {isParticipantsModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setIsParticipantsModalOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border-2 border-amber-300 flex flex-col overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-900 via-amber-900 to-red-950 p-5 sm:p-6 text-white flex items-center justify-between border-b border-amber-300 relative flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎭</span>
                    <h3 className="text-lg sm:text-2xl font-black font-festive text-amber-200">
                      Live Competition Participants Roster
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-100/90 mt-1">
                    Pride Universal Ganapati Festival 2026 • Verified Society Registrations
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => exportToExcel(filteredParticipants, [], `PrideUniversal_Participants_${selectedCategoryFilter.replace(/\s+/g, '_')}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white border border-emerald-400/60 shadow-sm transition-all cursor-pointer"
                    title="यादी Excel मध्ये डाऊनलोड करा / Download filtered list in Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                    <span className="hidden xs:inline">Excel डाऊनलोड</span>
                  </button>
                  <button
                    onClick={() => setIsParticipantsModalOpen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Close Modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="p-4 sm:p-5 bg-amber-50/60 border-b border-amber-200 space-y-3 flex-shrink-0">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search participant by name or flat number (e.g. Adhira, 202, 503)..."
                    value={participantSearchQuery}
                    onChange={(e) => setParticipantSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                  />
                  {participantSearchQuery && (
                    <button
                      onClick={() => setParticipantSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {categoryTabs.map((tab) => {
                    const validList = (participants || []).filter(p => !isExcludedCategory(p.eventCategory));
                    const count = tab === 'All'
                      ? validList.length
                      : validList.filter(p => {
                          const c = p.eventCategory.toLowerCase();
                          const t = tab.toLowerCase();
                          if (t.includes('dance') && c.includes('dance')) return true;
                          if (t.includes('drawing') && c.includes('drawing')) return true;
                          if (t.includes('drama') && c.includes('drama')) return true;
                          if (t.includes('singing') && c.includes('singing')) return true;
                          if (t.includes('shloka') && c.includes('shloka')) return true;
                          if (t.includes('rangoli') && c.includes('rangoli')) return true;
                          if ((t.includes('piano') || t.includes('instrumental')) && (c.includes('piano') || c.includes('instrumental'))) return true;
                          if ((t.includes('emcee') || t.includes('host')) && (c.includes('emcee') || c.includes('host'))) return true;
                          return c.includes(t);
                        }).length;
                    const isSelected = normalizeCategory(selectedCategoryFilter).toLowerCase() === normalizeCategory(tab).toLowerCase();
                    return (
                      <button
                        key={tab}
                        onClick={() => setSelectedCategoryFilter(tab)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                          isSelected
                            ? 'bg-red-800 text-white shadow-md'
                            : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
                        }`}
                      >
                        <span>{tab}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-900 font-extrabold'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Wing Filter Buttons & Results Count */}
                <div className="flex items-center justify-between gap-2 text-xs flex-wrap pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-amber-700" /> Wing:
                    </span>
                    {(['All', 'A', 'B'] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWingFilter(w)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          selectedWingFilter === w
                            ? 'bg-amber-700 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-amber-100 border border-amber-200'
                        }`}
                      >
                        {w === 'All' ? 'All Wings' : `Wing ${w}`}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-amber-950">
                    Showing {filteredParticipants.length} of {(participants || []).filter(p => !isExcludedCategory(p.eventCategory)).length} participants
                  </div>
                </div>
              </div>

              {/* Participant List (Scrollable) */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 divide-y divide-amber-100">
                {filteredParticipants.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="font-bold text-slate-700">No participants found matching your filter</p>
                    <p className="text-xs text-slate-500 mt-1">Try changing your search term or category filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredParticipants.map((p, pIdx) => {
                      const catLower = p.eventCategory.toLowerCase();
                      const icon = catLower.includes('dance') ? '💃' :
                                   catLower.includes('drawing') ? '🎨' :
                                   catLower.includes('singing') ? '🎤' :
                                   catLower.includes('shloka') ? '📖' :
                                   catLower.includes('piano') ? '🎹' : '⭐';
                      return (
                        <div 
                          key={`${p.eventCategory}_${p.srNo}_${pIdx}`}
                          className="bg-white rounded-xl p-3 border border-amber-200 hover:border-amber-400 shadow-xs flex items-center justify-between gap-3 transition-all hover:shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center justify-center flex-shrink-0 border border-amber-300">
                              {p.srNo}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {p.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] font-semibold text-amber-800 flex items-center gap-0.5">
                                  <span>{icon}</span> {normalizeCategory(p.eventCategory)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                              p.wing === 'A' 
                                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                : 'bg-red-100 text-red-900 border-red-200'
                            }`}>
                              Wing {p.wing} • {p.flatNumber}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-amber-50 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
                <span className="text-xs text-slate-600 text-center sm:text-left">
                  Want to participate or register another child?
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsParticipantsModalOpen(false);
                      if (onOpenNominationModal) {
                        onOpenNominationModal(selectedCategoryFilter === 'All' ? undefined : selectedCategoryFilter);
                      } else {
                        window.open(GOOGLE_NOMINATION_FORM_URL, '_blank');
                      }
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-red-700 to-festival-saffron text-white shadow hover:brightness-105 transition-all cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>+ Submit New Nomination</span>
                  </button>
                  <button
                    onClick={() => setIsParticipantsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

CompetitionsSection.displayName = 'CompetitionsSection';
