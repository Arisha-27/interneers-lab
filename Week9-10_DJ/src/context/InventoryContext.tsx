import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '../types';

const SAMPLE_PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Headphones', category: 'Electronics', price: 89.99, quantity: 45, description: 'Premium wireless headphones with noise cancellation', sku: 'ELEC-001', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', createdAt: '2024-01-10', updatedAt: '2024-01-10' },
  { id: '2', name: 'USB-C Hub', category: 'Electronics', price: 39.99, quantity: 8, description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader', sku: 'ELEC-002', imageUrl: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=800&q=80', createdAt: '2024-01-11', updatedAt: '2024-01-11' },
  { id: '3', name: 'Mechanical Keyboard', category: 'Electronics', price: 129.99, quantity: 22, description: 'Compact mechanical keyboard with RGB backlight', sku: 'ELEC-003', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', createdAt: '2024-01-12', updatedAt: '2024-01-12' },
  { id: '4', name: 'Ergonomic Chair', category: 'Furniture', price: 349.99, quantity: 5, description: 'Adjustable ergonomic office chair with lumbar support', sku: 'FURN-001', imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80', createdAt: '2024-01-13', updatedAt: '2024-01-13' },
  { id: '5', name: 'Standing Desk', category: 'Furniture', price: 499.99, quantity: 3, description: 'Electric height-adjustable standing desk', sku: 'FURN-002', imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80', createdAt: '2024-01-14', updatedAt: '2024-01-14' },
  { id: '6', name: 'Desk Lamp', category: 'Furniture', price: 49.99, quantity: 17, description: 'LED desk lamp with adjustable brightness', sku: 'FURN-003', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a22fd0d5c?w=800&q=80', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '7', name: 'Yoga Mat', category: 'Sports', price: 29.99, quantity: 60, description: 'Non-slip yoga mat with alignment lines', sku: 'SPRT-001', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', createdAt: '2024-01-16', updatedAt: '2024-01-16' },
  { id: '8', name: 'Resistance Bands', category: 'Sports', price: 19.99, quantity: 4, description: 'Set of 5 resistance bands for strength training', sku: 'SPRT-002', imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80', createdAt: '2024-01-17', updatedAt: '2024-01-17' },
  { id: '9', name: 'Protein Powder', category: 'Food', price: 54.99, quantity: 2, description: 'Whey protein isolate, 5lb tub', sku: 'FOOD-001', imageUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800&q=80', createdAt: '2024-01-18', updatedAt: '2024-01-18' },
  { id: '10', name: 'Python Crash Course', category: 'Books', price: 29.99, quantity: 34, description: 'Beginner programming book for Python', sku: 'BOOK-001', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80', createdAt: '2024-01-19', updatedAt: '2024-01-19' },
  { id: '11', name: 'Design Thinking Guide', category: 'Books', price: 24.99, quantity: 11, description: 'Practical guide to design thinking methodology', sku: 'BOOK-002', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80', createdAt: '2024-01-20', updatedAt: '2024-01-20' },
  { id: '12', name: 'Notebook Set', category: 'Stationery', price: 14.99, quantity: 7, description: 'Pack of 3 premium ruled notebooks', sku: 'STAT-001', imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80', createdAt: '2024-01-21', updatedAt: '2024-01-21' },
  { id: '13', name: 'Ballpoint Pens (12pk)', category: 'Stationery', price: 9.99, quantity: 50, description: '12-pack of smooth ballpoint pens', sku: 'STAT-002', imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80', createdAt: '2024-01-22', updatedAt: '2024-01-22' },
  { id: '14', name: 'Monitor 27"', category: 'Electronics', price: 279.99, quantity: 9, description: '4K IPS monitor with USB-C connectivity', sku: 'ELEC-004', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', createdAt: '2024-01-23', updatedAt: '2024-01-23' },
  { id: '15', name: 'Wireless Mouse', category: 'Electronics', price: 49.99, quantity: 6, description: 'Ergonomic wireless mouse with long battery life', sku: 'ELEC-005', imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', createdAt: '2024-01-24', updatedAt: '2024-01-24' },
  { id: '16', name: 'Smart Watch', category: 'Electronics', price: 199.99, quantity: 15, description: 'Fitness tracking smart watch with heart rate monitor', sku: 'ELEC-006', imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', createdAt: '2024-02-01', updatedAt: '2024-02-01' },
  { id: '17', name: 'Coffee Beans 1kg', category: 'Food', price: 22.99, quantity: 40, description: 'Medium roast arabica coffee beans', sku: 'FOOD-002', imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&q=80', createdAt: '2024-02-02', updatedAt: '2024-02-02' },
  { id: '18', name: 'Denim Jacket', category: 'Clothing', price: 79.99, quantity: 12, description: 'Classic blue denim jacket, unisex', sku: 'CLOT-001', imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80', createdAt: '2024-02-03', updatedAt: '2024-02-03' },
  { id: '19', name: 'Running Shoes', category: 'Clothing', price: 119.99, quantity: 24, description: 'Lightweight breathable running shoes', sku: 'CLOT-002', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', createdAt: '2024-02-04', updatedAt: '2024-02-04' },
  { id: '20', name: 'Bookshelf', category: 'Furniture', price: 159.99, quantity: 8, description: '5-tier wooden bookshelf', sku: 'FURN-004', imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80', createdAt: '2024-02-05', updatedAt: '2024-02-05' },
];

interface InventoryContextType {
  products: Product[];
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);

  const addProduct = useCallback((p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    setProducts(prev => [...prev, { ...p, id: crypto.randomUUID(), createdAt: now, updatedAt: now }]);
  }, []);

  const updateProduct = useCallback((id: string, p: Partial<Product>) => {
    setProducts(prev => prev.map(prod => prod.id === id ? { ...prod, ...p, updatedAt: new Date().toISOString().split('T')[0] } : prod));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProduct = useCallback((id: string) => products.find(p => p.id === id), [products]);

  return (
    <InventoryContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
};