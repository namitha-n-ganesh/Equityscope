import React from 'react';
import {
  ShieldAlert,
  BookOpen,
  Scale,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          About EquityScope
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Indian Mid-Cap & Small-Cap Stock Intelligence, Research & Analytical Platform
        </p>
      </div>

      {/* Prominent Regulatory Disclaimer */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-blue-500/10 border-2 border-amber-500/30 dark:border-amber-500/20 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Educational & Research Platform – Not Investment Advice
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
              EquityScope is an educational and analytical research technology platform designed to help students, retail investors, and quantitative analysts study Indian equity markets (NSE and BSE).
              <strong className="block mt-1 font-semibold text-gray-900 dark:text-white">
                EquityScope is NOT registered with the Securities and Exchange Board of India (SEBI) as an Investment Adviser or Research Analyst. None of the data, screens, scores, or charts constitute buy, sell, or hold recommendations.
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* SEBI Categorization Guidelines */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Scale size={20} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            SEBI Market Capitalization Categorization Framework
          </h2>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          In accordance with SEBI circular <em>SEBI/HO/IMD/DF3/CIR/P/2017/114</em> dated October 6, 2017, the Indian stock universe listed on registered exchanges is categorized into three distinct buckets prepared half-yearly by the Association of Mutual Funds in India (AMFI):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">1. Large-Cap</span>
            <div className="text-base font-extrabold text-gray-900 dark:text-white mt-1">1st to 100th</div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              Top 100 companies by full market capitalization. Blue-chip giants with institutional liquidity and defensive stability (approx &gt;₹65,000 Cr).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">2. Mid-Cap</span>
            <div className="text-base font-extrabold text-gray-900 dark:text-white mt-1">101st to 250th</div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              101st to 250th companies by market cap. High compounders scaling market leadership in niche sectors (approx ₹20,000 Cr to ₹65,000 Cr).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">3. Small-Cap</span>
            <div className="text-base font-extrabold text-gray-900 dark:text-white mt-1">251st and Beyond</div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              From 251st company onwards by market cap. Agile emerging companies with high long-term alpha potential but higher beta and volatility.
            </p>
          </div>
        </div>
      </div>

      {/* Analytical Methodology */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Cpu size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            EquityScope Analytics Methodology
          </h2>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          EquityScope integrates quantitative data processing using <strong>Pandas</strong> and <strong>NumPy</strong> to deliver robust risk and performance insights:
        </p>

        <div className="space-y-3 pt-1 text-xs text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 dark:text-white">Composite Risk Score (1 to 10):</strong>
              <span className="text-gray-600 dark:text-gray-400 ml-1">
                Calculated using market Beta (sensitivity to Nifty 50), Debt-to-Equity leverage component, 30-day realized volatility, and a small-cap liquidity penalty. Scores below 4.2 are Low, 4.2–6.2 are Moderate, 6.2–8.0 are High, and &gt;8.0 are Very High.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 dark:text-white">Small-Cap Liquidity Score (1 to 10):</strong>
              <span className="text-gray-600 dark:text-gray-400 ml-1">
                Evaluates trading volume depth, free float, and delivery percentages to alert researchers regarding potential exit slippage in volatile sessions.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900 dark:text-white">5-Factor Comparative Radar:</strong>
              <span className="text-gray-600 dark:text-gray-400 ml-1">
                Normalizes multi-dimensional metrics (Profitability, Growth, Solvency/Safety, 1-Year Momentum, and Valuation Multiple) on a 0–100 scale for intuitive cross-company benchmarking.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source & Architecture Transparency */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Database size={20} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Data Architecture & Sources
          </h2>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          EquityScope follows a strict data transparency policy:
        </p>

        <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300 space-y-1.5 pl-1">
          <li><strong>Real-Time Provider:</strong> Yahoo Finance API with NSE (.NS) and BSE (.BO) symbols.</li>
          <li><strong>Offline Verified Snapshot:</strong> When external APIs are rate-limited or offline, EquityScope utilizes a pre-verified verified snapshot clearly stamped as <em>"NSE/BSE Market Data (Verified Offline Snapshot)"</em> with the exact last update timestamp.</li>
          <li><strong>Persistent Watchlist:</strong> User watchlists and notes are stored persistently in an embedded <strong>SQLite database</strong> using SQLAlchemy ORM.</li>
        </ul>
      </div>
    </div>
  );
};
