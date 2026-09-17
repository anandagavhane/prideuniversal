import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  BookOpen, 
  Type, 
  Copy, 
  Check, 
  Sparkles, 
  Languages, 
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { AARTI_LIST } from '../data/aartiData';
import { AartiItem } from '../types';

export const AartiSection: React.FC = React.memo(() => {
  const [selectedAartiId, setSelectedAartiId] = useState<string>('sukhkarta');
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl' | '2xl'>('xl');
  const [scriptMode, setScriptMode] = useState<'marathi' | 'english' | 'both'>('marathi');
  const [copied, setCopied] = useState<boolean>(false);

  // Listen for direct deep-link or search result selection
  React.useEffect(() => {
    const handleAartiSelect = (e: Event) => {
      const customEvt = e as CustomEvent<string>;
      if (customEvt.detail && AARTI_LIST.some(a => a.id === customEvt.detail)) {
        setSelectedAartiId(customEvt.detail);
      }
    };
    window.addEventListener('select-aarti', handleAartiSelect);
    return () => window.removeEventListener('select-aarti', handleAartiSelect);
  }, []);

  const selectedAarti: AartiItem = AARTI_LIST.find(a => a.id === selectedAartiId) || AARTI_LIST[0];

  const aartiTimings = [
    {
      session: 'Morning Aarti (सकाळची आरती)',
      time: '8:00 AM',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      tag: 'Morning Ritual',
      details: 'Daily morning prayers, Atharvashirsha pathan, and naivedya offering.',
      guidelines: 'Devotees are requested to bring fresh flowers, durva, and clean prasad by 7:45 AM.'
    },
    {
      session: 'Evening Maha Aarti (संध्याकाळची महाआरती)',
      time: '7:30 PM',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      tag: 'Grand Pandal Aarti',
      details: 'Daily evening community Maha Aarti with Dhol Tasha, conch, and collective chanting.',
      guidelines: 'All society resident families gather together in traditional attire. Daily prasad distribution follows.'
    }
  ];

  // Copy Aarti lyrics to clipboard
  const handleCopyAarti = () => {
    const lines: string[] = [];
    lines.push(`॥ ${selectedAarti.marathiTitle} ॥\n`);
    selectedAarti.stanzas.forEach(stanza => {
      if (scriptMode === 'marathi' || scriptMode === 'both') {
        lines.push(stanza.marathi.join('\n'));
      }
      if (scriptMode === 'english' || scriptMode === 'both') {
        if (stanza.english) {
          lines.push(stanza.english.join('\n'));
        }
      }
      lines.push(''); // blank line
    });
    lines.push('॥ गणपती बाप्पा मोरया, पुढच्या वर्षी लवकर या! ॥');
    lines.push('Pride Universal Ganeshotsav 2026');

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.warn('Could not copy aarti lyrics:', err);
    });
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'base': return 'text-base sm:text-lg leading-relaxed sm:leading-loose';
      case 'lg': return 'text-lg sm:text-xl leading-relaxed sm:leading-loose';
      case 'xl': return 'text-xl sm:text-2xl leading-loose';
      case '2xl': return 'text-2xl sm:text-3xl leading-loose';
      default: return 'text-xl sm:text-2xl leading-loose';
    }
  };

  const getEnglishFontSizeClass = () => {
    switch (fontSize) {
      case 'base': return 'text-xs sm:text-sm';
      case 'lg': return 'text-sm sm:text-base';
      case 'xl': return 'text-base sm:text-lg';
      case '2xl': return 'text-lg sm:text-xl';
      default: return 'text-sm sm:text-base';
    }
  };

  return (
    <section 
      id="aarti" 
      className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#ffefcf]/50 to-[#FEF7DA] scroll-mt-28 border-b border-amber-200"
    >
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/ganu2.webp')" }}
      ></div>

      {/* Decorative Traditional Glow Accents */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-800 to-amber-700 text-white font-bold text-xs uppercase tracking-widest mb-3 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span>DAILY DEVOTIONAL SCHEDULE &amp; AARTI SANGRAH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-950 font-festive tracking-tight mb-2">
            🪔 श्री गणेश नित्य आरती व आरती संग्रह
          </h2>

          <p className="text-base sm:text-lg text-amber-900 font-bold font-marathi">
            ॥ सुखकर्ता दुःखहर्ता वार्ता विघ्नाची, नुरवी पुरवी प्रेम कृपा जयाची ॥
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Join the daily morning &amp; evening community Aarti at the pandal, or recite along with your family using the lyrics below!
          </p>
        </div>

        {/* 2 Primary Daily Aarti Timings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {aartiTimings.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-[#fffdf5] via-white to-[#fecd70]/20 rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-md relative overflow-hidden festive-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold">
                    {item.icon}
                    <span>{item.tag}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black bg-red-700 text-white px-3.5 py-1 rounded-full shadow-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Daily at {item.time}</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-red-950 font-festive mb-2">
                  {item.session}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 font-medium mb-4 leading-relaxed">
                  {item.details}
                </p>
              </div>

              <div className="pt-3 border-t border-amber-200/80 text-xs text-amber-950 bg-amber-50/90 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-red-900 block mb-0.5">Seva &amp; Prasad Guidelines:</span>
                <span>{item.guidelines}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE GANESHOTSAV AARTI READER (आरती वाचन व पठण) */}
        {/* ========================================================================= */}
        <div className="bg-white/95 rounded-3xl border-2 border-amber-400 shadow-xl overflow-hidden relative mb-12">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-red-800 via-festival-saffron to-red-900 text-white px-6 py-4 border-b-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-bold text-xl shadow-md">
                <BookOpen className="w-5 h-5 text-red-950" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-200 block leading-none">
                  DEVOTIONAL CHANTING BOOK
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-festive mt-0.5">
                  📖 गणेशोत्सव संपूर्ण आरती संग्रह (Aarti Book)
                </h3>
              </div>
            </div>

            {/* Script / Language Switcher */}
            <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-amber-300/40 text-xs font-bold">
              <Languages className="w-3.5 h-3.5 text-amber-300 ml-1.5 hidden sm:inline" />
              <button
                onClick={() => setScriptMode('marathi')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  scriptMode === 'marathi'
                    ? 'bg-amber-400 text-red-950 shadow font-black'
                    : 'text-amber-100 hover:text-white'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setScriptMode('english')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  scriptMode === 'english'
                    ? 'bg-amber-400 text-red-950 shadow font-black'
                    : 'text-amber-100 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setScriptMode('both')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  scriptMode === 'both'
                    ? 'bg-amber-400 text-red-950 shadow font-black'
                    : 'text-amber-100 hover:text-white'
                }`}
              >
                Both
              </button>
            </div>
          </div>

          {/* Aarti Selection Tabs Strip */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/80 border-b border-amber-200 overflow-x-auto scrollbar-thin">
            <div className="flex items-center gap-2 min-w-max pb-1 sm:pb-0">
              {AARTI_LIST.map((aarti, idx) => {
                const isSelected = aarti.id === selectedAartiId;
                const tabTitle = aarti.marathiTitle
                  .replace(/^[०-९0-9.\s]+/, '')
                  .replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, '')
                  .split('(')[0]
                  .trim();
                return (
                  <button
                    key={aarti.id}
                    onClick={() => setSelectedAartiId(aarti.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-800 to-festival-saffron text-white shadow-md scale-105 border-2 border-amber-300'
                        : 'bg-white hover:bg-amber-100/80 text-slate-800 border border-amber-200'
                    }`}
                  >
                    <span className="text-base leading-none">{aarti.icon}</span>
                    <span className="font-marathi font-bold">{idx + 1}. {tabTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reading Controls Toolbar: Active Aarti Details + Font Size + Copy */}
          <div className="px-6 py-3.5 bg-amber-50/50 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedAarti.icon}</span>
              <div>
                <h4 className="text-base sm:text-lg font-black text-red-950 font-festive leading-tight">
                  {selectedAarti.marathiTitle}
                </h4>
                <span className="text-[11px] text-amber-900 font-semibold block">
                  {selectedAarti.deity} • {selectedAarti.composer}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Font Size Selector */}
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-amber-300 shadow-xs text-xs">
                <Type className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-[10px] font-bold text-slate-500 uppercase mr-1 hidden sm:inline">Size:</span>
                {(['base', 'lg', 'xl', '2xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-0.5 rounded-md font-extrabold text-xs transition-all ${
                      fontSize === sz
                        ? 'bg-red-800 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-amber-100'
                    }`}
                  >
                    {sz === 'base' ? 'A-' : sz === 'lg' ? 'A' : sz === 'xl' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>

              {/* Copy Aarti Button */}
              <button
                onClick={handleCopyAarti}
                title="Copy Aarti lyrics to clipboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 shadow-xs transition-transform active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-black">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-800" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Aarti Lyrics Display Area */}
          <div className="p-6 sm:p-10 text-center max-w-3xl mx-auto space-y-6">
            {selectedAarti.stanzas.map((stanza, sIdx) => {
              const isChorus = stanza.type === 'chorus';

              return (
                <div
                  key={sIdx}
                  className={`rounded-2xl transition-all ${
                    isChorus
                      ? 'bg-gradient-to-r from-amber-100/90 via-orange-100/80 to-amber-100/90 p-5 sm:p-6 border-2 border-amber-400 shadow-sm'
                      : 'p-3 sm:p-4'
                  }`}
                >
                  {isChorus && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-800 text-white text-[10px] font-black uppercase tracking-widest mb-3 shadow-xs">
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      <span>धृपद / CHORUS</span>
                    </div>
                  )}

                  {/* Marathi Lyrics */}
                  {(scriptMode === 'marathi' || scriptMode === 'both') && (
                    <div className={`font-marathi font-black text-red-950 ${getFontSizeClass()} ${
                      isChorus ? 'text-red-950 font-extrabold drop-shadow-xs' : 'text-slate-900'
                    }`}>
                      {stanza.marathi.map((line, lIdx) => (
                        <div key={lIdx} className="py-0.5">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* English Transliteration */}
                  {(scriptMode === 'english' || scriptMode === 'both') && stanza.english && (
                    <div className={`mt-2 font-serif text-amber-950/85 italic ${getEnglishFontSizeClass()} ${
                      scriptMode === 'both' ? 'pt-2 border-t border-amber-200/70' : ''
                    }`}>
                      {stanza.english.map((line, lIdx) => (
                        <div key={lIdx} className="py-0.5">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Sacred Bottom Chanting Chorus Bar */}
            <div className="mt-8 pt-6 border-t-2 border-amber-200/80">
              <div className="inline-block bg-gradient-to-r from-red-800 via-festival-saffron to-red-900 text-white font-marathi font-black text-lg sm:text-2xl px-6 py-3 rounded-2xl shadow-lg border-2 border-amber-300">
                ॥ गणपती बाप्पा मोरया,  मंगलमूर्ती मोरया ॥
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                ॥ सुखकर्ता दुःखहर्ता प्रसन्न ॥
              </p>
            </div>
          </div>
        </div>

        {/* Special Spiritual Programs banner */}
        <div className="bg-gradient-to-r from-red-900 to-festival-darkRed text-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-amber-400">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-red-950 flex items-center justify-center font-extrabold text-3xl flex-shrink-0 shadow-md">
                🪔
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">
                  DAY 11 GRAND SPIRITUAL HIGHLIGHT
                </span>
                <h4 className="font-bold text-lg sm:text-xl text-amber-100 font-festive">
                  Shri Satyanarayan Maha Puja &amp; Mahaprasad Feast
                </h4>
                <p className="text-xs sm:text-sm text-amber-100/90 mt-0.5 max-w-2xl">
                  Thursday, 24 September 2026 • Puja: 4:00 PM • Mahaprasad Feast: 8:00 PM onwards. All society resident families are cordially invited with family!
                </p>
              </div>
            </div>

            <a
              href="#schedule"
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-red-950 shadow-md hover:scale-105 transition-all flex-shrink-0"
            >
              Full Program Timeline
            </a>
          </div>
        </div>

      </div>
    </section>
  );
});

AartiSection.displayName = 'AartiSection';
