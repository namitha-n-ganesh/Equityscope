from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import CompareRequest, CompareResponse
from app.services.market_data import market_data_service
from app.services.analytics import compare_stocks_analytics

router = APIRouter(prefix="/compare", tags=["comparison"])

@router.post("", response_model=CompareResponse)
def compare_companies(req: CompareRequest):
    if not req.symbols or len(req.symbols) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 stock symbols to compare.")

    if len(req.symbols) > 5:
        raise HTTPException(status_code=400, detail="Comparison supports up to 5 stocks simultaneously.")

    stocks = []
    for sym in req.symbols:
        stk = market_data_service.get_stock_by_symbol(sym)
        if stk:
            stocks.append(stk)

    if len(stocks) < 2:
        raise HTTPException(status_code=404, detail="At least 2 valid stocks must be found for comparison.")

    analysis_res = compare_stocks_analytics(stocks)
    return analysis_res
