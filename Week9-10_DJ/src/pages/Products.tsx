import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import ProductCard from '../components/products/ProductCard';
import ProductForm from '../components/products/ProductForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Product } from '../types';
import { Plus, Search, Filter, Package } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Sports', 'Books', 'Stationery', 'Clothing', 'Food', 'Other'];

const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useInventory();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity'>('name');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();

  const filtered = useMemo(() => {
    return products
      .filter(p => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'quantity') return a.quantity - b.quantity;
        return a.name.localeCompare(b.name);
      });
  }, [products, search, category, sortBy]);

  const handleSubmit = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editing) updateProduct(editing.id, data);
    else addProduct(data);
    setShowForm(false);
    setEditing(undefined);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-dark-100">Product Inventory</h2>
          <p className="text-dark-400 text-sm mt-1">{filtered.length} of {products.length} products</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-all shadow-glow" onClick={() => { setEditing(undefined); setShowForm(true); }} data-testid="add-product-btn">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="glass-panel p-4 rounded-2xl flex flex-wrap gap-4 items-center border-dark-700/50">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
          <input data-testid="search-input" type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 placeholder-dark-500 transition-all shadow-inner" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="appearance-none pl-10 pr-8 py-2.5 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 cursor-pointer hover:border-dark-600 transition-all shadow-inner">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <div className="relative">
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="appearance-none pl-4 pr-8 py-2.5 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 cursor-pointer hover:border-dark-600 transition-all shadow-inner">
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="quantity">Sort by Quantity</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl flex flex-col items-center justify-center py-24 px-4 text-center border-dashed border-2 border-dark-700">
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-6 shadow-lg border border-dark-700">
            <Package size={32} className="text-dark-500" />
          </div>
          <h3 className="text-xl font-bold text-dark-100 mb-2">No products found</h3>
          <p className="text-dark-400 max-w-sm">We couldn't find any products matching your current search and filter criteria.</p>
          {(search || category !== 'All') && (
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-6 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-dark-100 rounded-lg text-sm font-medium transition-colors border border-dark-600">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onEdit={p => { setEditing(p); setShowForm(true); }} onDelete={deleteProduct} />
          ))}
        </div>
      )}

      {showForm && (
        <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditing(undefined); }} title={editing ? 'Edit Product' : 'Add New Product'} size="lg">
          <ProductForm product={editing} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditing(undefined); }} />
        </Modal>
      )}
    </div>
  );
};

export default Products;