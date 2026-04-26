import { Product, PriceRange, PRICE_RANGES } from '../types/index';

export function getCategoryProductCounts(products: Product[]): Record<string, number> {
  return products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getProductsByPriceRange(products: Product[]): Record<string, Record<string, number>> {
  const categories = [...new Set(products.map(p => p.category))];
  const result: Record<string, Record<string, number>> = {};
  categories.forEach(cat => {
    result[cat] = {};
    PRICE_RANGES.forEach((range: PriceRange) => {
      result[cat][range.label] = products.filter(
        p => p.category === cat && p.price >= range.min && p.price < range.max
      ).length;
    });
  });
  return result;
}

export function getLowStockProducts(products: Product[], threshold: number): Product[] {
  return products.filter(p => p.quantity < threshold);
}

export function getLowStockCategories(products: Product[], threshold: number) {
  const categories = [...new Set(products.map(p => p.category))];
  return categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const lowCount = catProducts.filter(p => p.quantity < threshold).length;
    const percentage = (lowCount / catProducts.length) * 100;
    return { category: cat, total: catProducts.length, lowCount, percentage };
  }).filter(c => c.percentage > 10).sort((a, b) => b.percentage - a.percentage);
}
