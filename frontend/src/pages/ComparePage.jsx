import React, { useState, useEffect } from 'react';
import {
  Scale,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Radar as RadarIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { api } from '../services/api';

export const ComparePage = ({
  initialSymbols = ['TATAPOWER', 'POLYCAB'],
  onSelectStock
}) => {
  const [selectedSymbols, setSelectedSymbols] = useState(initialSymbols);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedToAdd, setSelectedToAdd] = useState('');

  // Sync selectedSymbols when initialSymbols prop updates
  useEffect(() => {
    if (initialSymbols && initialSymbols.length >= 2) {
      setSelectedSymbols(initialSymbols);
    }
  }, [initialSymbols]);

  // Load available stocks for the dropdown
  useEffect(() => {
    async function loadUniverse() {
      try {
        const stocks = await api.getStocks();
        setAvailableStocks(stocks);
      } catch (e) {
        console.error(e);
      }
    }
    loadUniverse();
  }, []);

  // Fetch comparison analysis
  useEffect(() => {
    if (selectedSymbols.length < 2) {
      setComparisonData(null);
      setLoading(false);
      return;
    }

    async function runComparison() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.compareStocks(selectedSymbols);
        setComparisonData(res);
      } catch (err) {
        setError(err.message || 'Comparison failed');
      } finally {
        setLoading(false);
      }
    }
    runComparison();
  }, [selectedSymbols]);

  const handleAddStock = (sym) => {
    if (!sym || selectedSymbols.includes(sym)) return;
    if (selectedSymbols.length >= 5) {
      alert('You can compare up to 5 stocks at the same time.');
      return;
    }
    setSelectedSymbols([...selectedSymbols, sym]);
    setSelectedToAdd('');
  };

  const handleRemoveStock = (sym) => {
    if (selectedSymbols.length <= 2) {
      alert('At least 2 stocks are required for comparison.');
      return;
    }
    setSelectedSymbols(selectedSymbols.filter(s => s !== sym));
  };

  const STOCK_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Stock Comparison Engine
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Side-by-side financial, valuation, solvency, and historical performance benchmark.
          </p>
        </div>

        {/* Add Stock Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedToAdd}
            onChange={(e) => handleAddStock(e.target.value)}
            disabled={selectedSymbols.length >= 5}
            className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">+ Add Stock to Compare...</option>
            {availableStocks
              .filter(s => !selectedSymbols.includes(s.symbol))
              .map(s => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} – {s.company_name} ({s.category})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Selected Stock Pills */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
        <span className="text-xs font-semibold text-gray-400 mr-2">Selected Securities ({selectedSymbols.length}/5):</span>
        {selectedSymbols.map((sym, idx) => (
          <div
            key={sym}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold font-mono shadow-2xs"
            style={{
              borderColor: `${STOCK_COLORS[idx % STOCK_COLORS.length]}55`,
              backgroundColor: `${STOCK_COLORS[idx % STOCK_COLORS.length]}15`,
              color: STOCK_COLORS[idx % STOCK_COLORS.length]
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STOCK_COLORS[idx % STOCK_COLORS.length] }} />
            <span>{sym}</span>
            <button
              onClick={() => handleRemoveStock(sym)}
              className="ml-1 p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
              title="Remove stock"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Computing comparative analytics...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-500 text-xs">
          {error}
        </div>
      ) : comparisonData ? (
        <>
          {/* Side-by-Side Metric Comparison Table */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Quantitative Metric Matrix</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Direct head-to-head comparison across fundamental and technical metrics</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950/20 font-semibold uppercase tracking-wider text-[11px] text-gray-500">
                    <th className="py-3 px-4">Financial Metric</th>
                    {comparisonData.stocks.map((s, idx) => (
                      <th key={s.symbol} className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STOCK_COLORS[idx % STOCK_COLORS.length] }} />
                          <span className="font-bold font-mono text-gray-900 dark:text-white cursor-pointer hover:underline" onClick={() => onSelectStock(s.symbol)}>
                            {s.symbol}
                          </span>
                        </div>
                        <div className="text-[10px] font-normal text-gray-400 lowercase">{s.category}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-mono">
                  {Object.entries(comparisonData.metrics_comparison).map(([key, row]) => (
                    <tr key={key} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                      <td className="py-3 px-4 font-sans font-medium text-gray-700 dark:text-gray-300">
                        {row.label}
                      </td>
                      {comparisonData.stocks.map((s) => {
                        const val = row[s.symbol];
                        let formattedVal = val;
                        if (row.format === 'currency') formattedVal = `₹${Number(val).toLocaleString('en-IN')}`;
                        if (row.format === 'percent') formattedVal = `${val}%`;
                        if (row.format === 'ratio') formattedVal = `${val}`;

                        return (
                          <td key={s.symbol} className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                            {formattedVal ?? '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Charts: Performance Comparison & Spider / Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-Period Historical Return Bar Chart */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-emerald-500" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Historical Returns (%)</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Trailing return comparison across 1W, 1M, 6M, 1Y, and 3Y</p>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData.performance_chart} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#888' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(val, name) => [`${val}%`, name]}
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                    />
                    <Legend />
                    {comparisonData.stocks.map((s, idx) => (
                      <Bar
                        key={s.symbol}
                        dataKey={s.symbol}
                        fill={STOCK_COLORS[idx % STOCK_COLORS.length]}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar / Spider Chart of 5 Core Factor Dimensions */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-4">
                <RadarIcon size={18} className="text-purple-500" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Factor Radar Profile</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Normalized 0–100 factor score across Profitability, Growth, Safety & Momentum</p>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={comparisonData.radar_data}>
                    <PolarGrid stroke="#374151" strokeOpacity={0.3} />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#888' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    {comparisonData.stocks.map((s, idx) => (
                      <Radar
                        key={s.symbol}
                        name={s.symbol}
                        dataKey={s.symbol}
                        stroke={STOCK_COLORS[idx % STOCK_COLORS.length]}
                        fill={STOCK_COLORS[idx % STOCK_COLORS.length]}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
