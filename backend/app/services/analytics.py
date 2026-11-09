"""
Financial Analytics Engine powered by Pandas and NumPy.
Calculates volatility, risk scores, comparative percentiles,
performance matrices, and sector/cap aggregations.
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any

def calculate_stock_risk(beta: float, debt_to_equity: float, pe_ratio: float, volatility: float, is_small_cap: bool) -> Dict[str, Any]:
    """
    Computes a composite risk score (1 to 10) and level based on:
    - Beta (market sensitivity)
    - Debt to Equity ratio
    - P/E relative valuation stretch
    - 30-day historical volatility
    - Small-cap liquidity/size penalty
    """
    # Base risk score calculation
    beta_component = min(3.5, max(0.5, beta * 2.0))
    de_component = min(3.0, debt_to_equity * 1.5)
    vol_component = min(2.5, (volatility / 30.0) * 2.5)
    size_penalty = 1.0 if is_small_cap else 0.0

    raw_score = beta_component + de_component + vol_component + size_penalty
    final_score = round(float(np.clip(raw_score, 1.0, 10.0)), 1)

    if final_score < 4.2:
        risk_level = "Low"
    elif final_score < 6.2:
        risk_level = "Moderate"
    elif final_score < 8.0:
        risk_level = "High"
    else:
        risk_level = "Very High"

    return {
        "risk_score": final_score,
        "risk_level": risk_level
    }

def compute_sector_distribution(stocks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Computes aggregate metrics by sector using Pandas.
    """
    if not stocks:
        return []
    
    df = pd.DataFrame(stocks)
    sector_group = df.groupby("sector").agg(
        count=("symbol", "count"),
        total_market_cap=("market_cap_cr", "sum"),
        avg_pe=("pe_ratio", "mean"),
        avg_roe=("roe", "mean"),
        avg_change=("change_percent", "mean")
    ).reset_index()

    total_mcap = sector_group["total_market_cap"].sum()
    sector_group["weight_percent"] = (sector_group["total_market_cap"] / total_mcap * 100.0).round(2)
    sector_group["avg_pe"] = sector_group["avg_pe"].round(1)
    sector_group["avg_roe"] = sector_group["avg_roe"].round(1)
    sector_group["avg_change"] = sector_group["avg_change"].round(2)
    sector_group["total_market_cap"] = sector_group["total_market_cap"].round(1)

    return sector_group.to_dict(orient="records")

