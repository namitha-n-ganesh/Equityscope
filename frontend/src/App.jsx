import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StockDetailModal } from './components/StockDetailModal';
import { DashboardPage } from './pages/DashboardPage';
import { MidCapPage } from './pages/MidCapPage';
import { SmallCapPage } from './pages/SmallCapPage';
import { ComparePage } from './pages/ComparePage';
import { WatchlistPage } from './pages/WatchlistPage';
import { MarketAnalysisPage } from './pages/MarketAnalysisPage';
import { AboutPage } from './pages/AboutPage';
import { api } from './services/api';

export function MainApp() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [comparisonSymbols, setComparisonSymbols] = useState(['TATAPOWER', 'POLYCAB']);
  const [watchlistSymbols, setWatchlistSymbols] = useState([]);
  const [notification, setNotification] = useState(null);

  // Sync watchlist symbols from SQLite on initial mount
  const syncWatchlist = async () => {
    try {
      const items = await api.getWatchlist();
      setWatchlistSymbols(items.map(item => item.symbol));
    } catch (e) {
      console.error('Watchlist sync error:', e);
    }
  };

  useEffect(() => {
    syncWatchlist();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSelectStock = (symbol) => {
    setSelectedStock(symbol);
    setIsDetailOpen(true);
  };

  const handleAddToCompare = (symbol) => {
    if (!comparisonSymbols.includes(symbol)) {
      if (comparisonSymbols.length >= 5) {
        showToast('Comparison limit reached (max 5 stocks).');
        return;
      }
      setComparisonSymbols(prev => [...prev, symbol]);
      showToast(`Added ${symbol} to Comparison.`);
    }
    setActivePage('comparison');
  };

  const handleWatchlistToggle = async (symbol, willAdd) => {
    try {
      if (willAdd) {
        await api.addToWatchlist(symbol);
        setWatchlistSymbols(prev => [...prev, symbol]);
        showToast(`Added ${symbol} to Watchlist.`);
      } else {
        await api.removeFromWatchlist(symbol);
        setWatchlistSymbols(prev => prev.filter(s => s !== symbol));
        showToast(`Removed ${symbol} from Watchlist.`);
      }
    } catch (e) {
      showToast(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        watchlistCount={watchlistSymbols.length}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Navbar Header */}
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onSelectStock={handleSelectStock}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardPage
              onSelectStock={handleSelectStock}
              onNavigate={setActivePage}
              watchlistSymbols={watchlistSymbols}
              onWatchlistToggle={handleWatchlistToggle}
            />
          )}

          {activePage === 'midcap' && (
            <MidCapPage
              onSelectStock={handleSelectStock}
              onAddToCompare={handleAddToCompare}
              watchlistSymbols={watchlistSymbols}
              onWatchlistToggle={handleWatchlistToggle}
            />
          )}

          {activePage === 'smallcap' && (
            <SmallCapPage
              onSelectStock={handleSelectStock}
              onAddToCompare={handleAddToCompare}
              watchlistSymbols={watchlistSymbols}
              onWatchlistToggle={handleWatchlistToggle}
            />
          )}

          {activePage === 'comparison' && (
            <ComparePage
              initialSymbols={comparisonSymbols}
              onSelectStock={handleSelectStock}
            />
          )}

          {activePage === 'watchlist' && (
            <WatchlistPage
              onSelectStock={handleSelectStock}
              onWatchlistCountChange={(count) => syncWatchlist()}
            />
          )}

          {activePage === 'market-analysis' && (
            <MarketAnalysisPage />
          )}

          {activePage === 'about' && (
            <AboutPage />
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F19] py-5 px-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong className="text-gray-700 dark:text-gray-300">EquityScope</strong> – Mid-Cap & Small-Cap Stock Intelligence Platform
            </div>
            <div className="text-[11px] text-gray-400">
              NSE/BSE Listed Equities • Educational & Research Sandbox
            </div>
          </div>
        </footer>
      </div>

      {/* Stock Deep-Dive Modal */}
      <StockDetailModal
        symbol={selectedStock}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCompare={handleAddToCompare}
        watchlistSymbols={watchlistSymbols}
        onWatchlistToggle={handleWatchlistToggle}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
