import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Zap,
  Scale,
  BookmarkCheck,
  PieChart,
  Info,
  X,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = ({
  activePage,
  onNavigate,
  isOpen,
  onClose,
  watchlistCount = 0
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'midcap', label: 'Mid-Cap Stocks', icon: TrendingUp },
    { id: 'smallcap', label: 'Small-Cap Stocks', icon: Zap },
    { id: 'comparison', label: 'Stock Comparison', icon: Scale },
    { id: 'watchlist', label: 'Watchlist', icon: BookmarkCheck, count: watchlistCount },
    { id: 'market-analysis', label: 'Market Analysis', icon: PieChart },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  const handleItemClick = (id) => {
    onNavigate(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#0B0F19] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
              Equity<span className="text-emerald-500">Scope</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'} />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
          <div className="flex items-start gap-2.5 text-[11px] text-gray-500 dark:text-gray-400">
            <ShieldAlert size={15} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">SEBI Educational Model:</span>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">
                For educational & research evaluation only. No buy/sell tips.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
