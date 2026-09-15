import React from 'react';
import { Trophy, Play, ExternalLink, ArrowRight, CheckCircle2, Users } from 'lucide-react';
import { GOOGLE_NOMINATION_FORM_URL } from '../services/googleSheetsService';

interface CompetitionsSectionProps {
  onOpenVideo: () => void;
  onNavigateToNominations: () => void;
  totalNominations: number;
}

export const CompetitionsSection: React.FC<CompetitionsSectionProps> = ({
  onOpenVideo,
  onNavigateToNominations,
  totalNominations
}) => {
  const competitionCards = [
    {
      title: '💃 Dance',
      marathi: 'नृत्य स्पर्धा',
      desc: 'Solo, Duet, and Group performances. Classical, Semi-Classical, Folk & Bollywood.',
      hasVideo: true,
      rules: 'Duration: 3 to 5 minutes. Submit audio track to committee in advance.'
    },
    {
      title: '🎤 Singing',
      marathi: 'गायन स्पर्धा',
      desc: 'Devotional Abhang, Bhakti Geet, Classical & Light Music singing for kids & adults.',
      rules: 'Karaoke or live acoustic instruments permitted.'
    },
    {
      title: '🎨 Drawing',
      marathi: 'चित्रकला स्पर्धा',
      desc: 'Express creativity with eco-friendly Lord Ganesha and social themes.',
      rules: 'Drawing paper will be provided. Bring your own colours & pencils.'
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
      rules: 'Age categories: Below 10 yrs, 10-18 yrs, and Adults.'
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
      rules: 'Original compositions or devotional bhajans welcome.'
    }
  ];

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

        {/* Master Nomination CTA Banner (Matching Canva's "🠔 🏆 Nomination ➔") */}
        <div className="bg-gradient-to-r from-red-800 via-festival-saffron to-red-900 rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl border-2 border-amber-300 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <span className="inline-block text-amber-200 text-xs sm:text-sm uppercase tracking-widest font-bold mb-2">
            Official Participant Registration Form
          </span>

          <h3 className="text-2xl sm:text-4xl font-extrabold font-festive text-white mb-3">
            🠔 🏆 Nomination ➔
          </h3>

          <p className="text-xs sm:text-base text-amber-100 max-w-2xl mx-auto mb-6">
            Fill the society nomination form online. Choose your favourite competitions, performances, and fun race events!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={GOOGLE_NOMINATION_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-300 text-red-950 shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-amber-200"
            >
              <Trophy className="w-5 h-5 text-red-900" />
              <span>Register Online Nomination</span>
              <ExternalLink className="w-4 h-4 text-red-800" />
            </a>

            <button
              onClick={onNavigateToNominations}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-black/30 hover:bg-black/40 text-amber-100 border border-amber-300/40 transition-all"
            >
              <span>View Live Dashboard ({totalNominations} Entries)</span>
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
          {competitionCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between festive-card-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-red-950 font-festive flex items-center gap-1.5">
                    <span>{card.title}</span>
                  </h3>
                  <div className="flex items-center gap-1.5">
                    {card.selectedBadge && (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full shadow-xs">
                        {card.selectedBadge}
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
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{card.rules}</span>
                </div>

                <div className="flex items-center gap-2">
                  {card.title.includes('Emcee') ? (
                    <a
                      href="#selected-emcees"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('selected-emcees');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-red-800 to-festival-saffron text-white shadow hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>🎙️ View Selected Emcees</span>
                    </a>
                  ) : (
                    <a
                      href={GOOGLE_NOMINATION_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
                    >
                      Nominate Now
                    </a>
                  )}
                  {card.hasVideo && (
                    <button
                      onClick={onOpenVideo}
                      title="Watch Video"
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-red-700" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
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
                <a
                  href={GOOGLE_NOMINATION_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white shadow transition-all"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>Register Child Now</span>
                </a>
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
      </div>
    </section>
  );
};
