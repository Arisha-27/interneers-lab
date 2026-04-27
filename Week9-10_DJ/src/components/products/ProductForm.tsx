import React, { useState, useEffect } from 'react';
import { Product } from '../../types';

const CATEGORIES = ['Electronics', 'Furniture', 'Sports', 'Books', 'Stationery', 'Clothing', 'Food', 'Other'];

interface Props {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const empty = { name: '', category: CATEGORIES[0], price: 0, quantity: 0, description: '', sku: '', imageUrl: '' };

const ProductForm: React.FC<Props> = ({ product, onSubmit, onCancel }) => {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (product) setForm({ name: product.name, category: product.category, price: product.price, quantity: product.quantity, description: product.description, sku: product.sku, imageUrl: product.imageUrl || '' });
  }, [product]);

  const set = (field: string, value: string | number) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Product Name *</label>
          <input data-testid="product-name" className="w-full px-4 py-2.5 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 placeholder-dark-500 transition-all shadow-inner" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Enter name" />
        </div>
        <div>
          <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">SKU *</label>
          <input data-testid="product-sku" className="w-full px-4 py-2.5 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 placeholder-dark-500 transition-all shadow-inner" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. ELEC-001" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Category *</label>
          <div className="relative">
            <select data-testid="product-category" className="appearance-none w-full px-4 py-2.5 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 cursor-pointer transition-all shadow-inner" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Price ($) *</label>
          <input data-testid="product-price" type="number" min="0" step="0.01" className="w-full px-4 py-2.5 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 placeholder-dark-500 transition-all shadow-inner" value={form.price} onChange={e => set('price', parseFloat(e.target.value) || 0)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Quantity *</label>
          <input data-testid="product-quantity" type="number" min="0" className="w-full px-4 py-2.5 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 placeholder-dark-500 transition-all shadow-inner" value={form.quantity} onChange={e => set('quantity', parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Image URL</label>
          <input className="w-full px-4 py-2.5 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 placeholder-dark-500 transition-all shadow-inner" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-dark-400 uppercase tracking-wider mb-2">Description</label>
        <textarea data-testid="product-description" rows={3} className="w-full px-4 py-2.5 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 placeholder-dark-500 transition-all shadow-inner resize-none" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product description..." />
      </div>
      <div className="flex gap-3 pt-4 border-t border-dark-700/50 mt-6">
        <button onClick={onCancel} className="flex-1 py-3 bg-dark-800 hover:bg-dark-700 text-dark-100 rounded-xl font-medium transition-colors border border-dark-700/50">Cancel</button>
        <button onClick={() => form.name && form.sku && onSubmit(form)} className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-all shadow-glow" data-testid="submit-product">
          {product ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;