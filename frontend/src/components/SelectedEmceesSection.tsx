import React from 'react';
import { Mic, Sparkles, CheckCircle2, Trophy, RefreshCw, ExternalLink, Users, Star } from 'lucide-react';
import { SelectedEmcee } from '../types';
import { SELECTED_EMCEES_CSV_URL } from '../services/googleSheetsService';

interface SelectedEmceesSectionProps {
  emcees: SelectedEmcee[];
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
}

export const SelectedEmceesSection: React.FC<SelectedEmceesSectionProps> = ({
  emcees,
  isLoading = false,
  onRefresh,
  lastUpdated
}) => {
  // Only display candidates where status is strictly 'Selected'
  const selectedList = emcees.filter(e => e.status.toLowerCase() === 'selected');

  const wingACount = selectedList.filter(e => e.wing === 'A').length;
  const wingBCount = selectedList.filter(e => e.wing === 'B').length;

  return (
    <div id="selected-emcees" className="mt-10 scroll-mt-24">
      <div className="bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FDE68A]/30 rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-lg relative overflow-hidden">
        {/* Ambient Festival Glow Texture */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-red-400/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-300/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-800 to-amber-700 text-white font-bold text-xs uppercase tracking-widest mb-2 shadow-sm">
              <Mic className="w-3.5 h-3.5 text-amber-200" />
              <span>OFFICIAL SELECTION RESULT</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-red-950 font-festive tracking-tight">
              🎙️ निवडक सूत्रसंचालक (Selected Emcees)
            </h3>
            <p className="text-xs sm:text-sm text-amber-900 font-medium mt-1">
              Heartiest congratulations to the selected official festival hosts and stage anchors for Ganesh Mahotsav 2026!
            </p>
          </div>

          {/* Sync status & Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/90 border border-amber-300 px-3 py-1.5 rounded-full text-slate-800 font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-emerald-800">Live Sheet Synced</span>
              {lastUpdated && (
                <span className="text-slate-500 hidden sm:inline">• {lastUpdated}</span>
              )}
            </span>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Sync from Google Sheet"
                className="p-2 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-950 border border-amber-400 transition-transform active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}

            <a
              href={SELECTED_EMCEES_CSV_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Google Sheet Source"
              className="p-2 rounded-full bg-white/90 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Representation Metrics Strip */}
        <div className="relative z-10 grid grid-cols-3 gap-3 my-6 text-center">
          <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-amber-300 shadow-xs">
            <div className="text-xs font-bold uppercase text-slate-600">Total Selected</div>
            <div className="text-2xl font-black text-red-950 mt-0.5">{selectedList.length}</div>
            <div className="text-[10px] text-amber-800 font-medium">Stage Anchors</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-amber-300 shadow-xs">
            <div className="text-xs font-bold uppercase text-slate-600">Wing A</div>
            <div className="text-2xl font-black text-amber-700 mt-0.5">{wingACount}</div>
            <div className="text-[10px] text-slate-500 font-medium">Participants</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-amber-300 shadow-xs">
            <div className="text-xs font-bold uppercase text-slate-600">Wing B</div>
            <div className="text-2xl font-black text-red-700 mt-0.5">{wingBCount}</div>
            <div className="text-[10px] text-slate-500 font-medium">Participants</div>
          </div>
        </div>

        {/* Selected Emcees Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedList.map((emcee, idx) => {
            const isWingA = emcee.wing === 'A';
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-3.5 festive-card-hover relative group"
              >
                {/* Host Avatar Badge with Number & Mic */}
                <div
                  className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-lg text-white shadow-md border-2 ${
                    isWingA
                      ? 'bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 border-amber-300'
                      : 'bg-gradient-to-br from-red-700 via-rose-700 to-amber-700 border-rose-300'
                  }`}
                >
                  <div className="text-center leading-none">
                    <span className="text-xs block opacity-80">#{emcee.srNo}</span>
                    <Mic className="w-4 h-4 mx-auto mt-0.5" />
                  </div>
                </div>

                {/* Host Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <h4 className="font-extrabold text-base text-slate-900 truncate">
                      {emcee.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Selected</span>
                    </span>
                  </div>

                  {/* Residence Flat Tag */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center text-xs font-black px-2.5 py-0.5 rounded-md border ${
                        isWingA
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : 'bg-red-50 text-red-900 border-red-200'
                      }`}
                    >
                      Wing {emcee.wing} • Flat {emcee.flatNumber}
                    </span>
                  </div>

                  {/* Role Title */}
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-amber-900">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                    <span>Official Festival Stage Anchor</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Congratulatory Footer Note */}
        <div className="relative z-10 mt-6 pt-4 border-t border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-950 font-medium">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-festival-saffron flex-shrink-0" />
            <span>
              All selected anchors will host cultural evenings, sports commentary, and games competitions!
            </span>
          </div>
          <div className="text-[11px] text-slate-600">
            Source: Cultural Selection Panel
          </div>
        </div>
      </div>
    </div>
  );
};

