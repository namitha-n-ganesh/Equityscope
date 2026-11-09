# EquityScope – Mid-Cap & Small-Cap Stock Intelligence Platform

**EquityScope** is an educational financial intelligence, quantitative research, and analytics web platform focused on the **Indian stock market (NSE and BSE)**. It enables investors, analysts, and students to discover, analyze, compare, and monitor mid-cap and small-cap equities with risk indicators, financial ratios, interactive charts, and persistent watchlists.

> **Important Regulatory Notice:** EquityScope is an educational research and analytical platform, **not** a SEBI-registered investment advisory service. None of the contents, risk ratings, or comparison matrices constitute investment advice or buy/sell recommendations.

---

## 🌟 Key Features

1. **Fintech Main Dashboard**
   - Live KPI counters: Total Tracked Stocks, Mid-Cap Count, Small-Cap Count, and Market Advance/Decline Breadth.
   - Benchmark Proxies: Nifty Midcap 150, Nifty Smallcap 250, Nifty 50, and India VIX.
   - Top-Performing Stocks (Gainers) & Worst-Performing Stocks (Losers) with percentage changes.
   - Recently Viewed Companies panel with instant price previews.
   - Interactive Sector Allocation and Market Cap Distribution visualizations.

2. **Dedicated Mid-Cap Stock Analysis (SEBI Ranks 101–250)**
   - Curated universe of 18 high-profile Indian mid-cap companies (e.g., Tata Power, Polycab, Dixon Tech, Persistent Systems, KPIT Tech, Deepak Nitrite, Astral, Suzlon, etc.).
   - Full metrics suite: CMP, Market Cap, P/E, EPS, ROE, Revenue Growth YoY, Net Profit Growth YoY, Debt-to-Equity, 52-Week High & Low, and Historical Returns (1W, 1M, 6M, 1Y, 3Y, 5Y).
   - Multi-dimensional filtering (Sector, P/E range, ROE threshold, Debt/Equity cap) and dynamic sorting.

3. **Dedicated Small-Cap Stock Analysis (SEBI Ranks 251+)**
   - Curated universe of 18 high-growth Indian small-cap companies (e.g., CDSL, Happiest Minds, BSE Ltd, Kaynes Tech, CAMS, Route Mobile, Clean Science, MapmyIndia, Data Patterns, etc.).
   - Small-cap specific risk indicators: Composite Risk Score (1-10), 30-Day Realized Volatility, Beta sensitivity against Nifty 50, and Liquidity Depth Score.

4. **Multi-Stock Comparison Engine**
   - Select 2 to 5 companies side-by-side.
   - Head-to-head quantitative comparison matrix across 11 key fundamental and valuation metrics.
   - 5-Factor Radar / Spider chart comparing Profitability, Growth, Solvency/Safety, Momentum, and Valuation multiple.
   - Multi-period trailing return grouped bar charts (1W, 1M, 6M, 1Y, 3Y).

5. **Persistent Securities Watchlist (SQLite Database)**
   - Real-time search and instant addition to personal watchlist.
   - Persistent storage in embedded SQLite via SQLAlchemy ORM.
   - Custom investment thesis notes and target price monitoring.
   - 52-Week range indicator and quick-action access to charts and metrics.

6. **Interactive Visualizations & Charting**
   - Dynamic area charts powered by Recharts with time period selectors (1W, 1M, 6M, 1Y, 3Y, 5Y).
   - Interactive hover tooltips displaying date, price in ₹, and volume.
   - Color-coded performance states (emerald for positive returns, rose for drawdowns).

7. **Configurable Market Data Integration & Transparency**
   - Dual-engine architecture:
     - **Live Feed Mode:** Real-time quote and historical ingestion via Yahoo Finance (`.NS` tickers).
     - **Verified Snapshot Mode:** High-fidelity offline snapshot clearly stamped as *"NSE/BSE Market Data (Verified Offline Snapshot)"* when offline or rate-limited.
   - Explicit data source labeling and last-updated timestamps on every card, table, and modal.

