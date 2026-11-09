import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
  PieChart as PieIcon,
  BarChart3,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { RiskBadge } from '../components/RiskBadge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { api } from '../services/api';

export const DashboardPage = ({
  onSelectStock,
  onNavigate,
  watchlistSymbols = [],
  onWatchlistToggle
}) => {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const [overviewData, trendsData] = await Promise.all([
        api.getMarketOverview(),
        api.getMarketTrends()
      ]);
      setOverview(overviewData);
      setTrends(trendsData);
    } catch (err) {
      setError(err.message || 'Failed to load market dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Aggregating Indian stock intelligence...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900 rounded-xl max-w-lg mx-auto my-12">
        <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">Error Loading Market Dashboard</h3>
        <p className="text-xs text-gray-500 mt-2">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Sector breakdown chart colors
  const SECTOR_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#6366F1', '#14B8A6', '#F97316'];

  const indices = overview?.indices || {};

  return (
    <div className="space-y-6">
      {/* Educational Disclaimer Banner */}
      <DisclaimerBanner onLearnMore={() => onNavigate('about')} />

      {/* Header with Title & Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Market Dashboard
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            NSE & BSE Mid-Cap and Small-Cap Stock Intelligence Overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-lg shadow-2xs">
            <Clock size={13} className="text-emerald-500" />
            <span className="text-[11px] font-mono">{overview?.last_updated}</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-2xs"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top Benchmark Indices Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(indices).map(([key, item]) => {
          const isPos = item.change >= 0;
          return (
            <div
              key={key}
              className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                <span className="truncate">{item.name}</span>
                {item.trend && (
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                    {item.trend}
                  </span>
                )}
              </div>
              <div className="text-lg font-bold font-mono text-gray-900 dark:text-white">
                {item.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono font-medium mt-1">
                <span className={isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {isPos ? '+' : ''}{item.change.toFixed(2)} ({isPos ? '+' : ''}{item.change_percent.toFixed(2)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Tracked Equities"
          value={overview?.total_tracked_stocks || 36}
          subtitle="Curated Active Securities"
          icon={Layers}
          badgeText="NSE / BSE"
        />
        <MetricCard
          title="Mid-Cap Universe"
          value={overview?.mid_cap_count || 18}
          subtitle="SEBI Rank 101 – 250"
          icon={TrendingUp}
          badgeText="₹20k - ₹130k Cr"
        />
        <MetricCard
          title="Small-Cap Universe"
          value={overview?.small_cap_count || 18}
          subtitle="High Growth & Alpha"
          icon={Zap}
          badgeText="SEBI Rank 251+"
        />
        <MetricCard
          title="Market Breadth (A/D)"
          value={`${trends?.market_breadth?.advances || 0} / ${trends?.market_breadth?.declines || 0}`}
          subtitle={`Ratio: ${trends?.market_breadth?.advance_decline_ratio || 1.0}`}
          icon={Activity}
          changePercent={((trends?.market_breadth?.advances || 1) / ((trends?.market_breadth?.declines || 1) + (trends?.market_breadth?.advances || 1))) * 100 - 50}
        />
      </div>

      {/* Top Gainers & Top Losers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Top-Performing Stocks</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Leading gainers across mid & small caps</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('midcap')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {overview?.top_gainers?.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock.symbol)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900 dark:text-white">{stock.symbol}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      stock.category === 'Mid-Cap' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {stock.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[170px]">
                    {stock.company_name}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-gray-900 dark:text-white">
                    ₹{stock.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-end">
                    <ArrowUpRight size={12} className="mr-0.5" />
                    +{stock.change_percent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <ArrowDownRight size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Worst-Performing Stocks</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Biggest price dips in today's session</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('smallcap')}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {overview?.top_losers?.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock.symbol)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900 dark:text-white">{stock.symbol}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      stock.category === 'Mid-Cap' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {stock.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[170px]">
                    {stock.company_name}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-gray-900 dark:text-white">
                    ₹{stock.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-end">
                    <ArrowDownRight size={12} className="mr-0.5" />
                    {stock.change_percent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Breakdown & Market Cap Distribution Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sector Weights Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Sectoral Capitalization & Valuation</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Weighted market cap and average P/E across major Indian industries</p>
            </div>
            <button
              onClick={() => onNavigate('market-analysis')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Detailed Breakdown</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {overview?.sector_breakdown?.slice(0, 6).map((sec, idx) => (
              <div key={sec.sector} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{sec.sector}</span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-gray-500">₹{sec.total_market_cap.toLocaleString('en-IN')} Cr ({sec.weight_percent}%)</span>
                    <span className="text-gray-400">P/E: {sec.avg_pe}x</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${sec.weight_percent * 2.5}%`,
                      backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Cap Split (Pie / Donut) */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Cap Distribution</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">Mid-Cap vs Small-Cap market share</p>

          <div className="relative h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overview?.market_cap_distribution || []}
                  dataKey="total_market_cap"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                >
                  <Cell fill="#8B5CF6" />
                  <Cell fill="#10B981" />
                </Pie>
                <Tooltip
                  formatter={(val, name, item) => [`₹${val.toLocaleString('en-IN')} Cr (${item.payload.share_percent}%)`, item.payload.category]}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
            {overview?.market_cap_distribution?.map((cap, idx) => (
              <div key={cap.category} className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/40">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                  <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                  <span>{cap.category}</span>
                </div>
                <div className="text-xs font-mono font-bold text-gray-900 dark:text-white mt-0.5">
                  {cap.share_percent}%
                </div>
                <div className="text-[10px] text-gray-400">
                  Avg ROE: {cap.avg_roe}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Viewed Companies */}
      {overview?.recent_views && overview.recent_views.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={16} className="text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recently Viewed Companies</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {overview.recent_views.map((stock) => {
              const pos = stock.change >= 0;
              return (
                <div
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock.symbol)}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold font-mono text-gray-900 dark:text-white">{stock.symbol}</span>
                    <span className={`text-[10px] font-mono font-medium ${pos ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {pos ? '+' : ''}{stock.change_percent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs font-bold font-mono text-gray-800 dark:text-gray-200 mt-1">
                    ₹{stock.current_price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">
                    {stock.company_name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
