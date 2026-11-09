import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export const Navbar = ({ onOpenSidebar, onSelectStock }) => {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const matches = await api.searchStocks(query);
        setResults(matches);
        setIsOpen(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to dismiss search dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol) => {
    setIsOpen(false);
    setQuery('');
    if (onSelectStock) onSelectStock(symbol);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Activity size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-gray-900 dark:text-white">
                  Equity<span className="text-emerald-500">Scope</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  NSE & BSE
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                Mid-Cap & Small-Cap Stock Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Autocomplete Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setIsOpen(true)}
              placeholder="Search Indian stocks (e.g. TATAPOWER, CDSL, BSE)..."
              className="w-full pl-9 pr-8 py-1.5 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown Results */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-xs text-gray-400">Searching market universe...</div>
              ) : results.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400">No stocks matching "{query}"</div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {results.map((item) => {
                    const isPos = item.change_percent >= 0;
                    return (
                      <div
                        key={item.symbol}
                        onClick={() => handleSelect(item.symbol)}
                        className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center justify-between gap-3 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-gray-900 dark:text-white">{item.symbol}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            item.category === 'Mid-Cap'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-[11px] truncate max-w-[150px]">
                            {item.company_name}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-mono font-semibold text-gray-900 dark:text-white">
                            ₹{item.current_price.toLocaleString('en-IN')}
                          </div>
                          <div className={`text-[10px] font-mono font-medium ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPos ? '+' : ''}{item.change_percent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Market Status & Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live Market indicator */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-700 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Market Active (NSE/BSE)</span>
          </div>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
