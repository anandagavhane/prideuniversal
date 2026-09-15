import React, { useState } from 'react';
import { Trophy, Medal, Sparkles, RefreshCw, ExternalLink, Award, Crown, Star } from 'lucide-react';
import { CompetitionWinner } from '../types';
import { WINNERS_CSV_URL } from '../services/googleSheetsService';

interface WinnersSectionProps {
  winners: CompetitionWinner[];
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
}

export const WinnersSection: React.FC<WinnersSectionProps> = ({
  winners,
  isLoading = false,
  onRefresh,
  lastUpdated
}) => {
  const [selectedGame, setSelectedGame] = useState<string>('All');

  // Game icons mapping
  const gameIcons: Record<string, string> = {
    'Drawing': '🎨',
    'Dance': '💃',
    'Singing': '🎤',
    'Shloka': '📖',
    'Piano Play': '🎹',
    'Drama': '🎭',
    'Games': '🏆'
  };

  // Dynamically extract unique games
  const uniqueGames = Array.from(new Set(winners.map(w => w.gameName).filter(Boolean)));
  const filterTabs = [
    { id: 'All', label: `All Events (${winners.length})`, icon: '🏆' },
    ...uniqueGames.map(g => ({
      id: g,
      label: `${gameIcons[g] || '✨'} ${g}`,
      icon: gameIcons[g] || '✨'
    }))
  ];

  const filteredWinners = selectedGame === 'All'
    ? winners
    : winners.filter(w => w.gameName.toLowerCase() === selectedGame.toLowerCase());

  // Count by wing
  const wingACount = winners.filter(w => w.wing.includes('A')).length;
  const wingBCount = winners.filter(w => w.wing.includes('B')).length;

  const getRankBadge = (rank: string) => {
    const clean = rank.toLowerCase().trim();
    if (clean.includes('1') || clean.includes('first') || clean.includes('1st')) {
      return {
        label: '1st Prize / प्रथम',
        icon: '🥇',
        badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 border-amber-300 shadow-sm',
        cardBorder: 'border-2 border-amber-400',
        cardBg: 'bg-gradient-to-br from-amber-50/90 via-yellow-50/50 to-white'
      };
    }
    if (clean.includes('2') || clean.includes('second') || clean.includes('2nd')) {
      return {
        label: '2nd Prize / द्वितीय',
        icon: '🥈',
        badgeBg: 'bg-gradient-to-r from-slate-300 to-slate-200 text-slate-900 border-slate-300 shadow-sm',
        cardBorder: 'border-2 border-slate-300',
        cardBg: 'bg-gradient-to-br from-slate-50/90 via-slate-100/30 to-white'
      };
    }
    if (clean.includes('3') || clean.includes('third') || clean.includes('3rd')) {
      return {
        label: '3rd Prize / तृतीय',
        icon: '🥉',
        badgeBg: 'bg-gradient-to-r from-orange-400 to-amber-600 text-white border-orange-300 shadow-sm',
        cardBorder: 'border-2 border-orange-300',
        cardBg: 'bg-gradient-to-br from-orange-50/90 via-amber-50/30 to-white'
      };
    }
    return {
      label: rank,
      icon: '🏅',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm',
      cardBorder: 'border border-amber-300',
      cardBg: 'bg-white'
    };
  };

  return (
    <section 
      id="winners" 
      className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#ffeed0]/50 to-[#FEF7DA] scroll-mt-28 border-b border-amber-200"
    >
      {/* Background festive glow */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/ganpati_home_page.jpg')" }}
      ></div>

      <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white font-bold text-xs uppercase tracking-widest mb-3 shadow-md">
            <Trophy className="w-3.5 h-3.5 text-yellow-200 animate-bounce" />
            <span>FESTIVAL CHAMPIONS &amp; WINNERS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-red-950 tracking-tight font-festive mb-2">
            🏆 स्पर्धा विजेते २०२६ (Festival Winners)
          </h2>

          <p className="text-base sm:text-lg text-amber-900 font-bold font-marathi">
            गौरव आपल्या सोसायटीतील कलाकारांचा • अभिनंदन सर्व विजेत्यांचे!
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Heartiest congratulations to all the brilliant participants and winners of Pride Universal Ganesh Festival 2026!
          </p>

          {/* Live Sync Status & Manual Refresh Bar */}
          <div className="mt-4 inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-semibold">Live Results from Google Sheet</span>
            {lastUpdated && (
              <span className="text-[11px] text-emerald-600 hidden sm:inline">
                • {lastUpdated}
              </span>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Sync latest winners from Google Sheet"
                className="ml-1 p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <a
              href={WINNERS_CSV_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Google Sheet Source"
              className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Wing Championship Summary Pill */}
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2 text-center mb-8 bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-amber-300 shadow-sm">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-600">Total Winners</div>
            <div className="text-xl font-black text-red-950 mt-0.5">{winners.length}</div>
            <div className="text-[10px] text-amber-700 font-semibold">Champions</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-600">Wing A</div>
            <div className="text-xl font-black text-amber-700 mt-0.5">{wingACount}</div>
            <div className="text-[10px] text-slate-500 font-medium">Prize Winners</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-600">Wing B</div>
            <div className="text-xl font-black text-red-700 mt-0.5">{wingBCount}</div>
            <div className="text-[10px] text-slate-500 font-medium">Prize Winners</div>
          </div>
        </div>

        {/* Filter Tabs by Game Name */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedGame(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                selectedGame === tab.id
                  ? 'bg-gradient-to-r from-red-800 to-festival-saffron text-white shadow-md scale-105'
                  : 'bg-white/85 text-slate-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWinners.map((winner, idx) => {
            const rankStyle = getRankBadge(winner.rank);
            const isWingA = winner.wing.includes('A');
            const icon = gameIcons[winner.gameName] || '🏆';

            return (
              <div
                key={idx}
                className={`relative rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between festive-card-hover ${rankStyle.cardBg} ${rankStyle.cardBorder}`}
              >
                {/* Top Corner Medal Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs" style={{ background: 'white' }}>
                    <span className="text-base leading-none">{icon}</span>
                    <span className="text-red-950 font-bold">{winner.gameName}</span>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-full border ${rankStyle.badgeBg}`}>
                    <span className="text-sm">{rankStyle.icon}</span>
                    <span>{rankStyle.label}</span>
                  </span>
                </div>

                {/* Winner Name & Event Details */}
                <div className="my-2">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide block mb-0.5">
                    👤 Winner / विजेता
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-red-950 font-festive leading-tight">
                    {winner.winnerName || `Participant #${winner.srNo}`}
                  </h3>

                  {winner.category && (
                    <div className="inline-block mt-1.5 text-xs font-bold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-md border border-amber-200">
                      {winner.category}
                    </div>
                  )}
                </div>

                {/* Residence Info / Wing Tag */}
                <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-between text-xs">
                  <span
                    className={`font-black px-2.5 py-1 rounded-lg border ${
                      isWingA
                        ? 'bg-amber-100/80 text-amber-900 border-amber-300'
                        : 'bg-red-100/80 text-red-900 border-red-300'
                    }`}
                  >
                    {winner.wing} • Flat {winner.flatNumber}
                  </span>

                  <span className="inline-flex items-center gap-1 font-bold text-amber-900 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-festival-saffron" />
                    <span>Winner #{winner.srNo}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Felicitation & Prize Distribution Note */}
        <div className="mt-12 bg-gradient-to-r from-red-800 via-festival-saffron to-red-900 rounded-3xl p-6 sm:p-7 text-white text-center shadow-xl border-2 border-amber-300 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-amber-200 text-xs uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Prize Distribution Ceremony (पारितोषिक वितरण)</span>
              </span>
              <h4 className="text-xl sm:text-2xl font-black font-festive mt-1">
                Trophies &amp; Certificates will be awarded at the Grand Pandal Stage!
              </h4>
              <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl leading-relaxed">
                All winners and participants are cordially invited with family for the grand felicitation on Day 11 during Shri Satyanarayan Puja &amp; Mahaprasad evening.
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 text-red-950 font-black text-sm uppercase tracking-wider shadow-md">
                <Medal className="w-5 h-5 text-red-950" />
                <span>Day 11 • 24 Sep</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

