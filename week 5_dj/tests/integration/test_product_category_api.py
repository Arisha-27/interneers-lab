import pytest
import json
from tests.seed.seed_data import seed_all


@pytest.fixture(autouse=True)
def seeded_db(mock_db):
    return seed_all(mock_db)


class TestGetAllCategories:
    def test_returns_200_and_list(self, client):
        res = client.get("/api/categories/")
        assert res.status_code == 200
        data = json.loads(res.data)
        assert len(data) == 3

    def test_response_has_correct_fields(self, client):
        res = client.get("/api/categories/")
        data = json.loads(res.data)
        assert "name" in data[0]
        assert "description" in data[0]


class TestCreateCategory:
    def test_creates_and_returns_201(self, client):
        payload = {"name": "Sports", "description": "Athletic gear"}
        res = client.post(
            "/api/categories/",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert res.status_code == 201
        data = json.loads(res.data)
        assert data["name"] == "Sports"

    def test_returns_400_on_empty_name(self, client):
        res = client.post(
            "/api/categories/",
            data=json.dumps({"name": "", "description": "desc"}),
            content_type="application/json",
        )
        assert res.status_code == 400

    def test_returns_400_on_missing_body(self, client):
        res = client.post("/api/categories/")
        assert res.status_code == 400


class TestGetCategoryById:
    def test_returns_category(self, client, mock_db):
        ids = seed_all(mock_db)
        cat_id = ids["category_ids"][0]
        res = client.get(f"/api/categories/{cat_id}")
        assert res.status_code == 200

    def test_returns_404_for_invalid_id(self, client):
        res = client.get("/api/categories/000000000000000000000000")
        assert res.status_code == 404


class TestDeleteCategory:
    def test_deletes_existing(self, client, mock_db):
        ids = seed_all(mock_db)
        cat_id = ids["category_ids"][0]
        res = client.delete(f"/api/categories/{cat_id}")
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data["deleted"] is True