from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.db_models import WatchlistItem
from app.models.schemas import WatchlistCreate, WatchlistUpdate, WatchlistItemResponse
from app.services.market_data import market_data_service
import datetime

router = APIRouter(prefix="/watchlist", tags=["watchlist"])

@router.get("", response_model=List[WatchlistItemResponse])
def get_watchlist(db: Session = Depends(get_db)):
    items = db.query(WatchlistItem).order_by(WatchlistItem.added_at.desc()).all()
    results = []

    for item in items:
        stock = market_data_service.get_stock_by_symbol(item.symbol)
        if not stock:
            # Fallback if symbol metadata missing
            price = 0.0
            change_p = 0.0
            pe = 0.0
            roe = 0.0
            w52h = 0.0
            w52l = 0.0
            source = "Cache"
            last_up = "N/A"
        else:
            price = stock["current_price"]
            change_p = stock["change_percent"]
            pe = stock["pe_ratio"]
            roe = stock["roe"]
            w52h = stock["week_52_high"]
            w52l = stock["week_52_low"]
            source = stock["data_source"]
            last_up = stock["last_updated"]

        results.append(WatchlistItemResponse(
            id=item.id,
            symbol=item.symbol,
            company_name=item.company_name,
            category=item.category,
            sector=item.sector or "General",
            current_price=price,
            change_percent=change_p,
            pe_ratio=pe,
            roe=roe,
            week_52_high=w52h,
            week_52_low=w52l,
            notes=item.notes,
            target_price=item.target_price,
            added_at=item.added_at,
            data_source=source,
            last_updated=last_up
        ))

    return results

@router.post("", response_model=WatchlistItemResponse)
def add_to_watchlist(payload: WatchlistCreate, db: Session = Depends(get_db)):
    clean_sym = payload.symbol.upper().replace(".NS", "").replace(".BO", "").strip()

    # Check if already in watchlist
    existing = db.query(WatchlistItem).filter(WatchlistItem.symbol == clean_sym).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"'{clean_sym}' is already in your watchlist.")

    stock = market_data_service.get_stock_by_symbol(clean_sym)
    if not stock:
        raise HTTPException(status_code=404, detail=f"Stock '{clean_sym}' not found in universe.")

    new_item = WatchlistItem(
        symbol=stock["symbol"],
        company_name=stock["company_name"],
        category=stock["category"],
        sector=stock["sector"],
        notes=payload.notes,
        target_price=payload.target_price,
        added_at=datetime.datetime.utcnow()
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return WatchlistItemResponse(
        id=new_item.id,
        symbol=new_item.symbol,
        company_name=new_item.company_name,
        category=new_item.category,
        sector=new_item.sector,
        current_price=stock["current_price"],
        change_percent=stock["change_percent"],
        pe_ratio=stock["pe_ratio"],
        roe=stock["roe"],
        week_52_high=stock["week_52_high"],
        week_52_low=stock["week_52_low"],
        notes=new_item.notes,
        target_price=new_item.target_price,
        added_at=new_item.added_at,
        data_source=stock["data_source"],
        last_updated=stock["last_updated"]
    )

@router.put("/{symbol}", response_model=WatchlistItemResponse)
def update_watchlist_item(symbol: str, payload: WatchlistUpdate, db: Session = Depends(get_db)):
    clean_sym = symbol.upper().strip()
    item = db.query(WatchlistItem).filter(WatchlistItem.symbol == clean_sym).first()
    if not item:
        raise HTTPException(status_code=404, detail="Watchlist entry not found.")

    if payload.notes is not None:
        item.notes = payload.notes
    if payload.target_price is not None:
        item.target_price = payload.target_price

    db.commit()
    db.refresh(item)

    stock = market_data_service.get_stock_by_symbol(clean_sym)
    return WatchlistItemResponse(
        id=item.id,
        symbol=item.symbol,
        company_name=item.company_name,
        category=item.category,
        sector=item.sector,
        current_price=stock["current_price"] if stock else 0.0,
        change_percent=stock["change_percent"] if stock else 0.0,
        pe_ratio=stock["pe_ratio"] if stock else 0.0,
        roe=stock["roe"] if stock else 0.0,
        week_52_high=stock["week_52_high"] if stock else 0.0,
        week_52_low=stock["week_52_low"] if stock else 0.0,
        notes=item.notes,
        target_price=item.target_price,
        added_at=item.added_at,
        data_source=stock["data_source"] if stock else "N/A",
        last_updated=stock["last_updated"] if stock else "N/A"
    )

@router.delete("/{symbol}")
def remove_from_watchlist(symbol: str, db: Session = Depends(get_db)):
    clean_sym = symbol.upper().strip()
    item = db.query(WatchlistItem).filter(WatchlistItem.symbol == clean_sym).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"'{clean_sym}' not found in watchlist.")

    db.delete(item)
    db.commit()
    return {"message": f"'{clean_sym}' successfully removed from watchlist.", "symbol": clean_sym}