def compute_market_cap_distribution(stocks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Computes Mid-Cap vs Small-Cap market cap distribution.
    """
    if not stocks:
        return []
        
    df = pd.DataFrame(stocks)
    cap_group = df.groupby("category").agg(
        count=("symbol", "count"),
        total_market_cap=("market_cap_cr", "sum"),
        avg_roe=("roe", "mean"),
        avg_pe=("pe_ratio", "mean")
    ).reset_index()

    total_mcap = cap_group["total_market_cap"].sum()
    cap_group["share_percent"] = (cap_group["total_market_cap"] / total_mcap * 100.0).round(1)
    cap_group["total_market_cap"] = cap_group["total_market_cap"].round(1)
    cap_group["avg_roe"] = cap_group["avg_roe"].round(1)
    cap_group["avg_pe"] = cap_group["avg_pe"].round(1)

    return cap_group.to_dict(orient="records")

def compare_stocks_analytics(stocks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Performs multi-dimensional comparison across selected companies:
    1. Metric side-by-side
    2. Normalized Radar chart scores (0-100) across Valuation, Growth, Quality (ROE), Solvency (low D/E), Momentum
    3. Performance bar comparisons
    4. Risk matrix
    """
    if not stocks:
        return {"stocks": [], "metrics_comparison": {}, "radar_data": [], "performance_chart": [], "risk_matrix": []}

    df = pd.DataFrame(stocks)

    # Radar dimensions
    # Quality: ROE (higher better)
    # Valuation: 100 - relative PE
    # Growth: Avg of revenue & profit growth
    # Solvency: 100 - Debt to Equity scaled
    # Momentum: 1Y return
    
    radar_data = [
        {"dimension": "Profitability (ROE)"},
        {"dimension": "Growth (Rev & PAT)"},
        {"dimension": "Solvency & Safety"},
        {"dimension": "1-Year Momentum"},
        {"dimension": "Valuation Attractiveness"},
    ]

    for stock in stocks:
        sym = stock["symbol"]
        roe_score = min(100, max(10, stock.get("roe", 15) * 2.8))
        growth = (stock.get("revenue_growth_yoy", 10) + stock.get("profit_growth_yoy", 10)) / 2.0
        growth_score = min(100, max(10, growth * 1.8 + 20))
        solvency_score = max(10, 100 - min(90, stock.get("debt_to_equity", 0.5) * 60))
        ret_1y = stock.get("historical_returns", {}).get("1Y", 20.0)
        momentum_score = min(100, max(10, (ret_1y + 20) * 0.7))
        pe = stock.get("pe_ratio", 40.0)
        val_score = max(10, min(100, 120 - pe * 0.9))

        radar_data[0][sym] = round(roe_score, 1)
        radar_data[1][sym] = round(growth_score, 1)
        radar_data[2][sym] = round(solvency_score, 1)
        radar_data[3][sym] = round(momentum_score, 1)
        radar_data[4][sym] = round(val_score, 1)

    # Performance comparison chart
    perf_chart = [
        {"period": "1 Week"},
        {"period": "1 Month"},
        {"period": "6 Months"},
        {"period": "1 Year"},
        {"period": "3 Years"}
    ]
    period_keys = ["1W", "1M", "6M", "1Y", "3Y"]
    for i, p_key in enumerate(period_keys):
        for stock in stocks:
            perf_chart[i][stock["symbol"]] = stock.get("historical_returns", {}).get(p_key, 0.0)

    # Risk matrix: Scatter / bubble points
    risk_matrix = []
    for stock in stocks:
        risk_matrix.append({
            "symbol": stock["symbol"],
            "company_name": stock["company_name"],
            "beta": stock.get("beta", 1.0),
            "volatility": stock.get("volatility_30d", 20.0),
            "return_1y": stock.get("historical_returns", {}).get("1Y", 0.0),
            "risk_score": stock.get("risk_score", 5.0),
            "category": stock.get("category", "Mid-Cap")
        })

    # Summary metric comparison mapping
    metrics = {
        "market_cap_cr": {"label": "Market Cap (₹ Cr)", "format": "currency"},
        "current_price": {"label": "Current Market Price (₹)", "format": "currency"},
        "pe_ratio": {"label": "P/E Ratio", "format": "ratio"},
        "eps": {"label": "EPS (₹)", "format": "number"},
        "roe": {"label": "ROE (%)", "format": "percent"},
        "revenue_growth_yoy": {"label": "Revenue Growth YoY (%)", "format": "percent"},
        "profit_growth_yoy": {"label": "Profit Growth YoY (%)", "format": "percent"},
        "debt_to_equity": {"label": "Debt-to-Equity Ratio", "format": "ratio"},
        "beta": {"label": "Beta (vs Nifty 50)", "format": "ratio"},
        "week_52_high": {"label": "52-Week High (₹)", "format": "currency"},
        "week_52_low": {"label": "52-Week Low (₹)", "format": "currency"},
    }

    metrics_comparison = {}
    for metric_key, meta in metrics.items():
        row = {"label": meta["label"], "format": meta["format"]}
        for stock in stocks:
            row[stock["symbol"]] = stock.get(metric_key, None)
        metrics_comparison[metric_key] = row

    return {
        "stocks": stocks,
        "metrics_comparison": metrics_comparison,
        "radar_data": radar_data,
        "performance_chart": perf_chart,
        "risk_matrix": risk_matrix
    }
