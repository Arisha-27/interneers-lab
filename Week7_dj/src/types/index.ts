export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  description: string;
  details: string[];
  dimensions: string;
  material: string;
  sku: string;
  inStock: boolean;
}

export type NavItem = {
  label: string;
  href: string;
};