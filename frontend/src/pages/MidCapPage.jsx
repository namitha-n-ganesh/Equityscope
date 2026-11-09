import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  SlidersHorizontal,
  Download,
  Info,
  Layers,
  Award,
  Sparkles
} from 'lucide-react';
import { StockTable } from '../components/StockTable';
import { FilterBar } from '../components/FilterBar';
import { api } from '../services/api';

export const MidCapPage = ({
  onSelectStock,
  onAddToCompare,
  watchlistSymbols,
  onWatchlistToggle
}) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    min_pe: '',
    max_pe: '',
    min_roe: '',
    max_debt_to_equity: '',
    sort_by: 'market_cap_cr',
    sort_order: 'desc'
  });

  const fetchMidCapStocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMidCapStocks(filters);
      setStocks(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch mid-cap securities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMidCapStocks();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      sector: '',
      min_pe: '',
      max_pe: '',
      min_roe: '',
      max_debt_to_equity: '',
      sort_by: 'market_cap_cr',
      sort_order: 'desc'
    });
  };

  // Quick summary statistics
  const avgPe = stocks.length > 0 ? (stocks.reduce((acc, s) => acc + s.pe_ratio, 0) / stocks.length).toFixed(1) : 0;
  const avgRoe = stocks.length > 0 ? (stocks.reduce((acc, s) => acc + s.roe, 0) / stocks.length).toFixed(1) : 0;
  const totalMcap = stocks.length > 0 ? Math.round(stocks.reduce((acc, s) => acc + s.market_cap_cr, 0)) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Mid-Cap Stock Analysis
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              SEBI Ranks 101–250
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Established market leaders with strong earnings compounding and scalable business franchises.
          </p>
        </div>

        {/* Summary Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs">
            <span className="text-gray-400">Total Capitalization: </span>
            <span className="font-mono font-bold text-gray-900 dark:text-white">₹{totalMcap.toLocaleString('en-IN')} Cr</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs">
            <span className="text-gray-400">Avg P/E: </span>
            <span className="font-mono font-bold text-gray-900 dark:text-white">{avgPe}x</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs">
            <span className="text-gray-400">Avg ROE: </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{avgRoe}%</span>
          </div>
        </div>
      </div>

      {/* SEBI Guideline Informational Note */}
      <div className="bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/40 rounded-xl p-3.5 px-4 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
        <Info size={16} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-purple-950 dark:text-white mr-1">SEBI Mid-Cap Definition:</span>
          Under SEBI circular SEBI/HO/IMD/DF3/CIR/P/2017/114, Mid-Cap companies are defined as those ranked from 101st to 250th in terms of full market capitalization on the National Stock Exchange (NSE) or BSE.
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        showCategoryFilter={false}
      />

      {/* Stock Table */}
      <StockTable
        stocks={stocks}
        loading={loading}
        onSelectStock={onSelectStock}
        onAddToCompare={onAddToCompare}
        watchlistSymbols={watchlistSymbols}
        onWatchlistToggle={onWatchlistToggle}
        emptyMessage="No mid-cap stocks matched your criteria. Try widening your P/E, ROE, or sector filters."
      />
    </div>
  );
};
