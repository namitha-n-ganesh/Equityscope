from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.db_models import RecentStock
from app.models.schemas import MarketOverview, StockBase
from app.services.market_data import market_data_service
from app.services.analytics import compute_sector_distribution, compute_market_cap_distribution

router = APIRouter(prefix="/market", tags=["market"])

@router.get("/overview", response_model=MarketOverview)
def get_market_overview(db: Session = Depends(get_db)):
    all_stocks = market_data_service.get_all_stocks()
    mid_caps = [s for s in all_stocks if s["category"] == "Mid-Cap"]
    small_caps = [s for s in all_stocks if s["category"] == "Small-Cap"]

    # Top Gainers & Losers sorted by change_percent
    sorted_by_gain = sorted(all_stocks, key=lambda x: x["change_percent"], reverse=True)
    top_gainers = sorted_by_gain[:5]
    top_losers = sorted_by_gain[-5:][::-1]

    # Sector breakdown & cap distribution via Pandas analytics
    sector_dist = compute_sector_distribution(all_stocks)
    cap_dist = compute_market_cap_distribution(all_stocks)

    # Indices
    indices = market_data_service.get_market_indices()

    # Recently viewed companies from SQLite
    recent_records = db.query(RecentStock).order_by(RecentStock.viewed_at.desc()).limit(6).all()
    recent_views = []
    for r in recent_records:
        stk = market_data_service.get_stock_by_symbol(r.symbol)
        if stk:
            recent_views.append(stk)

    # If no recent views yet, suggest 4 prominent mid & small caps
    if not recent_views:
        sample_syms = ["TATAPOWER", "POLYCAB", "CDSL", "BSE"]
        for s in sample_syms:
            stk = market_data_service.get_stock_by_symbol(s)
            if stk:
                recent_views.append(stk)

    return MarketOverview(
        total_tracked_stocks=len(all_stocks),
        mid_cap_count=len(mid_caps),
        small_cap_count=len(small_caps),
        top_gainers=top_gainers,
        top_losers=top_losers,
        indices=indices,
        sector_breakdown=sector_dist,
        market_cap_distribution=cap_dist,
        recent_views=recent_views,
        data_source=all_stocks[0]["data_source"] if all_stocks else "Verified Snapshot",
        last_updated=all_stocks[0]["last_updated"] if all_stocks else "N/A"
    )

@router.get("/trends")
def get_market_trends():
    all_stocks = market_data_service.get_all_stocks()
    
    # Risk distribution
    risk_counts = {"Low": 0, "Moderate": 0, "High": 0, "Very High": 0}
    for s in all_stocks:
        lvl = s.get("risk_level", "Moderate")
        if lvl in risk_counts:
            risk_counts[lvl] += 1

    # Valuation buckets: Under 25, 25-50, 50-75, 75+
    pe_buckets = {"Value (< 25)": 0, "Reasonable (25 - 50)": 0, "Growth (50 - 75)": 0, "Premium (> 75)": 0}
    for s in all_stocks:
        pe = s.get("pe_ratio", 0)
        if pe < 25:
            pe_buckets["Value (< 25)"] += 1
        elif pe < 50:
            pe_buckets["Reasonable (25 - 50)"] += 1
        elif pe < 75:
            pe_buckets["Growth (50 - 75)"] += 1
        else:
            pe_buckets["Premium (> 75)"] += 1

    # Market breadth: advancing vs declining
    advances = sum(1 for s in all_stocks if s["change_percent"] > 0)
    declines = sum(1 for s in all_stocks if s["change_percent"] < 0)
    unchanged = sum(1 for s in all_stocks if s["change_percent"] == 0)

    return {
        "market_breadth": {
            "advances": advances,
            "declines": declines,
            "unchanged": unchanged,
            "advance_decline_ratio": round(advances / max(1, declines), 2)
        },
        "risk_distribution": [{"level": k, "count": v} for k, v in risk_counts.items()],
        "valuation_buckets": [{"range": k, "count": v} for k, v in pe_buckets.items()],
        "data_source": all_stocks[0]["data_source"] if all_stocks else "Verified Snapshot",
        "last_updated": all_stocks[0]["last_updated"] if all_stocks else "N/A"
    }
