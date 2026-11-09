import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown, ChevronDown } from 'lucide-react';

export const FilterBar = ({
  filters,
  onFilterChange,
  onReset,
  sectors = [],
  showCategoryFilter = true,
  showRiskFilter = true
}) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const defaultSectors = [
    'Information Technology',
    'Financial Services',
    'Utilities & Energy',
    'Consumer Durables',
    'Industrials',
    'Chemicals',
    'Healthcare',
    'Telecommunication',
    'Real Estate',
    'Materials'
  ];

  const sectorList = sectors.length > 0 ? sectors : defaultSectors;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search by company name or stock symbol..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Category Pills (if visible) */}
        {showCategoryFilter && (
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shrink-0">
            {['All', 'Mid-Cap', 'Small-Cap'].map(cat => (
              <button
                key={cat}
                onClick={() => handleChange('category', cat === 'All' ? '' : cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  (filters.category === cat || (cat === 'All' && !filters.category))
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={filters.sort_by || 'market_cap_cr'}
              onChange={(e) => handleChange('sort_by', e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-lg text-xs font-medium text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="market_cap_cr">Sort: Market Cap</option>
              <option value="current_price">Sort: Stock Price</option>
              <option value="change_percent">Sort: 1D Change %</option>
              <option value="pe_ratio">Sort: P/E Ratio</option>
              <option value="roe">Sort: ROE %</option>
              <option value="revenue_growth_yoy">Sort: Revenue Growth</option>
              <option value="profit_growth_yoy">Sort: Profit Growth</option>
              <option value="debt_to_equity">Sort: Debt to Equity</option>
              <option value="risk_score">Sort: Risk Score</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => handleChange('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={`Sort order: ${filters.sort_order === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown size={15} />
          </button>

          <button
            onClick={onReset}
            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Reset all filters"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Advanced Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800/60 text-xs">
        {/* Sector Filter */}
        <div className="relative">
          <select
            value={filters.sector || ''}
            onChange={(e) => handleChange('sector', e.target.value)}
            className="w-full appearance-none pl-2.5 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-gray-800 dark:text-gray-200 focus:outline-hidden"
          >
            <option value="">All Sectors</option>
            {sectorList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Max P/E */}
        <div>
          <input
            type="number"
            placeholder="Max P/E (e.g. 50)"
            value={filters.max_pe || ''}
            onChange={(e) => handleChange('max_pe', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-hidden"
          />
        </div>

        {/* Min ROE */}
        <div>
          <input
            type="number"
            placeholder="Min ROE % (e.g. 15)"
            value={filters.min_roe || ''}
            onChange={(e) => handleChange('min_roe', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-hidden"
          />
        </div>

        {/* Max Debt/Equity */}
        <div>
          <input
            type="number"
            step="0.1"
            placeholder="Max D/E (e.g. 0.5)"
            value={filters.max_debt_to_equity || ''}
            onChange={(e) => handleChange('max_debt_to_equity', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-hidden"
          />
        </div>

        {/* Risk Level Filter (if visible) */}
        {showRiskFilter && (
          <div className="relative">
            <select
              value={filters.risk_level || ''}
              onChange={(e) => handleChange('risk_level', e.target.value)}
              className="w-full appearance-none pl-2.5 pr-7 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs text-gray-800 dark:text-gray-200 focus:outline-hidden"
            >
              <option value="">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="High">High Risk</option>
              <option value="Very High">Very High Risk</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};