8. **Modern Fintech UI/UX**
   - Seamless **Dark & Light Mode** toggle with system preference detection and localStorage persistence.
   - Responsive sidebar navigation (7 dedicated sections).
   - Instant autocomplete global search bar in the header.
   - Polished glassmorphism cards, metric badges, loading skeletons, and empty states.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React icons, Recharts |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **Database** | SQLite, SQLAlchemy ORM |
| **Data Processing** | Pandas, NumPy |
| **Market Data** | Yahoo Finance (`yfinance`), REST APIs, Configurable Fallback Engine |

---

## 📁 Project Architecture

```
equityscope/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py             # App configuration & settings
│   │   ├── database.py           # SQLite connection & session management
│   │   ├── main.py               # FastAPI application setup & CORS
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── db_models.py      # SQLAlchemy models (Watchlist, RecentStocks)
│   │   │   └── schemas.py        # Pydantic schemas for requests and responses
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── stocks.py         # /api/stocks, /api/stocks/midcap, /api/stocks/smallcap
│   │   │   ├── comparison.py     # /api/compare
│   │   │   ├── watchlist.py      # /api/watchlist (CRUD SQLite)
│   │   │   ├── market.py         # /api/market/overview, /api/market/trends
│   │   │   └── search.py         # /api/search
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── analytics.py      # Pandas & NumPy risk and radar calculations
│   │       ├── market_data.py    # Configurable live + fallback data service
│   │       └── stock_data.py     # 36 authentic Indian mid & small-cap securities
│   ├── requirements.txt
│   ├── run.py                    # Uvicorn launcher
│   └── test_app.py               # Comprehensive verification test suite
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Custom fintech SVG icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── DisclaimerBanner.jsx  # SEBI educational notice
│   │   │   ├── FilterBar.jsx         # Multi-field filter toolbar
│   │   │   ├── MetricCard.jsx        # KPI stat card
│   │   │   ├── MiniChart.jsx         # Recharts historical interactive chart
│   │   │   ├── Navbar.jsx            # Header with search & dark/light toggle
│   │   │   ├── RiskBadge.jsx         # Risk level pill (Low, Moderate, High, Very High)
│   │   │   ├── Sidebar.jsx           # 7-item navigation sidebar
│   │   │   ├── StockDetailModal.jsx  # In-depth multi-tab stock analysis modal
│   │   │   └── StockTable.jsx        # Sortable, responsive data table
│   │   ├── context/
│   │   │   └── ThemeContext.jsx      # Dark & Light mode provider
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx         # Regulatory disclaimers & methodology
│   │   │   ├── ComparePage.jsx       # Multi-stock side-by-side comparison
│   │   │   ├── DashboardPage.jsx     # Main financial dashboard
│   │   │   ├── MarketAnalysisPage.jsx# Macro distribution & sector charts
│   │   │   ├── MidCapPage.jsx        # Dedicated Mid-Cap analysis
│   │   │   ├── SmallCapPage.jsx      # Dedicated Small-Cap analysis
│   │   │   └── WatchlistPage.jsx     # SQLite-backed personal watchlist
│   │   ├── services/
│   │   │   └── api.js                # REST client for backend endpoints
│   │   ├── App.jsx                   # Main application layout & state
│   │   ├── index.css                 # Tailwind directives & custom CSS
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** and **npm**

---

### 2. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the automated backend verification test suite:
   ```bash
   python test_app.py
   ```

5. Launch the FastAPI backend server:
   ```bash
   python run.py
   ```
   *The FastAPI server will be running at:* `http://127.0.0.1:8000`  
   *Interactive Swagger API documentation:* `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The web application will open at:* `http://localhost:3000`

---

## 📊 SEBI Market Capitalization Framework Reference

According to SEBI Circular `SEBI/HO/IMD/DF3/CIR/P/2017/114`:
- **Large-Cap Stocks:** 1st to 100th company in terms of full market capitalization.
- **Mid-Cap Stocks:** 101st to 250th company in terms of full market capitalization.
- **Small-Cap Stocks:** 251st company onwards in terms of full market capitalization.

---

## ⚖️ Legal & Educational Disclaimer

This software is strictly an **educational tool** for financial data analysis, statistical modeling, and quantitative exploration. The platform does not give investment advice, portfolio management, or trade execution. Real financial decisions involve market risk, including potential loss of principal. Always seek guidance from an authorized SEBI-registered investment advisor.
