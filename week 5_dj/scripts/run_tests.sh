#!/bin/bash

set -e

echo "========================================="
echo " Running Full Test Suite + Coverage"
echo "========================================="

echo ""
echo ">>> Unit Tests"
pytest tests/unit/ -v

echo ""
echo ">>> Integration Tests"
pytest tests/integration/ -v

echo ""
echo ">>> Full Suite with Coverage Report"
pytest --cov=app --cov-report=term-missing --cov-fail-under=80

echo ""
echo "========================================="
echo " All tests passed."
echo "========================================="