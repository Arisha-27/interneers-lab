import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_get_existing_user():
    response = client.get("/users/1")
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "success"
    assert data["data"]["id"] == 1
    assert data["data"]["name"] == "Arisha"
    assert data["data"]["role"] == "RippIntern"


def test_user_not_found():
    response = client.get("/users/999")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


def test_invalid_user_id():
    response = client.get("/users/0")
    
    assert response.status_code == 400
    assert response.json()["detail"] == "User ID must be a positive integer."