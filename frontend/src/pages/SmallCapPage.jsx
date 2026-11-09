import React, { useState, useEffect } from 'react';
import {
  Zap,
  ShieldAlert,
  Info,
  AlertTriangle,
  Flame,
  Gauge
} from 'lucide-react';
import { StockTable } from '../components/StockTable';
import { FilterBar } from '../components/FilterBar';
import { api } from '../services/api';

export const SmallCapPage = ({
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
    risk_level: '',
    min_pe: '',
    max_pe: '',
    min_roe: '',
    max_debt_to_equity: '',
    sort_by: 'market_cap_cr',
    sort_order: 'desc'
  });

  const fetchSmallCapStocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSmallCapStocks(filters);
      setStocks(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch small-cap securities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmallCapStocks();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      sector: '',
      risk_level: '',
      min_pe: '',
      max_pe: '',
      min_roe: '',
      max_debt_to_equity: '',
      sort_by: 'market_cap_cr',
      sort_order: 'desc'
    });
  };

  // Small-cap risk aggregates
  const highRiskCount = stocks.filter(s => s.risk_level === 'High' || s.risk_level === 'Very High').length;
  const avgRoe = stocks.length > 0 ? (stocks.reduce((acc, s) => acc + s.roe, 0) / stocks.length).toFixed(1) : 0;
  const avgRevenueGrowth = stocks.length > 0 ? (stocks.reduce((acc, s) => acc + s.revenue_growth_yoy, 0) / stocks.length).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Small-Cap Stock Analysis
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              SEBI Ranks 251+
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Dynamic emerging growth companies with high alpha potential accompanied by higher beta and volatility.
          </p>
        </div>

        {/* Small-Cap Highlights */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs">
            <span className="text-gray-400">Avg Revenue Growth: </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{avgRevenueGrowth}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs">
            <span className="text-gray-400">Avg ROE: </span>
            <span className="font-mono font-bold text-gray-900 dark:text-white">{avgRoe}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs">
            <span className="text-gray-400">High Volatility Count: </span>
            <span className="font-mono font-bold text-amber-500">{highRiskCount}</span>
          </div>
        </div>
      </div>

      {/* Small-Cap Risk Warning Note */}
      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-xl p-3.5 px-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-950 dark:text-white mr-1">Risk & Liquidity Notice:</span>
          Small-Cap stocks historically exhibit wider bid-ask spreads, lower institutional depth, and higher cyclical drawdowns than large/mid-cap benchmarks. EquityScope's Risk Score incorporates beta sensitivity and solvency cushion.
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        showCategoryFilter={false}
        showRiskFilter={true}
      />

      {/* Stock Table */}
      <StockTable
        stocks={stocks}
        loading={loading}
        onSelectStock={onSelectStock}
        onAddToCompare={onAddToCompare}
        watchlistSymbols={watchlistSymbols}
        onWatchlistToggle={onWatchlistToggle}
        emptyMessage="No small-cap stocks matched your criteria. Try adjusting your risk level or valuation thresholds."
      />
    </div>
  );
};
