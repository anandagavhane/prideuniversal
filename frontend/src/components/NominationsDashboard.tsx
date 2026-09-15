import React from 'react';
import { Trophy, RefreshCw, ExternalLink, BarChart3, PieChart as PieChartIcon, Sparkles, Users } from 'lucide-react';
import { NominationsDashboardData, SelectedEmcee } from '../types';
import { SelectedEmceesSection } from './SelectedEmceesSection';
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
}

export const NominationsDashboard: React.FC<NominationsDashboardProps> = ({
  data,
  onRefresh,
  isRefreshing,
  syncCountdown,
  selectedEmcees,
  emceesLastUpdated
}) => {
  // Chart colors
  const WING_COLORS = ['#d97706', '#dc2626']; // Amber & Red

  const wingData = [
    { name: 'Wing A', value: data?.wingATotal ?? 0, percent: data?.wingAPercent || '0%' },
    { name: 'Wing B', value: data?.wingBTotal ?? 0, percent: data?.wingBPercent || '0%' }
  ];

  // Filter out any total summary row or numeric row from event categories
  const displayCategories = (data?.categories || []).filter(
    c => !/^\d+$/.test(c.category.trim()) && c.category.toLowerCase() !== 'total'
  );

  const categoryBarData = displayCategories.map(c => ({
    name: c.category,
    'Wing A': c.wingA,
    'Wing B': c.wingB,
    'Total': c.nominations
  }));

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
              <span className={`w-2 h-2 rounded-full ${data.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{data.isLive ? 'Live Updates' : 'Updated'}</span>
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

            <a
              href={GOOGLE_NOMINATION_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-700 to-festival-saffron text-white shadow hover:brightness-105 transition-all"
            >
              <span>+ New Nomination</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
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
              {data.totalNominations}
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
              {displayCategories.length || data.totalCategories}
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
              {data.wingATotal}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.2 rounded">
                {data.wingAPercent}
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
              {data.wingBTotal}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-red-800 bg-red-100 px-2 py-0.2 rounded">
                {data.wingBPercent}
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
                <span className="text-slate-600 font-semibold">{data.wingATotal} ({data.wingAPercent})</span>
              </div>
              <div className="h-6 w-px bg-amber-200"></div>
              <div>
                <span className="block font-bold text-red-700">Wing B</span>
                <span className="text-slate-600 font-semibold">{data.wingBTotal} ({data.wingBPercent})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Table matching Google Sheet */}
        <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-festive">
                EVENT NOMINATIONS BREAKDOWN
              </h3>
              <span className="text-xs text-slate-500">
                Verified Resident Registrations by Event
              </span>
            </div>
          </div>

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
                    <td className="py-3.5 px-4 text-center font-extrabold text-red-900">
                      {cat.nominations}
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
                    {data.totalNominations}
                  </td>
                  <td className="py-4 px-4 text-center text-amber-800 text-base">
                    {data.wingATotal}
                  </td>
                  <td className="py-4 px-4 text-center text-red-800 text-base">
                    {data.wingBTotal}
                  </td>
                  <td className="py-4 px-4 sm:pr-6 text-right text-base text-red-950">
                    100.0%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 🎙️ Official Selected Emcees Showcase (Live from Google Sheet) */}
        {selectedEmcees && selectedEmcees.length > 0 && (
          <SelectedEmceesSection 
            emcees={selectedEmcees}
            isLoading={isRefreshing}
            onRefresh={onRefresh}
            lastUpdated={emceesLastUpdated}
          />
        )}

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
