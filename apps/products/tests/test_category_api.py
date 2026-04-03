import pytest
import io

@pytest.mark.django_db
def test_create_category(api_client):

    response = api_client.post(
        "/api/categories/",
        {
            "title": "Food",
            "description": "Food items"
        },
        format="json"
    )

    assert response.status_code == 201
    assert "id" in response.data


@pytest.mark.django_db
def test_get_categories(api_client):

    response = api_client.get("/api/categories/")

    assert response.status_code == 200
    assert isinstance(response.data, list)
@pytest.mark.django_db
def test_create_product(api_client):

    response = api_client.post(
        "/api/products/",
        {
            "name": "Milk",
            "price": 25,
            "brand": "Amul"
        },
        format="json"
    )

    assert response.status_code == 201
    assert "id" in response.data


@pytest.mark.django_db
def test_product_requires_brand(api_client):

    response = api_client.post(
        "/api/products/",
        {
            "name": "Milk",
            "price": 25
        },
        format="json"
    )

    assert response.status_code == 400

@pytest.mark.django_db
def test_add_product_to_category(api_client):

    category = api_client.post(
        "/api/categories/",
        {"title": "Food"},
        format="json"
    ).data

    product = api_client.post(
        "/api/products/",
        {"name": "Milk", "price": 25, "brand": "Amul"},
        format="json"
    ).data

    response = api_client.post(
        "/api/products/add-to-category/",
        {
            "product_id": product["id"],
            "category_id": category["id"]
        },
        format="json"
    )

    assert response.status_code == 200


@pytest.mark.django_db
def test_remove_product_from_category(api_client):

    product = api_client.post(
        "/api/products/",
        {"name": "Milk", "price": 25, "brand": "Amul"},
        format="json"
    ).data

    response = api_client.post(
        "/api/products/remove-from-category/",
        {"product_id": product["id"]},
        format="json"
    )

    assert response.status_code == 200
@pytest.mark.django_db
def test_bulk_upload(api_client):

    csv_data = "name,price,brand\nMilk,20,Amul\nBread,30,Britannia"

    file = io.BytesIO(csv_data.encode())
    file.name = "test.csv"

    response = api_client.post(
        "/api/products/bulk-upload/",
        {"file": file},
        format="multipart"
    )

    assert response.status_code == 200
    assert response.data["created"] == 2

@pytest.mark.django_db
def test_filter_products(api_client):

    api_client.post(
        "/api/products/",
        {"name": "Milk", "price": 20, "brand": "Amul"},
        format="json"
    )

    api_client.post(
        "/api/products/",
        {"name": "Bread", "price": 50, "brand": "Britannia"},
        format="json"
    )

    response = api_client.post(
        "/api/products/filter/",
        {"min_price": 10, "max_price": 30},
        format="json"
    )

    assert response.status_code == 200
    assert len(response.data) >= 1
