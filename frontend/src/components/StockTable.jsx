import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Scale,
  Eye,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { RiskBadge } from './RiskBadge';

export const StockTable = ({
  stocks = [],
  loading = false,
  onSelectStock,
  onAddToCompare = null,
  watchlistSymbols = [],
  onWatchlistToggle = null,
  emptyMessage = "No stocks match your active filter criteria."
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden p-8">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-3">
          <SlidersHorizontal size={20} />
        </div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">No securities found</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/75 dark:bg-gray-950/40 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 select-none">
              <th className="py-3 px-4">Company / Symbol</th>
              <th className="py-3 px-3">Price & 1D Change</th>
              <th className="py-3 px-3 text-right">Market Cap (₹ Cr)</th>
              <th className="py-3 px-3 text-right">P/E</th>
              <th className="py-3 px-3 text-right">ROE</th>
              <th className="py-3 px-3 text-right">Rev / PAT YoY</th>
              <th className="py-3 px-3 text-right">D/E</th>
              <th className="py-3 px-3 text-center min-w-[130px]">52-Week Range</th>
              <th className="py-3 px-3 text-center">Risk</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs">
            {stocks.map((stock) => {
              const isPositive = stock.change >= 0;
              const inWatchlist = watchlistSymbols.includes(stock.symbol);

              // 52-week position calculation
              let week52Pct = 50;
              if (stock.week_52_high > stock.week_52_low) {
                week52Pct = Math.min(100, Math.max(0, ((stock.current_price - stock.week_52_low) / (stock.week_52_high - stock.week_52_low)) * 100));
              }

              return (
                <tr
                  key={stock.symbol}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectStock && onSelectStock(stock.symbol)}
                >
                  {/* Company & Symbol */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {stock.symbol}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            stock.category === 'Mid-Cap'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {stock.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[170px]" title={stock.company_name}>
                          {stock.company_name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price & 1D Change */}
                  <td className="py-3.5 px-3">
                    <div className="font-mono font-bold text-gray-900 dark:text-white">
                      ₹{stock.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`inline-flex items-center text-[11px] font-semibold font-mono ${
                      isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {isPositive ? <TrendingUp size={11} className="mr-0.5" /> : <TrendingDown size={11} className="mr-0.5" />}
                      {isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%
                    </div>
                  </td>

                  {/* Market Cap */}
                  <td className="py-3.5 px-3 text-right font-mono font-medium text-gray-800 dark:text-gray-200">
                    ₹{stock.market_cap_cr.toLocaleString('en-IN')}
                  </td>

                  {/* P/E Ratio */}
                  <td className="py-3.5 px-3 text-right font-mono text-gray-700 dark:text-gray-300">
                    <span className={stock.pe_ratio > 70 ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}>
                      {stock.pe_ratio}x
                    </span>
                  </td>

                  {/* ROE */}
                  <td className="py-3.5 px-3 text-right font-mono">
                    <span className={`font-semibold ${stock.roe >= 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {stock.roe}%
                    </span>
                  </td>

                  {/* Rev / PAT YoY Growth */}
                  <td className="py-3.5 px-3 text-right font-mono text-[11px]">
                    <div className="text-gray-700 dark:text-gray-300">
                      R: <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{stock.revenue_growth_yoy}%</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      P: <span className={stock.profit_growth_yoy >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600'}>
                        {stock.profit_growth_yoy >= 0 ? '+' : ''}{stock.profit_growth_yoy}%
                      </span>
                    </div>
                  </td>

                  {/* Debt to Equity */}
                  <td className="py-3.5 px-3 text-right font-mono">
                    <span className={stock.debt_to_equity > 1.0 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-700 dark:text-gray-300'}>
                      {stock.debt_to_equity}
                    </span>
                  </td>

                  {/* 52-Week Range Bar */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-1 w-full max-w-[140px] mx-auto">
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${week52Pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-gray-400">
                        <span>₹{stock.week_52_low}</span>
                        <span>₹{stock.week_52_high}</span>
                      </div>
                    </div>
                  </td>

                  {/* Risk Badge */}
                  <td className="py-3.5 px-3 text-center">
                    <RiskBadge level={stock.risk_level} score={stock.risk_score} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {onAddToCompare && (
                        <button
                          onClick={() => onAddToCompare(stock.symbol)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                          title="Add to comparison"
                        >
                          <Scale size={14} />
                        </button>
                      )}
                      {onWatchlistToggle && (
                        <button
                          onClick={() => onWatchlistToggle(stock.symbol, !inWatchlist)}
                          className={`p-1.5 rounded-md transition-colors ${
                            inWatchlist
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                              : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          title={inWatchlist ? "In watchlist" : "Add to watchlist"}
                        >
                          {inWatchlist ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                        </button>
                      )}
                      <button
                        onClick={() => onSelectStock && onSelectStock(stock.symbol)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        title="View details"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
