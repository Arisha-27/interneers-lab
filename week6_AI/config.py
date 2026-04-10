import os
from dotenv import load_dotenv

load_dotenv()

def get_env_variable(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise ValueError(f"❌ Missing required environment variable: {name}")
    return value

GEMINI_API_KEY = get_env_variable("GEMINI_API_KEY")
GEMINI_MODEL   = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

MONGO_URI    = get_env_variable("MONGO_URI")
DB_NAME      = os.getenv("DB_NAME", "toy_store_week6")
PRODUCTS_COL = "products"
AUDIT_COL    = "stock_events"