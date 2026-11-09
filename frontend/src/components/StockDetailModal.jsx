import React, { useState, useEffect } from 'react';
import {
  X,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Shield,
  Building2,
  Calendar,
  ExternalLink,
  Plus,
  Scale
} from 'lucide-react';
import { MiniChart } from './MiniChart';
import { RiskBadge } from './RiskBadge';
import { api } from '../services/api';

export const StockDetailModal = ({
  symbol,
  isOpen,
  onClose,
  onAddToCompare = null,
  watchlistSymbols = [],
  onWatchlistToggle = null
}) => {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('chart'); // chart | financials | risk | profile
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !symbol) return;

    let isMounted = true;
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getStockDetail(symbol);
        if (isMounted) {
          setStock(data);
          setInWatchlist(watchlistSymbols.includes(data.symbol));
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load stock details');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDetail();
    return () => { isMounted = false; };
  }, [isOpen, symbol, watchlistSymbols]);

  if (!isOpen) return null;

  const handleToggleWatchlist = async () => {
    if (!stock) return;
    setWatchlistLoading(true);
    try {
      const willAdd = !inWatchlist;
      if (onWatchlistToggle) {
        await onWatchlistToggle(stock.symbol, willAdd);
      } else {
        if (willAdd) {
          await api.addToWatchlist(stock.symbol);
        } else {
          await api.removeFromWatchlist(stock.symbol);
        }
      }
      setInWatchlist(willAdd);
    } catch (e) {
      alert(e.message);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const isPositive = stock ? stock.change >= 0 : true;

  // Calculate 52-week position percentage
  let week52Pct = 50;
  if (stock && stock.week_52_high > stock.week_52_low) {
    week52Pct = Math.min(100, Math.max(0, ((stock.current_price - stock.week_52_low) / (stock.week_52_high - stock.week_52_low)) * 100));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between gap-4 bg-gray-50/50 dark:bg-gray-950/30">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                {stock ? stock.symbol : symbol}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                stock?.category === 'Mid-Cap'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}>
                {stock?.category || 'Equity'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {stock?.sector} • {stock?.industry}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {stock?.company_name || symbol}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onAddToCompare && stock && (
              <button
                onClick={() => { onAddToCompare(stock.symbol); onClose(); }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Compare with other stocks"
              >
                <Scale size={14} />
                <span>Compare</span>
              </button>
            )}
            <button
              onClick={handleToggleWatchlist}
              disabled={watchlistLoading || !stock}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                inWatchlist
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {inWatchlist ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              <span>{inWatchlist ? 'Watchlist' : 'Add to Watchlist'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Price Bar */}
        {stock && (
          <div className="px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-900">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900 dark:text-white">
                ₹{stock.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`inline-flex items-center text-sm font-semibold font-mono px-2 py-0.5 rounded ${
                isPositive
                  ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400'
              }`}>
                {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%)
              </span>
            </div>

            {/* 52-Week Range Bar */}
            <div className="flex items-center gap-3 text-xs min-w-[220px]">
              <div className="text-right">
                <div className="text-[10px] text-gray-400">52W Low</div>
                <div className="font-mono font-medium text-gray-700 dark:text-gray-300">₹{stock.week_52_low}</div>
              </div>
              <div className="flex-1">
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${week52Pct}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400">52W High</div>
                <div className="font-mono font-medium text-gray-700 dark:text-gray-300">₹{stock.week_52_high}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 bg-gray-50/30 dark:bg-gray-950/20">
          {[
            { id: 'chart', label: 'Price Chart & History', icon: BarChart2 },
            { id: 'financials', label: 'Financial Highlights', icon: Building2 },
            { id: 'risk', label: 'Risk & Volatility Analysis', icon: Shield },
            { id: 'profile', label: 'Company Profile', icon: ExternalLink }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Loading company intelligence...</span>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-rose-500 text-sm">
              {error}
            </div>
          ) : stock ? (
            <>
              {/* TAB 1: CHART */}
              {activeTab === 'chart' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800">
                    <MiniChart symbol={stock.symbol} currentPrice={stock.current_price} height={280} />
                  </div>

                  {/* Historical Returns Table */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                      Historical Compounded / Absolute Returns
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {['1W', '1M', '6M', '1Y', '3Y', '5Y'].map(period => {
                        const val = stock.historical_returns?.[period] ?? 0;
                        const pos = val >= 0;
                        return (
                          <div key={period} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-center">
                            <div className="text-[10px] text-gray-400 uppercase font-semibold">{period}</div>
                            <div className={`text-sm font-bold font-mono mt-1 ${pos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              {pos ? '+' : ''}{val}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FINANCIAL HIGHLIGHTS */}
              {activeTab === 'financials' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Market Cap', val: `₹${stock.market_cap_cr.toLocaleString('en-IN')} Cr`, sub: stock.category },
                      { label: 'P/E Ratio', val: `${stock.pe_ratio}x`, sub: 'Valuation multiple' },
                      { label: 'EPS (TTM)', val: `₹${stock.eps}`, sub: 'Earnings per share' },
                      { label: 'ROE', val: `${stock.roe}%`, sub: 'Return on Equity' },
                      { label: 'Revenue Growth YoY', val: `${stock.revenue_growth_yoy}%`, sub: 'Sales trajectory' },
                      { label: 'Profit Growth YoY', val: `${stock.profit_growth_yoy}%`, sub: 'Net income growth' },
                      { label: 'Debt to Equity', val: `${stock.debt_to_equity}`, sub: stock.debt_to_equity < 0.5 ? 'Healthy solvency' : 'Moderate leverage' },
                      { label: 'Book Value', val: `₹${stock.book_value}`, sub: `P/B: ${(stock.current_price / (stock.book_value || 1)).toFixed(1)}x` },
                      { label: 'Dividend Yield', val: `${stock.dividend_yield}%`, sub: 'Annual cash return' },
                      { label: 'Promoter Holding', val: `${stock.promoter_holding}%`, sub: stock.promoter_holding > 50 ? 'Strong promoter backing' : 'High public/institutional float' },
                      { label: 'Trading Volume', val: stock.volume.toLocaleString('en-IN'), sub: 'Daily traded shares' },
                      { label: 'Beta (vs Nifty 50)', val: `${stock.beta}`, sub: stock.beta > 1.2 ? 'Higher volatility than Nifty' : 'Lower volatility than Nifty' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{item.label}</div>
                        <div className="text-base font-bold font-mono text-gray-900 dark:text-white mt-1">{item.val}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{item.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: RISK & VOLATILITY ANALYSIS */}
              {activeTab === 'risk' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black font-mono text-emerald-500">{stock.risk_score}</span>
                        <span className="text-[9px] text-gray-400 uppercase font-semibold">/ 10</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Composite Risk Assessment</h3>
                          <RiskBadge level={stock.risk_level} />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md">
                          Quantified proprietary risk rating evaluating market beta ({stock.beta}), leverage ({stock.debt_to_equity} D/E), 30-day realized volatility ({stock.volatility_30d}%), and market-cap size profile.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Beta Sensitivity</div>
                      <div className="text-xl font-bold font-mono text-gray-900 dark:text-white">{stock.beta}</div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                        {stock.beta > 1.3
                          ? 'High beta stock. Fluctuates significantly more than the benchmark index.'
                          : stock.beta < 0.9
                          ? 'Low beta stock. Historically provides defensive stability during downturns.'
                          : 'Moderate beta. Tracks standard Indian market swings.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">30-Day Volatility</div>
                      <div className="text-xl font-bold font-mono text-gray-900 dark:text-white">{stock.volatility_30d}%</div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                        Annualized standard deviation of daily percentage price movements over the last month.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Liquidity & Depth Score</div>
                      <div className="text-xl font-bold font-mono text-gray-900 dark:text-white">{stock.liquidity_score} / 10</div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
                        {stock.liquidity_score > 8.0
                          ? 'High trading liquidity with narrow bid-ask spreads.'
                          : 'Moderate small-cap liquidity. Suitable for retail sizing.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: COMPANY PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                      Business Overview
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {stock.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                      <span className="text-gray-400">Exchange Listing:</span>
                      <span className="font-semibold text-gray-900 dark:text-white ml-2">NSE & BSE</span>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                      <span className="text-gray-400">Primary Industry:</span>
                      <span className="font-semibold text-gray-900 dark:text-white ml-2">{stock.industry}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div>
            Data Source: <span className="font-medium text-gray-700 dark:text-gray-300">{stock?.data_source}</span>
          </div>
          <div>
            Updated: <span className="font-mono text-gray-700 dark:text-gray-300">{stock?.last_updated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
