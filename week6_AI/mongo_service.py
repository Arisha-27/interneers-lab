from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from pydantic import BaseModel
from datetime import datetime
from typing import Type
from config import MONGO_URI, DB_NAME, PRODUCTS_COL, AUDIT_COL


def get_db():
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
        client.admin.command("ping")
        return client[DB_NAME]
    except ConnectionFailure:
        raise ConnectionFailure(
            "❌ Cannot connect to MongoDB. Is it running?\n"
            "   Start it with: mongod --dbpath /data/db\n"
            f"   URI: {MONGO_URI}"
        )


def save_products(products: list, scenario: str = "") -> int:
    db   = get_db()
    coll = db[PRODUCTS_COL]

    docs = []
    for product in products:
        doc = product.model_dump()         
        doc["created_at"] = datetime.utcnow()
        doc["scenario"]   = scenario or "manual"
        docs.append(doc)

    result = coll.insert_many(docs)
    return len(result.inserted_ids)


def save_stock_events(events: list) -> int:
    db   = get_db()
    coll = db[AUDIT_COL]

    docs = []
    for event in events:
        doc = event.model_dump()
        doc["logged_at"]  = datetime.utcnow()
        doc["status"]     = "pending"
        doc["audit_type"] = "future_event_simulation"
        docs.append(doc)

    result = coll.insert_many(docs)
    return len(result.inserted_ids)


def count_products() -> int:
    db = get_db()
    return db[PRODUCTS_COL].count_documents({})


def count_events() -> int:
    db = get_db()
    return db[AUDIT_COL].count_documents({})