const API_BASE_URL = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = 'An error occurred while fetching data.';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || errorMsg;
    } catch (_) {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return await response.json();
}

export const api = {
  // Market Overview & Trends
  async getMarketOverview() {
    const res = await fetch(`${API_BASE_URL}/market/overview`);
    return handleResponse(res);
  },

  async getMarketTrends() {
    const res = await fetch(`${API_BASE_URL}/market/trends`);
    return handleResponse(res);
  },

  // Stocks
  async getStocks(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE_URL}/stocks?${query.toString()}`);
    return handleResponse(res);
  },

  async getMidCapStocks(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE_URL}/stocks/midcap?${query.toString()}`);
    return handleResponse(res);
  },

  async getSmallCapStocks(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE_URL}/stocks/smallcap?${query.toString()}`);
    return handleResponse(res);
  },

  async getStockDetail(symbol) {
    const res = await fetch(`${API_BASE_URL}/stocks/${encodeURIComponent(symbol)}`);
    return handleResponse(res);
  },

  async getStockHistory(symbol, period = '1Y') {
    const res = await fetch(`${API_BASE_URL}/stocks/${encodeURIComponent(symbol)}/history?period=${encodeURIComponent(period)}`);
    return handleResponse(res);
  },

  // Stock Comparison
  async compareStocks(symbols) {
    const res = await fetch(`${API_BASE_URL}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols })
    });
    return handleResponse(res);
  },

  // Watchlist (SQLite)
  async getWatchlist() {
    const res = await fetch(`${API_BASE_URL}/watchlist`);
    return handleResponse(res);
  },

  async addToWatchlist(symbol, notes = '', target_price = null) {
    const res = await fetch(`${API_BASE_URL}/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, notes, target_price })
    });
    return handleResponse(res);
  },

  async updateWatchlistItem(symbol, notes, target_price) {
    const res = await fetch(`${API_BASE_URL}/watchlist/${encodeURIComponent(symbol)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, target_price })
    });
    return handleResponse(res);
  },

  async removeFromWatchlist(symbol) {
    const res = await fetch(`${API_BASE_URL}/watchlist/${encodeURIComponent(symbol)}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Search autocomplete
  async searchStocks(query) {
    if (!query || query.trim() === '') return [];
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return handleResponse(res);
  }
};
