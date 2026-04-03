import pytest
import json
from tests.seed.seed_data import seed_all


@pytest.fixture(autouse=True)
def seeded_db(mock_db):
    return seed_all(mock_db)


class TestGetAllProducts:
    def test_returns_200_and_products(self, client):
        res = client.get("/api/products/")
        assert res.status_code == 200
        data = json.loads(res.data)
        assert len(data) == 3

    def test_filter_by_category(self, client, mock_db):
        ids = seed_all(mock_db)
        cat_id = ids["category_ids"][0]
        res = client.get(f"/api/products/?category_id={cat_id}")
        data = json.loads(res.data)
        assert isinstance(data, list)


class TestCreateProduct:
    def test_creates_product_successfully(self, client):
        payload = {
            "name": "Headphones",
            "price": 149.99,
            "category_id": "cat123",
            "stock": 25,
        }
        res = client.post(
            "/api/products/",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert res.status_code == 201
        data = json.loads(res.data)
        assert data["name"] == "Headphones"
        assert data["price"] == 149.99

    def test_returns_400_on_negative_price(self, client):
        payload = {"name": "Item", "price": -10, "category_id": "cat1", "stock": 5}
        res = client.post(
            "/api/products/",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert res.status_code == 400

    def test_returns_400_on_empty_name(self, client):
        payload = {"name": "", "price": 10, "category_id": "cat1", "stock": 5}
        res = client.post(
            "/api/products/",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert res.status_code == 400


class TestEndToEndProductFlow:
    """Full CRUD flow: Create → Read → Update → Delete."""

    def test_full_crud_flow(self, client):
        # CREATE
        payload = {"name": "Keyboard", "price": 79.99, "category_id": "cat1", "stock": 30}
        res = client.post(
            "/api/products/",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert res.status_code == 201
        product = json.loads(res.data)
        product_id = product["id"]

        # READ
        res = client.get(f"/api/products/{product_id}")
        assert res.status_code == 200
        assert json.loads(res.data)["name"] == "Keyboard"

        # UPDATE
        res = client.put(
            f"/api/products/{product_id}",
            data=json.dumps({"price": 59.99}),
            content_type="application/json",
        )
        assert res.status_code == 200

        # DELETE
        res = client.delete(f"/api/products/{product_id}")
        assert res.status_code == 200

        # VERIFY DELETED
        res = client.get(f"/api/products/{product_id}")
        assert res.status_code == 404