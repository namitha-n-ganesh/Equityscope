import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { api } from '../services/api';
import { Loader2 } from 'lucide-react';

export const MiniChart = ({ symbol, currentPrice = 0, initialPeriod = '1Y', height = 240, showControls = true }) => {
  const [period, setPeriod] = useState(initialPeriod);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');

  const periods = ['1W', '1M', '6M', '1Y', '3Y', '5Y'];

  useEffect(() => {
    let isMounted = true;
    async function fetchChart() {
      if (!symbol) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.getStockHistory(symbol, period);
        if (isMounted) {
          setData(res.data || []);
          setSource(res.data_source || 'Verified Snapshot');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load historical data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchChart();
    return () => { isMounted = false; };
  }, [symbol, period]);

  const firstPrice = data.length > 0 ? data[0].price : currentPrice;
  const lastPrice = data.length > 0 ? data[data.length - 1].price : currentPrice;
  const isPositive = lastPrice >= firstPrice;
  const returnPct = firstPrice > 0 ? (((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2) : 0;

  const minPrice = data.length > 0 ? Math.min(...data.map(d => d.price)) * 0.98 : 0;
  const maxPrice = data.length > 0 ? Math.max(...data.map(d => d.price)) * 1.02 : 100;

  const strokeColor = isPositive ? '#10B981' : '#F43F5E';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';

  return (
    <div className="w-full flex flex-col">
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold font-mono ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isPositive ? '+' : ''}{returnPct}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({period})</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  period === p
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ width: '100%', height: height }} className="relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-gray-900/40 backdrop-blur-xs rounded-lg">
            <Loader2 className="animate-spin text-emerald-500" size={24} />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-rose-500 p-4 text-center">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
            No chart data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id={`grad-${symbol}-${isPositive ? 'pos' : 'neg'}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#888888' }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                tick={{ fontSize: 10, fill: '#888888' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0)}`}
                orientation="right"
                width={45}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-gray-900/95 dark:bg-gray-950/95 text-white p-2.5 rounded-lg shadow-xl border border-gray-700 text-xs">
                        <div className="text-gray-400 text-[10px] mb-0.5">{d.date}</div>
                        <div className="font-bold font-mono text-emerald-400 text-sm">
                          ₹{d.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        {d.volume > 0 && (
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            Vol: {d.volume.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#grad-${symbol}-${isPositive ? 'pos' : 'neg'})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {source && (
        <div className="mt-1 text-[10px] text-right text-gray-400 dark:text-gray-500">
          Source: {source}
        </div>
      )}
    </div>
  );
};
