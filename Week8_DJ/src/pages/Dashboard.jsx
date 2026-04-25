import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { PageSpinner } from '../components/Spinner.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import PageHeader from '../components/PageHeader.jsx';

function StatCard({ label, value, sub, color = 'var(--accent)', icon }) {
  return (
    <div style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 3,
        background: color,
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{sub}</p>}
        </div>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { categories, products, loading, errors, fetchCategories, fetchProducts } = useStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const outOfStock = products.filter(p => p.stock === 0).length;
  const activeProducts = products.filter(p => p.status === 'active').length;

  if (loading.categories && loading.products) return <PageSpinner />;

  return (
    <div className="page-enter" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <PageHeader
        title="Dashboard"
        subtitle={`Overview of your product catalogue`}
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
            transition: 'background var(--transition)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Add Product
          </Link>
        }
      />


      <div style={{
        position: 'relative',
        height: 220,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: 32,
        background: '#000',
        border: '1px solid var(--border)',
      }}>
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop" 
          alt="Dashboard Hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(13,13,15,0.9) 0%, rgba(13,13,15,0.4) 50%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 40px',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Inventory Intelligence
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 450, lineHeight: 1.5 }}>
            Master your supply chain with real-time analytics 
            and professional catalog management tools.
          </p>
        </div>
      </div>

      {(errors.categories || errors.products) && (
        <ErrorAlert message={errors.categories || errors.products} style={{ marginBottom: 24 }} />
      )}


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
        <StatCard label="Total Products"    value={products.length}               color="var(--accent)"  icon="📦" />
        <StatCard label="Active Products"   value={activeProducts}                color="var(--green)"   icon="✅" sub={`${products.length - activeProducts} inactive`} />
        <StatCard label="Categories"        value={categories.length}             color="var(--yellow)"  icon="🗂" />
        <StatCard label="Out of Stock"      value={outOfStock}                    color="var(--red)"     icon="⚠️" sub={outOfStock > 0 ? 'Needs restocking' : 'All stocked'} />
        <StatCard label="Catalogue Value"   value={`€${totalValue.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} color="#3b9eff" icon="💰" />
      </div>


      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Categories</h2>
          <Link to="/categories" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {categories.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <Link key={cat.id} to={`/categories/${cat.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg-2)',
                  border: `1px solid var(--border)`,
                  borderRadius: 'var(--radius)',
                  padding: '16px',
                  transition: 'all var(--transition)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  height: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + '60'; e.currentTarget.style.background = 'var(--bg-3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
                >
                  {cat.image && (
                    <img 
                      src={cat.image} 
                      alt="" 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.1,
                        filter: 'grayscale(100%) brightness(0.5)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 32, height: 32,
                        borderRadius: 8,
                        background: `${cat.color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                      }}>
                        {cat.icon}
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                        {cat.name}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', position: 'relative', zIndex: 1 }}>
                    <span style={{ color: cat.color, fontWeight: 700, fontSize: 18, fontFamily: 'var(--font-display)' }}>{count}</span>
                    {' '}product{count !== 1 ? 's' : ''}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>


      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Recent Products</h2>
          <Link to="/products" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}>
          {products.slice(0, 6).map((product, i) => {
            const cat = categories.find(c => c.id === product.categoryId);
            return (
              <Link key={product.id} to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 20px',
                  borderBottom: i < Math.min(products.length - 1, 5) ? '1px solid var(--border)' : 'none',
                  transition: 'background var(--transition)',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{
                        width: 36, height: 36,
                        borderRadius: 7,
                        objectFit: 'cover',
                        flexShrink: 0,
                        border: '1px solid var(--border)',
                      }}
                    />
                  ) : cat && (
                    <div style={{
                      width: 36, height: 36,
                      borderRadius: 7,
                      background: `${cat.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {cat.icon}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>
                      {cat?.name || 'Uncategorised'} · SKU: {product.sku || '—'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
                      €{Number(product.price).toFixed(2)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>
                      {product.stock} in stock
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
