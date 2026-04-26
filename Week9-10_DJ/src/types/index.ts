export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  sku: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export type PriceRange = {
  label: string;
  min: number;
  max: number;
};

export const PRICE_RANGES: PriceRange[] = [
  { label: '$0–$25', min: 0, max: 25 },
  { label: '$25–$50', min: 25, max: 50 },
  { label: '$50–$100', min: 50, max: 100 },
  { label: '$100–$250', min: 100, max: 250 },
  { label: '$250–$500', min: 250, max: 500 },
  { label: '$500+', min: 500, max: Infinity },
];

export interface ReportFilter {
  minCount?: number;
  maxCount?: number;
  lowStockThreshold?: number;
}
