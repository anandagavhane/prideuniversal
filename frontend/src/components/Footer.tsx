import React from 'react';
import { Heart, Calendar, Trophy, BarChart3, Flame, ArrowUp, ArrowDown, Phone } from 'lucide-react';
import { APP_VERSION, APP_BUILD } from '../version';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/60 to-[#ffda6a]/40 border-t-2 border-amber-300 pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.05] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/ganpati_home_page.jpg')" }}
      ></div>

      {/* Decorative Traditional Glow Accents */}
      <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Society Motto */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-slate-950 flex items-center justify-center p-0.5 flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Pride Universal Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <span className="block text-xs font-bold tracking-widest text-amber-800 uppercase">
                  Co-operative Housing Society
                </span>
                <span className="text-lg font-black text-red-950 font-festive">
                  PRIDE UNIVERSAL GANESHOTSAV 2026
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-md leading-relaxed font-marathi mb-4">
              चला, एकत्र येऊया… भक्ती, आनंद आणि एकोप्याने गणेशोत्सव साजरा करूया! १२ दिवस • भक्ती • संस्कृती • एकोप्याचा उत्सव (१४ सप्टेंबर ते २५ सप्टेंबर २०२६).
            </p>

            <div className="inline-block bg-amber-100/90 text-amber-900 font-extrabold text-xs px-3 py-1.5 rounded-lg border border-amber-300 font-marathi">
              ॥ गणपती बाप्पा मोरया, पुढच्या वर्षी लवकर या ॥
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-900 mb-3 border-b border-amber-200 pb-1.5">
              Festival Portals
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-700">
              <li>
                <button 
                  onClick={() => onNavigate('schedule')} 
                  className="hover:text-red-800 hover:underline flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-festival-saffron" />
                  <span>12-Day Event Schedule</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('competitions')} 
                  className="hover:text-red-800 hover:underline flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5 text-festival-saffron" />
                  <span>Games & Competitions</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('nominations')} 
                  className="hover:text-red-800 hover:underline flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5 text-festival-saffron" />
                  <span>Live Nominations Dashboard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('accounts')} 
                  className="hover:text-red-800 hover:underline flex items-center gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-festival-saffron" />
                  <span>Accounts & Fund Overview</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('aarti')} 
                  className="hover:text-red-800 hover:underline flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5 text-festival-saffron" />
                  <span>Daily Aarti Timings</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Committee Contacts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-900 mb-3 border-b border-amber-200 pb-1.5">
              Organizing Committee
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <p>
                <span className="font-bold block text-slate-900">Vivek Nikam:</span>
                <a href="tel:8888870055" className="text-amber-900 hover:text-red-700 transition-colors font-medium">+91 88888 70055</a>
              </p>
              <p>
                <span className="font-bold block text-slate-900">Vikas Dalavi:</span>
                <a href="tel:9970296330" className="text-amber-900 hover:text-red-700 transition-colors font-medium">+91 99702 96330</a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 font-medium text-center sm:text-left">
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-600 fill-red-600 inline" />
              <span>by <strong className="text-red-950 font-bold">Pride Universal Team</strong></span>
            </div>
            <span className="hidden sm:inline text-amber-500 font-bold">•</span>
            <span className="text-slate-700 inline-flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
              <span>Developed by <strong className="text-red-950 font-bold">Ananda Gavhane</strong></span>
              <a
                href="tel:9881369872"
                className="inline-flex items-center gap-1 font-bold text-red-900 bg-amber-200/90 hover:bg-amber-300 px-1.5 py-0.5 rounded text-xs border border-amber-300 transition-colors shadow-2xs"
                title="Call Ananda Gavhane: +91 98813 69872"
              >
                <Phone className="w-3 h-3 text-red-700 inline" />
                <span>98813 69872</span>
              </a>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span>© 2026 Pride Universal Society • All Rights Reserved</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-200/90 border border-amber-300 font-mono text-[11px] text-red-950 font-bold shadow-2xs">
                v{APP_VERSION} (Build {APP_BUILD})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={scrollToTop}
                title="Scroll to Top"
                aria-label="Scroll to Top"
                className="p-2 rounded-full bg-amber-200/80 hover:bg-amber-300 text-red-950 transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToBottom}
                title="Scroll to Bottom"
                aria-label="Scroll to Bottom"
                className="p-2 rounded-full bg-amber-200/80 hover:bg-amber-300 text-red-950 transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

