from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.market_data import market_data_service

router = APIRouter(prefix="/search", tags=["search"])

@router.get("", response_model=List[Dict[str, Any]])
def search_stocks(q: str = Query(..., min_length=1, description="Query string")):
    clean_q = q.lower().strip()
    all_stocks = market_data_service.get_all_stocks()
    matches = []

    for s in all_stocks:
        symbol = s["symbol"].lower()
        company = s["company_name"].lower()
        sector = s["sector"].lower()

        # Score matching relevance
        if symbol.startswith(clean_q):
            score = 100
        elif clean_q in symbol:
            score = 80
        elif company.startswith(clean_q):
            score = 70
        elif clean_q in company:
            score = 50
        elif clean_q in sector:
            score = 30
        else:
            continue

        matches.append({
            "symbol": s["symbol"],
            "company_name": s["company_name"],
            "category": s["category"],
            "sector": s["sector"],
            "current_price": s["current_price"],
            "change_percent": s["change_percent"],
            "market_cap_cr": s["market_cap_cr"],
            "score": score
        })

    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches[:10]
