from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas import StockBase, StockDetail, HistoricalResponse
from app.models.db_models import RecentStock
from app.services.market_data import market_data_service
import datetime

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("", response_model=List[StockBase])
def get_stocks(
    category: Optional[str] = Query(None, description="Mid-Cap or Small-Cap"),
    sector: Optional[str] = Query(None, description="Sector name"),
    search: Optional[str] = Query(None, description="Symbol or company name search"),
    min_market_cap: Optional[float] = Query(None, description="Min market cap in Cr"),
    max_market_cap: Optional[float] = Query(None, description="Max market cap in Cr"),
    min_pe: Optional[float] = Query(None, description="Min PE ratio"),
    max_pe: Optional[float] = Query(None, description="Max PE ratio"),
    min_roe: Optional[float] = Query(None, description="Min ROE %"),
    min_revenue_growth: Optional[float] = Query(None, description="Min revenue growth YoY %"),
    min_profit_growth: Optional[float] = Query(None, description="Min profit growth YoY %"),
    max_debt_to_equity: Optional[float] = Query(None, description="Max Debt to Equity"),
    risk_level: Optional[str] = Query(None, description="Risk level (Low, Moderate, High, Very High)"),
    sort_by: Optional[str] = Query("market_cap_cr", description="Sort field"),
    sort_order: Optional[str] = Query("desc", description="Sort order: asc or desc"),
):
    stocks = market_data_service.get_all_stocks(
        category=category,
        sector=sector,
        search=search,
        min_market_cap=min_market_cap,
        max_market_cap=max_market_cap,
        min_pe=min_pe,
        max_pe=max_pe,
        min_roe=min_roe,
        min_revenue_growth=min_revenue_growth,
        min_profit_growth=min_profit_growth,
        max_debt_to_equity=max_debt_to_equity,
        risk_level=risk_level,
        sort_by=sort_by,
        sort_order=sort_order
    )
    return stocks

@router.get("/midcap", response_model=List[StockBase])
def get_midcap_stocks(
    sector: Optional[str] = None,
    search: Optional[str] = None,
    min_pe: Optional[float] = None,
    max_pe: Optional[float] = None,
    min_roe: Optional[float] = None,
    sort_by: Optional[str] = "market_cap_cr",
    sort_order: Optional[str] = "desc"
):
    return market_data_service.get_all_stocks(
        category="Mid-Cap",
        sector=sector,
        search=search,
        min_pe=min_pe,
        max_pe=max_pe,
        min_roe=min_roe,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/smallcap", response_model=List[StockBase])
def get_smallcap_stocks(
    sector: Optional[str] = None,
    search: Optional[str] = None,
    min_pe: Optional[float] = None,
    max_pe: Optional[float] = None,
    min_roe: Optional[float] = None,
    risk_level: Optional[str] = None,
    sort_by: Optional[str] = "market_cap_cr",
    sort_order: Optional[str] = "desc"
):
    return market_data_service.get_all_stocks(
        category="Small-Cap",
        sector=sector,
        search=search,
        min_pe=min_pe,
        max_pe=max_pe,
        min_roe=min_roe,
        risk_level=risk_level,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/{symbol}", response_model=StockDetail)
def get_stock_detail(symbol: str, db: Session = Depends(get_db)):
    stock = market_data_service.get_stock_by_symbol(symbol)
    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock symbol '{symbol}' not found.")

    # Record recent stock view in SQLite
    try:
        recent = db.query(RecentStock).filter(RecentStock.symbol == stock["symbol"]).first()
        if recent:
            recent.viewed_at = datetime.datetime.utcnow()
        else:
            db.add(RecentStock(symbol=stock["symbol"]))
        db.commit()
    except Exception:
        db.rollback()

    return stock

@router.get("/{symbol}/history", response_model=HistoricalResponse)
def get_stock_history(
    symbol: str,
    period: str = Query("1Y", description="Timeframe: 1W, 1M, 6M, 1Y, 3Y, 5Y")
):
    valid_periods = ["1W", "1M", "6M", "1Y", "3Y", "5Y"]
    period_clean = period.upper() if period.upper() in valid_periods else "1Y"
    return market_data_service.get_historical_data(symbol, period_clean)
