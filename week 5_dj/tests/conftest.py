import pytest
import mongomock
from main import create_app


@pytest.fixture
def mock_db():
    """In-memory MongoDB for integration tests. Wiped after each test."""
    client = mongomock.MongoClient()
    db = client["test_db"]
    yield db
    client.drop_database("test_db")


@pytest.fixture
def test_app(mock_db):
    """Flask test app wired to the in-memory MongoDB."""
    app = create_app(db=mock_db)
    app.config["TESTING"] = True
    return app


@pytest.fixture
def client(test_app):
    """Flask test client — sends HTTP requests without a real server."""
    return test_app.test_client()