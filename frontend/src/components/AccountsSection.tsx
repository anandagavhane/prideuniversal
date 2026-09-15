import React from 'react';
import { 
  RefreshCw, 
  Coins, 
  ShieldCheck 
} from 'lucide-react';
import { AccountsData } from '../types';

interface AccountsSectionProps {
  data: AccountsData;
  onRefresh: () => void;
  isRefreshing: boolean;
  syncCountdown?: number;
}

export const AccountsSection: React.FC<AccountsSectionProps> = ({
  data,
  onRefresh,
  isRefreshing,
  syncCountdown
}) => {
  return (
    <section 
      id="accounts" 
      className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FEF7DA] via-[#feeeaa]/40 to-[#FEF7DA] scroll-mt-28 border-b border-amber-200"
    >
      {/* Light Ambient Festive Ganapati Background Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: "url('/photos/ganu1.jpg')" }}
      ></div>

      {/* Decorative Traditional Glow Accents */}
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-amber-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs uppercase tracking-widest mb-2">
              <Coins className="w-3.5 h-3.5 text-emerald-700" />
              <span>OFFICIAL SOCIETY ACCOUNTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-red-950 font-festive tracking-tight">
              Ganeshotsav 2026 — Financial Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Transparent society accounts, verified contributions, wing distribution, and expenditure tracking.
            </p>
          </div>

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
          </div>
        </div>

        {/* 4 Primary Financial Metric Cards matching Canva Sheet */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Collections */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Total Collections
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Received
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800 font-festive mt-2">
              {data.totalCollectionsFormatted}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Contributed by resident families
            </span>
          </div>

          {/* Card 2: Total Expenses */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-800 uppercase tracking-wider">
                Total Expenses
              </span>
              <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                Disbursed
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-red-800 font-festive mt-2">
              {data.totalExpensesFormatted}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Vendor advance & puja supplies
            </span>
          </div>

          {/* Card 3: Net Balance */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                Net Balance
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                Available
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-900 font-festive mt-2">
              {data.netBalanceFormatted}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Current festival treasury fund
            </span>
          </div>

          {/* Card 4: Contributors */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Contributors
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                Families
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-festive mt-2">
              {data.contributorsCount}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Voluntary society donors
            </span>
          </div>
        </div>

        {/* 🏛️ Wing-Wise Collections Breakdown Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Table (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-amber-300 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-festive flex items-center gap-1.5">
                  <span>🏛️</span>
                  <span>Wing-Wise Collections</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Verified Resident Contributions & Wing Distribution
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-amber-100/60 text-amber-950 font-bold uppercase tracking-wider text-[11px] border-b border-amber-200">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Wing</th>
                    <th className="py-3 px-4">Collected</th>
                    <th className="py-3 px-4">% Share</th>
                    <th className="py-3 px-4 sm:pr-6 text-right">Donors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 font-medium text-slate-800">
                  {(data?.wingWise || []).map((w, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                        {w.wing}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        {w.collectedFormatted}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <div className="flex items-center gap-2">
                          <span>{w.share}</span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 hidden sm:block overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: w.share }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:pr-6 text-right font-bold text-amber-900">
                        {w.donors > 0 ? `${w.donors} ${w.donors === 1 ? 'Family' : 'Families'}` : '—'}
                      </td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 font-black text-slate-900 border-t-2 border-amber-300">
                    <td className="py-4 px-4 sm:px-6 font-extrabold text-red-950 uppercase">
                      Total
                    </td>
                    <td className="py-4 px-4 font-extrabold text-emerald-900 text-base">
                      {data.totalCollectionsFormatted}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-900">
                      100.0%
                    </td>
                    <td className="py-4 px-4 sm:pr-6 text-right font-extrabold text-red-950 text-base">
                      {data.contributorsCount} Families
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Voluntary Contribution CTA Card */}
          <div className="bg-gradient-to-br from-red-900 to-festival-darkRed text-white rounded-2xl p-6 shadow-md border-2 border-amber-400 flex flex-col justify-between overflow-hidden relative">
            <div>
              {/* Auspicious Ganesha Visual Frame */}
              <div className="mb-4 rounded-xl overflow-hidden border border-amber-400/50 relative aspect-[16/9] shadow-inner bg-amber-950">
                <img 
                  src="/photos/ganu1.jpg" 
                  alt="Lord Ganesha - Shubh Labh & Prosperity" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-amber-200 font-bold">
                  <span>॥ शुभ लाभ ॥</span>
                  <span>पवित्र गणेश सेवा निधी</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-base text-amber-200">
                  Society Contribution Notice
                </h4>
              </div>

              <p className="text-xs text-amber-100/90 leading-relaxed mb-4">
                Festival contributions are voluntary. All collections and disbursements are audited and updated publicly for complete transparency.
              </p>

              <div className="bg-black/30 rounded-xl p-3 border border-amber-400/20 text-xs mb-4 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-amber-200">Mode:</span>
                  <span className="font-bold">UPI / Cash / Bank Transfer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-200">Coordinators:</span>
                  <span className="font-bold">Vivek Nikam & Vikas Dalavi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-200">Receipts:</span>
                  <span className="font-bold text-emerald-300">Society voucher issued</span>
                </div>
              </div>
            </div>

            <a
              href="#committee"
              className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-300 text-red-950 shadow hover:brightness-105 transition-all"
            >
              Contact Treasurer / Committee
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
