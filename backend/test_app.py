import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.services.market_data import market_data_service
from app.services.analytics import compare_stocks_analytics, compute_sector_distribution, compute_market_cap_distribution
from app.database import SessionLocal, init_db
from app.models.db_models import WatchlistItem, RecentStock
from app.models.schemas import WatchlistCreate, WatchlistUpdate
from app.routers.watchlist import add_to_watchlist, get_watchlist, remove_from_watchlist, update_watchlist_item

def run_tests():
    print("==========================================")
    print("STARTING EQUITYSCOPE BACKEND VERIFICATION")
    print("==========================================")

    init_db()
    db = SessionLocal()

    # 1. Test Universe & SEBI categorization
    print("\n[Test 1] Verifying Stock Universe & SEBI Categorization...")
    all_stocks = market_data_service.get_all_stocks()
    assert len(all_stocks) == 36, f"Expected 36 stocks, got {len(all_stocks)}"
    midcaps = [s for s in all_stocks if s["category"] == "Mid-Cap"]
    smallcaps = [s for s in all_stocks if s["category"] == "Small-Cap"]
    assert len(midcaps) == 18, f"Expected 18 midcaps, got {len(midcaps)}"
    assert len(smallcaps) == 18, f"Expected 18 smallcaps, got {len(smallcaps)}"
    print(f"[OK] Universe Verified: {len(all_stocks)} stocks (18 Mid-Cap, 18 Small-Cap)")

    # 2. Test Filtering & Sorting
    print("\n[Test 2] Testing Multi-Dimensional Filters...")
    it_stocks = market_data_service.get_all_stocks(sector="Information Technology")
    assert len(it_stocks) > 0
    print(f"[OK] Filter Sector (IT): Found {len(it_stocks)} tech stocks ({[s['symbol'] for s in it_stocks]})")

    pe_filtered = market_data_service.get_all_stocks(max_pe=50.0)
    assert all(s["pe_ratio"] <= 50.0 for s in pe_filtered)
    print(f"[OK] Filter PE <= 50: Found {len(pe_filtered)} valuation-attractive stocks")

    sorted_by_roe = market_data_service.get_all_stocks(sort_by="roe", sort_order="desc")
    assert sorted_by_roe[0]["roe"] >= sorted_by_roe[-1]["roe"]
    print(f"[OK] Sorting by ROE: Top is {sorted_by_roe[0]['symbol']} with {sorted_by_roe[0]['roe']}% ROE")

    # 3. Test Single Stock Detail & History
    print("\n[Test 3] Testing Stock Detail & Chart Generation...")
    tata = market_data_service.get_stock_by_symbol("TATAPOWER")
    assert tata is not None
    assert tata["symbol"] == "TATAPOWER"
    assert "historical_returns" in tata
    assert tata["risk_score"] > 0
    print(f"[OK] Detail: {tata['company_name']}, CMP Rs {tata['current_price']}, Risk: {tata['risk_level']} ({tata['risk_score']}/10)")

    chart_1y = market_data_service.get_historical_data("TATAPOWER", period="1Y")
    assert len(chart_1y["data"]) > 10
    print(f"[OK] Chart: Generated {len(chart_1y['data'])} historical points for 1Y")

    # 4. Test Comparison Engine & Radar
    print("\n[Test 4] Testing Comparison Engine & Factor Radar...")
    comp_symbols = ["TATAPOWER", "POLYCAB", "CDSL"]
    comp_stocks = [market_data_service.get_stock_by_symbol(s) for s in comp_symbols]
    analysis = compare_stocks_analytics(comp_stocks)
    assert len(analysis["radar_data"]) == 5
    assert len(analysis["performance_chart"]) == 5
    print(f"[OK] Radar Dimensions: {[d['dimension'] for d in analysis['radar_data']]}")
    print(f"[OK] Metrics Comparison Table: Generated {len(analysis['metrics_comparison'])} rows")

    # 5. Test SQLite Watchlist Operations
    print("\n[Test 5] Testing SQLite Watchlist CRUD Operations...")
    try:
        remove_from_watchlist("TATAPOWER", db)
    except Exception:
        pass

    # Add to watchlist
    create_payload = WatchlistCreate(symbol="TATAPOWER", notes="Core utility thesis", target_price=520.0)
    added = add_to_watchlist(create_payload, db)
    assert added.symbol == "TATAPOWER"
    assert added.target_price == 520.0
    print(f"[OK] Watchlist Add: Successfully saved {added.symbol} to SQLite")

    # List watchlist
    wl = get_watchlist(db)
    assert any(i.symbol == "TATAPOWER" for i in wl)
    print(f"[OK] Watchlist List: Verified {len(wl)} items in persistent storage")

    # Update item
    update_payload = WatchlistUpdate(notes="Updated strong buy thesis", target_price=550.0)
    updated = update_watchlist_item("TATAPOWER", update_payload, db)
    assert updated.target_price == 550.0
    print(f"[OK] Watchlist Update: Target updated to Rs {updated.target_price}")

    # Remove item
    rem = remove_from_watchlist("TATAPOWER", db)
    assert rem["symbol"] == "TATAPOWER"
    print("[OK] Watchlist Delete: Removed TATAPOWER successfully")

    # 6. Test Macro Aggregations (Pandas / NumPy)
    print("\n[Test 6] Testing Pandas Macro Sector & Cap Distribution...")
    sec_dist = compute_sector_distribution(all_stocks)
    cap_dist = compute_market_cap_distribution(all_stocks)
    assert len(sec_dist) > 0
    assert len(cap_dist) == 2
    print(f"[OK] Sectors aggregated: {len(sec_dist)} sectors found")
    print(f"[OK] Market Cap split: {[c['category'] + ': ' + str(c['share_percent']) + '%' for c in cap_dist]}")

    db.close()

    print("\n=======================================================")
    print("ALL 6 COMPREHENSIVE BACKEND MODULE TESTS PASSED! 100% [OK]")
    print("=======================================================")

if __name__ == "__main__":
    run_tests()
