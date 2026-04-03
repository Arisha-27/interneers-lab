import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()