import React from 'react';
import ProductCard from './ProductCard.jsx';
import { PageSpinner } from './Spinner.jsx';

export default function ProductList({ products, categories = [], loading, emptyMessage = 'No products found.' }) {
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  if (loading) return <PageSpinner />;

  if (!products.length) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 24px',
        color: 'var(--text-3)',
        fontSize: 14,
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-2)' }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    }}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          category={catMap[product.categoryId]}
        />
      ))}
    </div>
  );
}
