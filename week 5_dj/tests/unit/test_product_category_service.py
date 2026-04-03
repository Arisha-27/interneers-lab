import pytest
from unittest.mock import MagicMock
from app.services.product_category_service import ProductCategoryService
from app.models.product_category import ProductCategory


@pytest.fixture
def mock_repo():
    return MagicMock()


@pytest.fixture
def service(mock_repo):
    return ProductCategoryService(mock_repo)


class TestGetAllCategories:
    def test_returns_all_categories(self, service, mock_repo):
        mock_repo.find_all.return_value = [
            ProductCategory(id="1", name="Electronics", description="Gadgets"),
            ProductCategory(id="2", name="Books", description="Reading"),
        ]
        result = service.get_all_categories()
        assert len(result) == 2
        mock_repo.find_all.assert_called_once()

    def test_returns_empty_list_when_no_categories(self, service, mock_repo):
        mock_repo.find_all.return_value = []
        result = service.get_all_categories()
        assert result == []


class TestGetCategoryById:
    def test_returns_category_when_found(self, service, mock_repo):
        mock_repo.find_by_id.return_value = ProductCategory(
            id="abc", name="Electronics", description="Gadgets"
        )
        result = service.get_category_by_id("abc")
        assert result.name == "Electronics"
        mock_repo.find_by_id.assert_called_once_with("abc")

    def test_raises_when_not_found(self, service, mock_repo):
        mock_repo.find_by_id.return_value = None
        with pytest.raises(ValueError, match="not found"):
            service.get_category_by_id("nonexistent")


class TestCreateCategory:
    @pytest.mark.parametrize(
        "name, description",
        [
            ("Electronics", "Gadgets and devices"),
            ("Books", ""),
            ("  Trimmed Name  ", "Some description"),
        ],
    )
    def test_creates_category_with_valid_data(
        self, service, mock_repo, name, description
    ):
        mock_repo.create.return_value = ProductCategory(
            id="new_id", name=name.strip(), description=description.strip()
        )
        result = service.create_category(name, description)
        assert result.id == "new_id"
        mock_repo.create.assert_called_once()

    @pytest.mark.parametrize("invalid_name", ["", "   ", None])
    def test_raises_on_empty_name(self, service, mock_repo, invalid_name):
        with pytest.raises(ValueError, match="cannot be empty"):
            service.create_category(invalid_name or "", "desc")
        mock_repo.create.assert_not_called()

    def test_strips_whitespace_from_name(self, service, mock_repo):
        mock_repo.create.return_value = ProductCategory(
            id="1", name="Electronics", description="desc"
        )
        service.create_category("  Electronics  ", "desc")
        call_args = mock_repo.create.call_args[0][0]
        assert call_args.name == "Electronics"


class TestUpdateCategory:
    def test_updates_successfully(self, service, mock_repo):
        mock_repo.find_by_id.return_value = ProductCategory(
            id="1", name="Old Name", description="Old"
        )
        mock_repo.update.return_value = True
        result = service.update_category("1", {"name": "New Name"})
        assert result is True

    def test_raises_on_no_valid_fields(self, service, mock_repo):
        mock_repo.find_by_id.return_value = ProductCategory(
            id="1", name="Name", description="Desc"
        )
        with pytest.raises(ValueError, match="No valid fields"):
            service.update_category("1", {"invalid_field": "value"})

    def test_raises_when_category_not_found(self, service, mock_repo):
        mock_repo.find_by_id.return_value = None
        with pytest.raises(ValueError):
            service.update_category("bad_id", {"name": "New"})


class TestDeleteCategory:
    def test_deletes_successfully(self, service, mock_repo):
        mock_repo.find_by_id.return_value = ProductCategory(
            id="1", name="Name", description="Desc"
        )
        mock_repo.delete.return_value = True
        result = service.delete_category("1")
        assert result is True

    def test_raises_when_not_found(self, service, mock_repo):
        mock_repo.find_by_id.return_value = None
        with pytest.raises(ValueError):
            service.delete_category("bad_id")