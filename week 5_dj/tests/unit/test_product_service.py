import pytest
from unittest.mock import MagicMock
from app.services.product_service import ProductService
from app.models.product import Product


@pytest.fixture
def mock_repo():
    return MagicMock()


@pytest.fixture
def service(mock_repo):
    return ProductService(mock_repo)


def make_product(**kwargs):
    defaults = dict(id="1", name="Laptop", price=999.99, category_id="cat1", stock=10)
    defaults.update(kwargs)
    return Product(**defaults)


class TestGetAllProducts:
    def test_returns_all_products(self, service, mock_repo):
        mock_repo.find_all.return_value = [make_product(), make_product(id="2")]
        result = service.get_all_products()
        assert len(result) == 2

    def test_returns_empty_when_none(self, service, mock_repo):
        mock_repo.find_all.return_value = []
        assert service.get_all_products() == []


class TestGetProductById:
    def test_returns_product(self, service, mock_repo):
        mock_repo.find_by_id.return_value = make_product()
        result = service.get_product_by_id("1")
        assert result.name == "Laptop"

    def test_raises_when_not_found(self, service, mock_repo):
        mock_repo.find_by_id.return_value = None
        with pytest.raises(ValueError, match="not found"):
            service.get_product_by_id("bad_id")


class TestCreateProduct:
    @pytest.mark.parametrize(
        "name, price, stock",
        [
            ("Laptop", 999.99, 10),
            ("Free Item", 0.0, 0),
            ("Cheap", 0.01, 1000),
        ],
    )
    def test_creates_with_valid_data(self, service, mock_repo, name, price, stock):
        mock_repo.create.return_value = make_product(name=name, price=price, stock=stock)
        result = service.create_product(name, price, "cat1", stock)
        assert result is not None
        mock_repo.create.assert_called_once()

    @pytest.mark.parametrize("invalid_name", ["", "   "])
    def test_raises_on_empty_name(self, service, mock_repo, invalid_name):
        with pytest.raises(ValueError, match="cannot be empty"):
            service.create_product(invalid_name, 10.0, "cat1", 5)

    @pytest.mark.parametrize("bad_price", [-0.01, -100, -999])
    def test_raises_on_negative_price(self, service, mock_repo, bad_price):
        with pytest.raises(ValueError, match="Price cannot be negative"):
            service.create_product("Laptop", bad_price, "cat1", 5)

    @pytest.mark.parametrize("bad_stock", [-1, -50])
    def test_raises_on_negative_stock(self, service, mock_repo, bad_stock):
        with pytest.raises(ValueError, match="Stock cannot be negative"):
            service.create_product("Laptop", 10.0, "cat1", bad_stock)


class TestUpdateProduct:
    def test_updates_price_successfully(self, service, mock_repo):
        mock_repo.find_by_id.return_value = make_product()
        mock_repo.update.return_value = True
        result = service.update_product("1", {"price": 799.99})
        assert result is True

    def test_raises_on_negative_price_update(self, service, mock_repo):
        mock_repo.find_by_id.return_value = make_product()
        with pytest.raises(ValueError, match="Price cannot be negative"):
            service.update_product("1", {"price": -1})

    def test_raises_on_no_valid_fields(self, service, mock_repo):
        mock_repo.find_by_id.return_value = make_product()
        with pytest.raises(ValueError, match="No valid fields"):
            service.update_product("1", {"bad_field": "x"})


class TestDeleteProduct:
    def test_deletes_successfully(self, service, mock_repo):
        mock_repo.find_by_id.return_value = make_product()
        mock_repo.delete.return_value = True
        assert service.delete_product("1") is True

    def test_raises_when_not_found(self, service, mock_repo):
        mock_repo.find_by_id.return_value = None
        with pytest.raises(ValueError):
            service.delete_product("bad_id")