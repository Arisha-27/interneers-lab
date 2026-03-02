from fastapi import FastAPI
from app.config import init_db
from app.controllers.product_controller import router as product_router

app = FastAPI(title="Product API")

init_db()

app.include_router(product_router)