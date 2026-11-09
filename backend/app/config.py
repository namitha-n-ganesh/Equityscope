import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_FILE = BASE_DIR / "equityscope.db"

class Settings:
    PROJECT_NAME: str = "EquityScope – Mid-Cap & Small-Cap Stock Intelligence"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DB_FILE.as_posix()}")
    MARKET_DATA_PROVIDER: str = os.getenv("MARKET_DATA_PROVIDER", "hybrid")
    CACHE_EXPIRATION_SECONDS: int = int(os.getenv("CACHE_EXPIRATION_SECONDS", "300"))
    SEBI_DISCLAIMER: str = "Educational stock research and analysis platform. Not SEBI registered investment advice."

settings = Settings()
