from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class StockBase(BaseModel):
    symbol: str
    company_name: str
    category: str  # "Mid-Cap" or "Small-Cap"
    sector: str
    current_price: float
    change: float
    change_percent: float
    market_cap_cr: float
    pe_ratio: float
    eps: float
    roe: float
    revenue_growth_yoy: float
    profit_growth_yoy: float
    debt_to_equity: float
    week_52_high: float
    week_52_low: float
    volume: int
    beta: float
    risk_level: str  # "Low", "Moderate", "High", "Very High"
    risk_score: float # 1 to 10
    data_source: str
    last_updated: str

class HistoricalDataPoint(BaseModel):
    date: str
    price: float
    volume: Optional[int] = 0

class StockDetail(StockBase):
    description: str
    exchange: str = "NSE"
    industry: str
    book_value: float
    dividend_yield: float
    promoter_holding: float
    historical_returns: Dict[str, float]  # e.g., {"1W": 1.2, "1M": -2.4, "6M": 14.5, "1Y": 28.3, "3Y": 115.0}
    recent_history: List[HistoricalDataPoint] = []
    liquidity_score: float  # Especially important for small-caps
    volatility_30d: float

class StockFilterParams(BaseModel):
    category: Optional[str] = None
    sector: Optional[str] = None
    search: Optional[str] = None
    min_market_cap: Optional[float] = None
    max_market_cap: Optional[float] = None
    min_pe: Optional[float] = None
    max_pe: Optional[float] = None
    min_roe: Optional[float] = None
    min_revenue_growth: Optional[float] = None
    min_profit_growth: Optional[float] = None
    max_debt_to_equity: Optional[float] = None
    risk_level: Optional[str] = None
    sort_by: Optional[str] = "market_cap_cr"
    sort_order: Optional[str] = "desc"

class HistoricalResponse(BaseModel):
    symbol: str
    company_name: str
    period: str
    data: List[HistoricalDataPoint]
    currency: str = "INR (₹)"
    data_source: str
    last_updated: str

class CompareRequest(BaseModel):
    symbols: List[str]

class CompareResponse(BaseModel):
    stocks: List[StockDetail]
    metrics_comparison: Dict[str, Dict[str, Any]]
    radar_data: List[Dict[str, Any]]
    performance_chart: List[Dict[str, Any]]
    risk_matrix: List[Dict[str, Any]]

class WatchlistCreate(BaseModel):
    symbol: str
    notes: Optional[str] = None
    target_price: Optional[float] = None

class WatchlistUpdate(BaseModel):
    notes: Optional[str] = None
    target_price: Optional[float] = None

class WatchlistItemResponse(BaseModel):
    id: int
    symbol: str
    company_name: str
    category: str
    sector: str
    current_price: float
    change_percent: float
    pe_ratio: float
    roe: float
    week_52_high: float
    week_52_low: float
    notes: Optional[str] = None
    target_price: Optional[float] = None
    added_at: datetime
    data_source: str
    last_updated: str

class MarketOverview(BaseModel):
    total_tracked_stocks: int
    mid_cap_count: int
    small_cap_count: int
    top_gainers: List[StockBase]
    top_losers: List[StockBase]
    indices: Dict[str, Any]
    sector_breakdown: List[Dict[str, Any]]
    market_cap_distribution: List[Dict[str, Any]]
    recent_views: List[StockBase]
    data_source: str
    last_updated: str
