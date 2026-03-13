import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import init_db
from mongoengine.connection import disconnect
from app.models.product_model import Product


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    disconnect()
    init_db(testing=True)
    yield
    disconnect()


@pytest.fixture(autouse=True)
def clear_database():
    Product.objects.delete()
    yield
    Product.objects.delete()


@pytest.fixture
def client():
    return TestClient(app)