import React, { useState, useEffect } from 'react';
import {
  BookmarkCheck,
  Search,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Edit2,
  Check,
  X,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Database
} from 'lucide-react';
import { api } from '../services/api';

export const WatchlistPage = ({
  onSelectStock,
  onWatchlistCountChange
}) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTarget, setEditTarget] = useState('');

  const fetchWatchlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWatchlist();
      setWatchlist(data);
      if (onWatchlistCountChange) onWatchlistCountChange(data.length);
    } catch (err) {
      setError(err.message || 'Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Search autocomplete to add stock
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await api.searchStocks(searchQuery);
        setSearchResults(results);
      } catch (e) {
        console.error(e);
      } finally {
        setSearchLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAdd = async (symbol) => {
    try {
      await api.addToWatchlist(symbol);
      setSearchQuery('');
      setSearchResults([]);
      fetchWatchlist();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await api.removeFromWatchlist(symbol);
      const updated = watchlist.filter(item => item.symbol !== symbol);
      setWatchlist(updated);
      if (onWatchlistCountChange) onWatchlistCountChange(updated.length);
    } catch (e) {
      alert(e.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditNotes(item.notes || '');
    setEditTarget(item.target_price ? item.target_price.toString() : '');
  };

  const saveEdit = async (symbol) => {
    try {
      const targetVal = editTarget ? parseFloat(editTarget) : null;
      await api.updateWatchlistItem(symbol, editNotes, targetVal);
      setEditingId(null);
      fetchWatchlist();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Securities Watchlist
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <Database size={12} />
              SQLite Persistent
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Track selected mid-cap and small-cap opportunities with customized target alerts and thesis notes.
          </p>
        </div>

        {/* Add Stock Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search & add stock to watchlist..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-20 max-h-60 overflow-y-auto">
              {searchResults.map((stk) => {
                const alreadyAdded = watchlist.some(w => w.symbol === stk.symbol);
                return (
                  <div
                    key={stk.symbol}
                    className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between text-xs cursor-pointer"
                    onClick={() => !alreadyAdded && handleAdd(stk.symbol)}
                  >
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{stk.symbol}</div>
                      <div className="text-[10px] text-gray-400">{stk.company_name}</div>
                    </div>
                    <div>
                      {alreadyAdded ? (
                        <span className="text-[10px] text-gray-400 italic">In Watchlist</span>
                      ) : (
                        <button className="flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700">
                          <Plus size={11} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Loading saved watchlist...</span>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-rose-500 text-xs bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900 rounded-xl">
          {error}
        </div>
      ) : watchlist.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <BookmarkCheck size={22} />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            Search for Indian mid-cap or small-cap stocks above or browse our analysis pages to bookmark securities for tracking.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/75 dark:bg-gray-950/40 text-[11px] font-semibold uppercase tracking-wider text-gray-500 select-none">
                  <th className="py-3 px-4">Stock Symbol</th>
                  <th className="py-3 px-3">Current Price</th>
                  <th className="py-3 px-3">1D Change %</th>
                  <th className="py-3 px-3">P/E & ROE</th>
                  <th className="py-3 px-3 text-center min-w-[130px]">52-Week Range</th>
                  <th className="py-3 px-3">Target Price</th>
                  <th className="py-3 px-3">Research Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-mono">
                {watchlist.map((item) => {
                  const isPos = item.change_percent >= 0;
                  const isEditing = editingId === item.id;

                  let week52Pct = 50;
                  if (item.week_52_high > item.week_52_low) {
                    week52Pct = Math.min(100, Math.max(0, ((item.current_price - item.week_52_low) / (item.week_52_high - item.week_52_low)) * 100));
                  }

                  return (
                    <tr
                      key={item.symbol}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Symbol & Name */}
                      <td className="py-3 px-4">
                        <div
                          className="cursor-pointer group flex items-center gap-2"
                          onClick={() => onSelectStock(item.symbol)}
                        >
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                              {item.symbol}
                            </div>
                            <div className="text-[10px] font-sans text-gray-400 truncate max-w-[150px]">
                              {item.company_name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CMP */}
                      <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">
                        ₹{item.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* 1D Change */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center text-[11px] font-semibold ${isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isPos ? <TrendingUp size={11} className="mr-0.5" /> : <TrendingDown size={11} className="mr-0.5" />}
                          {isPos ? '+' : ''}{item.change_percent.toFixed(2)}%
                        </span>
                      </td>

                      {/* Valuation */}
                      <td className="py-3 px-3 text-[11px] text-gray-700 dark:text-gray-300">
                        <div>PE: {item.pe_ratio}x</div>
                        <div className="text-gray-400">ROE: {item.roe}%</div>
                      </td>

                      {/* 52W Range */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1 w-full max-w-[130px] mx-auto">
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${week52Pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-gray-400">
                            <span>₹{item.week_52_low}</span>
                            <span>₹{item.week_52_high}</span>
                          </div>
                        </div>
                      </td>

                      {/* Target Price */}
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editTarget}
                            onChange={(e) => setEditTarget(e.target.value)}
                            placeholder="Target ₹"
                            className="w-24 px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs text-gray-900 dark:text-white"
                          />
                        ) : (
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {item.target_price ? `₹${item.target_price}` : '—'}
                          </span>
                        )}
                      </td>

                      {/* Notes */}
                      <td className="py-3 px-3 font-sans text-xs">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Investment thesis..."
                            className="w-40 px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs text-gray-900 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 italic truncate max-w-[180px] block" title={item.notes}>
                            {item.notes || 'No notes added'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEdit(item.symbol)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded"
                                title="Save"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(item)}
                                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                title="Edit notes & target"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => onSelectStock(item.symbol)}
                                className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                title="View chart & metrics"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={() => handleRemove(item.symbol)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded"
                                title="Remove from watchlist"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
