from flask import Flask
from pymongo import MongoClient
from app.repositories.product_repository import ProductRepository
from app.repositories.product_category_repository import ProductCategoryRepository
from app.services.product_service import ProductService
from app.services.product_category_service import ProductCategoryService
from app.routes.product_routes import product_bp
from app.routes.product_category_routes import category_bp


def create_app(db=None):
    app = Flask(__name__)

    if db is None:
        client = MongoClient("mongodb://localhost:27017/")
        db = client["mydb"]

    product_repo = ProductRepository(db["products"])
    category_repo = ProductCategoryRepository(db["categories"])

    app.config["PRODUCT_SERVICE"] = ProductService(product_repo)
    app.config["CATEGORY_SERVICE"] = ProductCategoryService(category_repo)

    app.register_blueprint(product_bp)
    app.register_blueprint(category_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
