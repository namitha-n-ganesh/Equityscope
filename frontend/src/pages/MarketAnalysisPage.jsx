import React, { useState, useEffect } from 'react';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Shield,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { api } from '../services/api';

export const MarketAnalysisPage = () => {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [o, t] = await Promise.all([
          api.getMarketOverview(),
          api.getMarketTrends()
        ]);
        setOverview(o);
        setTrends(t);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Generating market intelligence distribution...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-500 text-xs">
        {error}
      </div>
    );
  }

  const SECTOR_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#64748B'];
  const RISK_COLORS = { 'Low': '#10B981', 'Moderate': '#3B82F6', 'High': '#F59E0B', 'Very High': '#EF4444' };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Market Intelligence & Distribution
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Macro sectoral allocation, valuation spreads, risk profile spectrum, and market breadth analytics.
        </p>
      </div>

      {/* Market Breadth & Sentiment Bar */}
      {trends?.market_breadth && (
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Market Breadth Ratio</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Advancing vs Declining mid & small-cap stocks</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ArrowUpRight size={14} /> Advances: {trends.market_breadth.advances}
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                <ArrowDownRight size={14} /> Declines: {trends.market_breadth.declines}
              </span>
              <span className="text-gray-500">
                A/D Ratio: <strong className="text-gray-900 dark:text-white">{trends.market_breadth.advance_decline_ratio}</strong>
              </span>
            </div>
          </div>

          {/* Breadth Bar */}
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${(trends.market_breadth.advances / (trends.market_breadth.advances + trends.market_breadth.declines || 1)) * 100}%` }}
              title={`Advances: ${trends.market_breadth.advances}`}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${(trends.market_breadth.declines / (trends.market_breadth.advances + trends.market_breadth.declines || 1)) * 100}%` }}
              title={`Declines: ${trends.market_breadth.declines}`}
            />
          </div>
        </div>
      )}

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Allocation Bar Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-emerald-500" />
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Sectoral Capitalization (₹ Cr)</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Total market capitalization aggregated by sector</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overview?.sector_breakdown || []}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" tick={{ fontSize: 10, fill: '#888' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k Cr`} />
                <YAxis dataKey="sector" type="category" tick={{ fontSize: 10, fill: '#888' }} width={90} />
                <Tooltip
                  formatter={(val, name, item) => [`₹${val.toLocaleString('en-IN')} Cr (${item.payload.weight_percent}%)`, 'Market Cap']}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="total_market_cap" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Valuation Spread (P/E Buckets) */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon size={18} className="text-blue-500" />
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Valuation Multiple Distribution</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Price-to-Earnings (P/E) distribution categories</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.valuation_buckets || []} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip
                  formatter={(val) => [`${val} Companies`, 'Count']}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Spectrum Distribution */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Risk Spectrum Analysis</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Universe count across Low, Moderate, High, and Very High risk</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trends?.risk_distribution || []}
                  dataKey="count"
                  nameKey="level"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                >
                  {trends?.risk_distribution?.map((entry) => (
                    <Cell key={entry.level} fill={RISK_COLORS[entry.level] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} Stocks`, name]}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cap Distribution & Key Stats */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers size={18} className="text-purple-500" />
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Mid-Cap vs Small-Cap Profile</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Aggregated fundamental comparison</p>
              </div>
            </div>

            <div className="space-y-4">
              {overview?.market_cap_distribution?.map((item) => (
                <div key={item.category} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{item.category}</span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {item.share_percent}% Total Mcap
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                    <div>
                      <div className="text-[10px] text-gray-400">Total Mcap</div>
                      <div className="font-bold text-gray-800 dark:text-gray-200">₹{item.total_market_cap.toLocaleString('en-IN')} Cr</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400">Avg P/E</div>
                      <div className="font-bold text-gray-800 dark:text-gray-200">{item.avg_pe}x</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400">Avg ROE</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{item.avg_roe}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 mt-4">
            <strong>Analytical Takeaway:</strong> Mid-Caps exhibit stable ROE (~18-22%) with moderate valuation multiples (35-50x), whereas Small-Caps provide rapid revenue acceleration with higher dispersion in P/E and volatility.
          </div>
        </div>
      </div>
    </div>
  );
};
