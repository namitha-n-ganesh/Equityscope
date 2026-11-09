from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.routers import stocks, comparison, watchlist, market, search

# Initialize SQLite tables
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Educational Mid-Cap & Small-Cap Stock Intelligence Platform for the Indian Stock Market (NSE/BSE).",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server (port 3000) & preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(stocks.router, prefix=settings.API_V1_STR)
app.include_router(comparison.router, prefix=settings.API_V1_STR)
app.include_router(watchlist.router, prefix=settings.API_V1_STR)
app.include_router(market.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "status": "online",
        "market": "Indian Equities (NSE/BSE)",
        "disclaimer": settings.SEBI_DISCLAIMER,
        "api_docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "data_provider": settings.MARKET_DATA_PROVIDER,
        "database": "SQLite (Connected)"
    }
