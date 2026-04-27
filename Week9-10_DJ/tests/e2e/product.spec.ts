import { test, expect } from '@playwright/test';

test.describe('Product CRUD - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByTestId('add-product-btn')).toBeVisible();
  });

  test('Create a new product', async ({ page }) => {
    await page.getByTestId('add-product-btn').click();
    await expect(page.getByText('Add New Product')).toBeVisible();

    await page.getByTestId('product-name').fill('Test Laptop Pro');
    await page.getByTestId('product-sku').fill('TEST-001');
    await page.getByTestId('product-category').selectOption('Electronics');
    await page.getByTestId('product-price').fill('999.99');
    await page.getByTestId('product-quantity').fill('25');
    await page.getByTestId('product-description').fill('A high-performance test laptop');

    await page.getByTestId('submit-product').click();
    await expect(page.getByText('Add New Product')).not.toBeVisible();
    await expect(page.getByText('Test Laptop Pro')).toBeVisible();
  });

  test('Edit an existing product', async ({ page }) => {
    // Create first
    await page.getByTestId('add-product-btn').click();
    await page.getByTestId('product-name').fill('Edit Me Product');
    await page.getByTestId('product-sku').fill('EDIT-001');
    await page.getByTestId('product-price').fill('49.99');
    await page.getByTestId('product-quantity').fill('10');
    await page.getByTestId('submit-product').click();

    // Find and click edit
    const card = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Edit Me Product' });
    await expect(card).toBeVisible();
    const editBtn = card.locator('[data-testid^="edit-"]');
    await editBtn.click();

    await expect(page.getByRole('heading', { name: 'Edit Product', exact: true })).toBeVisible();
    await page.getByTestId('product-name').fill('Edited Product Name');
    await page.getByTestId('product-price').fill('79.99');
    await page.getByTestId('submit-product').click();

    await expect(page.getByText('Edited Product Name')).toBeVisible();
    await expect(page.getByText('Edit Me Product')).not.toBeVisible();
  });

  test('View product detail page', async ({ page }) => {
    // Create a product
    await page.getByTestId('add-product-btn').click();
    await page.getByTestId('product-name').fill('Detail View Product');
    await page.getByTestId('product-sku').fill('DETAIL-001');
    await page.getByTestId('product-price').fill('199.99');
    await page.getByTestId('product-quantity').fill('15');
    await page.getByTestId('product-description').fill('Detailed description here');
    await page.getByTestId('submit-product').click();

    // Click View
    const card = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Detail View Product' });
    await card.getByRole('button', { name: 'View', exact: true }).click();

    await expect(page.url()).toContain('/products/');
    await expect(page.getByText('Detail View Product')).toBeVisible();
    await expect(page.getByText('$199.99')).toBeVisible();
    await expect(page.getByText('Detailed description here')).toBeVisible();
    await expect(page.getByText('DETAIL-001').first()).toBeVisible();
  });

  test('Edit product from detail page and verify changes', async ({ page }) => {
    // Create
    await page.getByTestId('add-product-btn').click();
    await page.getByTestId('product-name').fill('Full Flow Product');
    await page.getByTestId('product-sku').fill('FULL-001');
    await page.getByTestId('product-price').fill('59.99');
    await page.getByTestId('product-quantity').fill('5');
    await page.getByTestId('submit-product').click();

    // View detail
    const card = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Full Flow Product' });
    await card.getByText('View').click();
    await expect(page.url()).toContain('/products/');

    // Edit from detail
    await page.getByTestId('detail-edit-btn').click();
    await expect(page.getByRole('heading', { name: 'Edit Product', exact: true })).toBeVisible();
    await page.getByTestId('product-name').fill('Updated Full Flow Product');
    await page.getByTestId('product-quantity').fill('50');
    await page.getByTestId('submit-product').click();

    await expect(page.getByText('Updated Full Flow Product')).toBeVisible();
    await expect(page.getByText('50')).toBeVisible();
  });

  test('Search filters products correctly', async ({ page }) => {
    await page.getByTestId('search-input').fill('Wireless Headphones');
    await expect(page.getByText('Wireless Headphones')).toBeVisible();
    await expect(page.getByText('USB-C Hub')).not.toBeVisible();
  });

  test('Navigate to Reports and export CSV', async ({ page }) => {
    await page.goto('/reports');
    await expect(page.getByText('Inventory Reports')).toBeVisible();
    await expect(page.getByText('Category Count')).toBeVisible();
    await expect(page.getByText('Price Distribution')).toBeVisible();
    await expect(page.getByText('Low Stock')).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /export csv/i }).first().click(),
    ]);
    expect(download.suggestedFilename()).toContain('.csv');
  });
});