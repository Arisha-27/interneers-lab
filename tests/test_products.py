def test_create_product(client):
    response = client.post(
        "/products/",
        json={
            "name": "Test Laptop",
            "description": "Test Desc",
            "price": 50000
        }
    )

    assert response.status_code == 200
    data = response.json()

    assert data["name"] == "Test Laptop"
    assert data["price"] == 50000
    assert "created_at" in data
    assert "updated_at" in data


def test_get_products(client):
    client.post(
        "/products/",
        json={
            "name": "Test Laptop",
            "description": "Test Desc",
            "price": 50000
        }
    )

    response = client.get("/products/")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_product_by_id(client):
    create_response = client.post(
        "/products/",
        json={
            "name": "Test Laptop",
            "description": "Test Desc",
            "price": 50000
        }
    )

    product_id = create_response.json()["id"]

    response = client.get(f"/products/{product_id}")
    assert response.status_code == 200
    assert response.json()["id"] == product_id


def test_update_product(client):
    create_response = client.post(
        "/products/",
        json={
            "name": "Old Name",
            "description": "Test Desc",
            "price": 50000
        }
    )

    product_id = create_response.json()["id"]

    update_response = client.put(
        f"/products/{product_id}",
        json={
            "name": "New Name",
            "description": "Updated",
            "price": 60000
        }
    )

    assert update_response.status_code == 200
    assert update_response.json()["name"] == "New Name"


def test_delete_product(client):
    create_response = client.post(
        "/products/",
        json={
            "name": "Delete Me",
            "description": "Test",
            "price": 50000
        }
    )

    product_id = create_response.json()["id"]

    delete_response = client.delete(f"/products/{product_id}")
    assert delete_response.status_code == 200

    get_response = client.get(f"/products/{product_id}")
    assert get_response.status_code == 404