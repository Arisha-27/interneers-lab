import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import ProductList from '../components/ProductList.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

export default function ProductsPage() {
  const { products, categories, loading, errors, fetchProducts, fetchCategories, clearError } = useStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchProducts();
    if (!categories.length) fetchCategories();
  }, []);

  const filtered = products.filter(p => {
    const matchSearch  = !search       || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !filterCat    || p.categoryId === filterCat;
    const matchStatus = !filterStatus || p.status === filterStatus || (filterStatus === 'out_of_stock' && p.stock === 0);
    return matchSearch && matchCat && matchStatus;
  });

  const selectStyle = {
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 12px',
    color: 'var(--text)',
    fontSize: 13,
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  };

  return (
    <div className="page-enter" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Products' }]}
        title="Products"
        subtitle={`${products.length} total products across ${categories.length} categories`}
        actions={
          <Link to="/products/new" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '10px 20px',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Add Product
          </Link>
        }
      />

      {errors.products && (
        <div style={{ marginBottom: 24 }}>
          <ErrorAlert message={errors.products} onDismiss={() => clearError('products')} />
        </div>
      )}

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 24,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ flex: '1 1 220px', position: 'relative' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}>
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or SKU…"
            style={{
              ...selectStyle,
              width: '100%',
              paddingLeft: 34,
            }}
          />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={selectStyle}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        {(search || filterCat || filterStatus) && (
          <button
            onClick={() => { setSearch(''); setFilterCat(''); setFilterStatus(''); }}
            style={{
              padding: '8px 12px',
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-2)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}
        <span style={{ fontSize: 13, color: 'var(--text-3)', marginLeft: 'auto' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <ProductList
        products={filtered}
        categories={categories}
        loading={loading.products}
        emptyMessage={search || filterCat || filterStatus ? 'No products match your filters.' : 'No products yet. Add one!'}
      />
    </div>
  );
}
