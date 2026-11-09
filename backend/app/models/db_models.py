import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database import Base

class WatchlistItem(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(50), unique=True, index=True, nullable=False)
    company_name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)  # Mid-Cap or Small-Cap
    sector = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    target_price = Column(Float, nullable=True)
    added_at = Column(DateTime, default=datetime.datetime.utcnow)

class RecentStock(Base):
    __tablename__ = "recent_stocks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(50), unique=True, index=True, nullable=False)
    viewed_at = Column(DateTime, default=datetime.datetime.utcnow)
