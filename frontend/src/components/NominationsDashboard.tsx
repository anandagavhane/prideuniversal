import React, { useState, useMemo } from 'react';
import { Trophy, RefreshCw, ExternalLink, BarChart3, PieChart as PieChartIcon, Sparkles, Users, Search, X, Filter, FileSpreadsheet } from 'lucide-react';
import { NominationsDashboardData, NominationCategoryStat, SelectedEmcee, CompetitionParticipant } from '../types';
import { exportToExcel, normalizeCategory, isExcludedCategory } from '../services/nominationService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { GOOGLE_NOMINATION_FORM_URL } from '../services/googleSheetsService';

interface NominationsDashboardProps {
  data: NominationsDashboardData;
  onRefresh: () => void;
  isRefreshing: boolean;
  syncCountdown?: number;
  selectedEmcees?: SelectedEmcee[];
  emceesLastUpdated?: string;
  participants?: CompetitionParticipant[];
  onOpenNominationModal?: (category?: string) => void;
}

export const NominationsDashboard: React.FC<NominationsDashboardProps> = ({
  data,
  onRefresh,
  isRefreshing,
  syncCountdown,
  selectedEmcees,
  emceesLastUpdated,
  participants = [],
  onOpenNominationModal
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'participants'>('summary');
  const [rosterCategory, setRosterCategory] = useState<string>('All');
  const [rosterWing, setRosterWing] = useState<'All' | 'A' | 'B'>('All');
  const [rosterSearch, setRosterSearch] = useState<string>('');
  // Chart colors
  const WING_COLORS = ['#d97706', '#dc2626']; // Amber & Red

  // Derive real-time statistics from participants roster so calculations match the Excel export exactly
  const computedStats = useMemo<NominationsDashboardData>(() => {
    if (!participants || participants.length === 0) return data;
    const validParticipants = participants.filter(p => !isExcludedCategory(p.eventCategory));
    const total = validParticipants.length;
    const wingA = validParticipants.filter(p => (p.wing || '').trim().toUpperCase() === 'A').length;
    const wingB = validParticipants.filter(p => (p.wing || '').trim().toUpperCase() === 'B').length;
    const wingAPercent = total > 0 ? `${((wingA / total) * 100).toFixed(1)}%` : '0%';
    const wingBPercent = total > 0 ? `${((wingB / total) * 100).toFixed(1)}%` : '0%';

    const iconMap: Record<string, string> = {
      'Dance': '💃',
      'Drawing': '🎨',
      'Singing': '🎤',
      'Shloka': '📖',
      'Piano Play': '🎹',
      'Emcee / Host': '⭐',
      'Emcee Nomination': '⭐',
      'Drama': '🎭',
      'Fashion Show': '✨',
      'Cooking': '🍲',
      'Rangoli': '🌸'
    };
    (data?.categories || []).forEach(c => {
      if (isExcludedCategory(c.category)) return;
      const norm = normalizeCategory(c.category);
      if (c.icon) iconMap[norm] = c.icon;
    });

    const catMap = new Map<string, { total: number; wingA: number; wingB: number }>();
    for (const p of validParticipants) {
      if (isExcludedCategory(p.eventCategory)) continue;
      const cat = normalizeCategory(p.eventCategory);
      const ex = catMap.get(cat) || { total: 0, wingA: 0, wingB: 0 };
      ex.total += 1;
      const w = (p.wing || '').trim().toUpperCase();
      if (w === 'A') ex.wingA += 1;
      else if (w === 'B') ex.wingB += 1;
      catMap.set(cat, ex);
    }

    const categories: NominationCategoryStat[] = Array.from(catMap.entries()).map(([cat, counts]) => ({
      category: cat,
      nominations: counts.total,
      wingA: counts.wingA,
      wingB: counts.wingB,
      percentOfTotal: total > 0 ? `${((counts.total / total) * 100).toFixed(1)}%` : '0%',
      icon: iconMap[cat] || '🏆'
    })).sort((a, b) => b.nominations - a.nominations);

    return {
      totalNominations: total,
      totalCategories: categories.length,
      wingATotal: wingA,
      wingBTotal: wingB,
      wingAPercent,
      wingBPercent,
      categories,
      lastUpdated: data?.lastUpdated || 'Live Sync',
      isLive: data?.isLive ?? true
    };
  }, [participants, data]);

  const stats = computedStats;

  const wingData = [
    { name: 'Wing A', value: stats?.wingATotal ?? 0, percent: stats?.wingAPercent || '0%' },
    { name: 'Wing B', value: stats?.wingBTotal ?? 0, percent: stats?.wingBPercent || '0%' }
  ];

  // Filter out any total summary row, numeric row, or excluded category
  const displayCategories = (stats?.categories || []).filter(
    c => !/^\d+$/.test(c.category.trim()) && c.category.toLowerCase() !== 'total' && !isExcludedCategory(c.category)
  );

  const categoryBarData = displayCategories.map(c => ({
    name: c.category,
    'Wing A': c.wingA,
    'Wing B': c.wingB,
    'Total': c.nominations
  }));

  // Distinct categories for roster filter
  const rosterCategoryTabs = useMemo(() => {
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

  const filteredRoster = useMemo(() => {
    if (!participants || participants.length === 0) return [];
    return participants.filter(p => {
      if (isExcludedCategory(p.eventCategory)) return false;
      if (rosterCategory !== 'All') {
        const sel = normalizeCategory(rosterCategory).toLowerCase();
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
      if (rosterWing !== 'All') {
        if (p.wing !== rosterWing) return false;
      }
      if (rosterSearch.trim()) {
        const q = rosterSearch.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchFlat = p.flatNumber.toLowerCase().includes(q);
        const matchWing = p.wing.toLowerCase().includes(q);
        const matchCat = normalizeCategory(p.eventCategory).toLowerCase().includes(q) || p.eventCategory.toLowerCase().includes(q);
        if (!matchName && !matchFlat && !matchWing && !matchCat) return false;
      }
      return true;
    });
  }, [participants, rosterCategory, rosterWing, rosterSearch]);

  return (
    <section 
      id="nominations" 
      className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/40 to-[#FEF7DA] scroll-mt-28 border-b border-amber-200"
    >
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/ganpati_home_page.jpg')" }}
      ></div>

      {/* Decorative Traditional Glow Accents */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-orange-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-amber-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs uppercase tracking-widest mb-2">
              <Trophy className="w-3.5 h-3.5 text-festival-saffron" />
              <span>OFFICIAL EVENT NOMINATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-red-950 font-festive tracking-tight">
              Event Nominations Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Live registrations across all cultural, arts, and talent competitions for Ganesh Festival 2026.
            </p>
          </div>

          {/* Sync status & Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium shadow-xs">
              <span className={`w-2 h-2 rounded-full ${stats.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{stats.isLive ? 'Live Updates' : 'Updated'}</span>
              {syncCountdown !== undefined && (
                <span className="text-emerald-700 font-semibold bg-emerald-100/80 px-1.5 py-0.5 rounded text-[11px]">
                  Next sync in {syncCountdown}s
                </span>
              )}
            </span>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-transform active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>

            <button
              onClick={() => onOpenNominationModal ? onOpenNominationModal() : window.open(GOOGLE_NOMINATION_FORM_URL, '_blank')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-700 to-festival-saffron text-white shadow hover:brightness-105 transition-all cursor-pointer"
            >
              <span>+ New Nomination</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>

            <button
              onClick={() => exportToExcel(participants, [], 'PrideUniversal_All_Nominations_2026')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-400/50 shadow-xs transition-all cursor-pointer"
              title="Download entire nominations list in Excel format (.xls)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Nominations */}
          <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm">
            <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider">
              Total Nominations
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-red-900 font-festive mt-1">
              {stats.totalNominations}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Across all categories
            </span>
          </div>

          {/* Card 2: Event Categories */}
          <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm">
            <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider">
              Active Categories
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-festive mt-1">
              {displayCategories.length || stats.totalCategories}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Dance, Drawing, Drama, etc.
            </span>
          </div>

          {/* Card 3: Wing A Share */}
          <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm">
            <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider">
              Wing A Nominations
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-700 font-festive mt-1">
              {stats.wingATotal}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.2 rounded">
                {stats.wingAPercent}
              </span>
              <span className="text-[11px] text-slate-500">share</span>
            </div>
          </div>

          {/* Card 4: Wing B Share */}
          <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm">
            <span className="block text-xs font-bold text-amber-800 uppercase tracking-wider">
              Wing B Nominations
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-red-700 font-festive mt-1">
              {stats.wingBTotal}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-red-800 bg-red-100 px-2 py-0.2 rounded">
                {stats.wingBPercent}
              </span>
              <span className="text-[11px] text-slate-500">share</span>
            </div>
          </div>
        </div>

        {/* Charts & Visual Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Category Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-festival-saffron" />
                <h3 className="text-base font-bold text-slate-900">
                  Category Nominations Breakdown
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Wing A vs Wing B</span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #fcd146', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Wing A" fill="#d97706" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Wing B" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Wing Distribution Pie Chart */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-5 h-5 text-festival-saffron" />
                <h3 className="text-base font-bold text-slate-900">
                  Wing Participation Share
                </h3>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={wingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {wingData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={WING_COLORS[index % WING_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val, name) => [`${val} entries`, name]}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #fcd146', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-100 flex items-center justify-around text-center text-xs">
              <div>
                <span className="block font-bold text-amber-700">Wing A</span>
                <span className="text-slate-600 font-semibold">{stats.wingATotal} ({stats.wingAPercent})</span>
              </div>
              <div className="h-6 w-px bg-amber-200"></div>
              <div>
                <span className="block font-bold text-red-700">Wing B</span>
                <span className="text-slate-600 font-semibold">{stats.wingBTotal} ({stats.wingBPercent})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Table matching Google Sheet */}
        <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-festive">
                {activeTab === 'summary' ? 'EVENT NOMINATIONS BREAKDOWN' : 'VERIFIED PARTICIPANT DIRECTORY'}
              </h3>
              <span className="text-xs text-slate-500">
                {activeTab === 'summary' 
                  ? 'Verified Resident Registrations by Event' 
                  : `Full List of Registered Society Members (${participants.length} Total Entries)`}
              </span>
            </div>

            {/* View Switcher Tabs & Export Action */}
            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              <div className="inline-flex rounded-xl bg-amber-200/70 p-1 border border-amber-300/80">
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'summary'
                      ? 'bg-red-800 text-white shadow-xs'
                      : 'text-amber-950 hover:bg-amber-100/80'
                  }`}
                >
                  📊 Category Stats
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('participants')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'participants'
                      ? 'bg-red-800 text-white shadow-xs'
                      : 'text-amber-950 hover:bg-amber-100/80'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>👥 Participant List ({participants.length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => exportToExcel(participants, [], 'PrideUniversal_Nominations_2026')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-all cursor-pointer shadow-2xs"
                title="Download nominations list in Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Excel (.xls)</span>
              </button>
            </div>
          </div>

          {activeTab === 'summary' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-amber-100/60 text-amber-950 font-bold uppercase tracking-wider text-[11px] border-b border-amber-200">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Event Category</th>
                    <th className="py-3 px-4 text-center">Nominations</th>
                    <th className="py-3 px-4 text-center">Wing A</th>
                    <th className="py-3 px-4 text-center">Wing B</th>
                    <th className="py-3 px-4 text-right sm:pr-6">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 font-medium text-slate-800">
                  {displayCategories.map((cat, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold flex items-center gap-2">
                        <span className="text-base">{cat.icon || '🏆'}</span>
                        <span>{cat.category}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-red-900 text-sm">{cat.nominations}</span>
                        {participants.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setRosterCategory(cat.category);
                              setRosterWing('All');
                              setRosterSearch('');
                              setActiveTab('participants');
                            }}
                            className="block text-[10px] text-blue-700 hover:text-blue-900 hover:underline font-bold mt-0.5 mx-auto"
                            title="View registered participant names"
                          >
                            View Names ➔
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center text-amber-700">
                        {cat.wingA}
                      </td>
                      <td className="py-3.5 px-4 text-center text-red-700">
                        {cat.wingB}
                      </td>
                      <td className="py-3.5 px-4 sm:pr-6 text-right font-semibold text-slate-700">
                        <div className="flex items-center justify-end gap-2">
                          <span>{cat.percentOfTotal}</span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 hidden sm:block overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: cat.percentOfTotal }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 font-black text-slate-900 border-t-2 border-amber-300">
                    <td className="py-4 px-4 sm:px-6 font-extrabold text-red-950 uppercase">
                      Total
                    </td>
                    <td className="py-4 px-4 text-center text-red-950 text-base">
                      {stats.totalNominations}
                    </td>
                    <td className="py-4 px-4 text-center text-amber-800 text-base">
                      {stats.wingATotal}
                    </td>
                    <td className="py-4 px-4 text-center text-red-800 text-base">
                      {stats.wingBTotal}
                    </td>
                    <td className="py-4 px-4 sm:pr-6 text-right text-base text-red-950">
                      100.0%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-4">
              {/* Filter controls */}
              <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                <div className="relative">
                  <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by participant name or flat number..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                  />
                  {rosterSearch && (
                    <button
                      onClick={() => setRosterSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {rosterCategoryTabs.map((tab) => {
                    const validList = participants.filter(p => !isExcludedCategory(p.eventCategory));
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
                    const isSelected = rosterCategory.toLowerCase() === tab.toLowerCase();
                    return (
                      <button
                        key={tab}
                        onClick={() => setRosterCategory(tab)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                          isSelected
                            ? 'bg-red-800 text-white shadow-xs'
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

                <div className="flex items-center justify-between gap-2 text-xs flex-wrap pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-amber-700" /> Wing:
                    </span>
                    {(['All', 'A', 'B'] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => setRosterWing(w)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          rosterWing === w
                            ? 'bg-amber-700 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-amber-100 border border-amber-200'
                        }`}
                      >
                        {w === 'All' ? 'All Wings' : `Wing ${w}`}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-amber-950">
                    Showing {filteredRoster.length} of {participants.filter(p => !isExcludedCategory(p.eventCategory)).length} participants
                  </div>
                </div>
              </div>

              {/* Roster entries */}
              {filteredRoster.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <p className="text-3xl mb-1">🔍</p>
                  <p className="font-bold text-slate-700">No participants found</p>
                  <p className="text-xs text-slate-500">Try adjusting your category, wing, or search query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {filteredRoster.map((p, pIdx) => {
                    const catLower = p.eventCategory.toLowerCase();
                    const icon = catLower.includes('dance') ? '💃' :
                                 catLower.includes('drawing') ? '🎨' :
                                 catLower.includes('singing') ? '🎤' :
                                 catLower.includes('shloka') ? '📖' :
                                 catLower.includes('piano') ? '🎹' : '⭐';
                    return (
                      <div 
                        key={`roster_${p.eventCategory}_${p.srNo}_${pIdx}`}
                        className="bg-white rounded-xl p-3 border border-amber-200 hover:border-amber-400 shadow-xs flex items-center justify-between gap-2.5 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] flex items-center justify-center flex-shrink-0 border border-amber-300">
                            {p.srNo}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {p.name}
                            </h4>
                            <span className="text-[10px] font-medium text-amber-800 flex items-center gap-0.5 mt-0.5">
                              <span>{icon}</span> {normalizeCategory(p.eventCategory)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                            p.wing === 'A' 
                              ? 'bg-amber-100 text-amber-900 border-amber-300' 
                              : 'bg-red-100 text-red-900 border-red-200'
                          }`}>
                            {p.wing} • {p.flatNumber}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🌟 Event Coordinators & Incharge Spotlight */}
        <div className="mt-8 bg-gradient-to-r from-amber-100/90 via-orange-50/90 to-amber-50 rounded-2xl p-6 sm:p-7 border-2 border-amber-300 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-amber-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-900 font-bold text-xs uppercase tracking-widest mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-700" />
                <span>EVENT MANAGEMENT &amp; COORDINATION</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-red-950 font-festive">
                स्पर्धा व सांस्कृतिक कार्यक्रम संयोजन प्रमुख (Event Coordinators)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                For competition rules, participant queries, stage schedules, or registration assistance, please reach out to our event leads:
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-200/80 text-amber-950 font-bold text-xs border border-amber-400/60 shadow-xs">
                <Users className="w-4 h-4 text-red-800" />
                <span>Events Team Leads</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priyesh Highlight Card */}
            <div className="bg-white rounded-xl p-5 border-2 border-amber-300 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white flex items-center justify-center font-black text-xl shadow flex-shrink-0 border border-amber-300">
                P
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-lg font-black text-slate-900">
                    Priyesh
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full border border-red-200">
                    Event Lead
                  </span>
                </div>
                <p className="text-xs font-bold text-amber-800 mt-0.5">
                  Cultural Events &amp; Competition Coordinator
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  Leading participant registrations, cultural evening lineup, performances schedule, and artist coordination across Wings A &amp; B.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-red-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Trophy className="w-3 h-3 text-amber-600" />
                  <span>Cultural &amp; Talent Events Incharge</span>
                </div>
              </div>
            </div>

            {/* Prafull & Vijay Highlight Card */}
            <div className="bg-white rounded-xl p-5 border-2 border-amber-300 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-base shadow flex-shrink-0 border border-amber-300">
                P&amp;V
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-lg font-black text-slate-900">
                    Prafull &amp; Vijay
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-900 px-2.5 py-0.5 rounded-full border border-orange-200">
                    Event Lead
                  </span>
                </div>
                <p className="text-xs font-bold text-amber-800 mt-0.5">
                  Competition Operations &amp; Stage Coordinator
                </p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  Managing competition logistics, judging criteria, fun races, audio-visual stage setup, and prize distribution arrangements.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-red-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Trophy className="w-3 h-3 text-amber-600" />
                  <span>Competitions &amp; Operations Incharge</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
