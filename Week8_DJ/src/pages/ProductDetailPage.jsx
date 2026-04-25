import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { PageSpinner } from '../components/Spinner.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ProductForm from '../components/ProductForm.jsx';
import MoveCategoryModal from '../components/MoveCategoryModal.jsx';
import { ConfirmModal } from '../components/Modal.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import Button from '../components/Button.jsx';
import { productApi } from '../utils/api.js';

function InfoRow({ label, value, accent }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 14, color: accent || 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, loading, errors, updateProduct, deleteProduct, moveProduct, fetchCategories, clearError } = useStore();

  const [product, setProduct] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!categories.length) fetchCategories();
    loadProduct();
  }, [id]);

  async function loadProduct() {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const p = await productApi.get(id);
      setProduct(p);
    } catch (e) {
      setFetchError(e.message);
    } finally {
      setFetchLoading(false);
    }
  }

  const handleUpdate = async (data) => {
    try {
      const updated = await updateProduct(id, data);
      setProduct(updated);
      setEditing(false);
    } catch (_) {}
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      navigate('/products');
    } catch (_) {}
  };

  const handleMove = async (newCategoryId) => {
    try {
      const updated = await moveProduct(id, newCategoryId);
      setProduct(updated);
      setShowMove(false);
    } catch (_) {}
  };

  if (fetchLoading) return <PageSpinner />;

  if (fetchError) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px' }}>
        <ErrorAlert message={fetchError} />
        <Link to="/products" style={{ display: 'block', marginTop: 16, color: 'var(--accent)', fontSize: 14 }}>← Back to Products</Link>
      </div>
    );
  }

  if (!product) return null;

  const category = categories.find(c => c.id === product.categoryId);
  const stockColor = product.stock === 0 ? 'var(--red)' : product.stock < 10 ? 'var(--yellow)' : 'var(--green)';
  const accentColor = category?.color || 'var(--accent)';

  return (
    <div className="page-enter" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Products', to: '/products' },
          ...(category ? [{ label: category.name, to: `/categories/${category.id}` }] : []),
          { label: product.name },
        ]}
        title={product.name}
        subtitle={product.sku ? `SKU: ${product.sku}` : undefined}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" onClick={() => setShowMove(true)} size="sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l4 4-4 4M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Move
            </Button>
            <Button variant="ghost" onClick={() => { setEditing(true); clearError('action'); }} size="sm">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 9.5L9.5 2l1.5 1.5L3.5 11H2V9.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
              Edit
            </Button>
            <Button variant="danger" onClick={() => setShowDelete(true)} size="sm">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5M5.5 6v3.5M7.5 6v3.5M3 3.5l.5 7.5h6L10 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Delete
            </Button>
          </div>
        }
      />

      {errors.action && !editing && (
        <div style={{ marginBottom: 24 }}>
          <ErrorAlert message={errors.action} onDismiss={() => clearError('action')} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        <div>
          {editing ? (
            <div style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
            }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 24, color: 'var(--text)' }}>
                Edit Product
              </h2>
              <ProductForm
                initial={product}
                categories={categories}
                onSubmit={handleUpdate}
                onCancel={() => { setEditing(false); clearError('action'); }}
                loading={loading.action}
                error={errors.action}
                submitLabel="Save Changes"
              />
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}>

              <div style={{
                height: 6,
                background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60)`,
              }} />
              <div style={{ padding: 28 }}>

                {product.image && (
                  <div style={{
                    margin: '-28px -28px 28px -28px',
                    height: 400,
                    background: 'var(--bg-3)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'var(--bg-3)' }} 
                    />
                  </div>
                )}
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>
                  Product Details
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>All information about this product</p>

                {product.description && (
                  <div style={{
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px 16px',
                    marginBottom: 20,
                    fontSize: 14,
                    color: 'var(--text-2)',
                    lineHeight: 1.6,
                  }}>
                    {product.description}
                  </div>
                )}

                <InfoRow label="Name"   value={product.name} />
                {product.sku && <InfoRow label="SKU" value={product.sku} />}
                <InfoRow label="Status" value={product.status === 'active' ? 'Active' : 'Inactive'}
                  accent={product.status === 'active' ? 'var(--green)' : 'var(--text-3)'} />
                <InfoRow label="Price"  value={`€${Number(product.price).toFixed(2)}`} accent="var(--text)" />
                <InfoRow label="Stock"  value={`${product.stock} units`} accent={stockColor} />
                <InfoRow label="Category" value={
                  category ? (
                    <Link to={`/categories/${category.id}`} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: category.color,
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 500,
                    }}>
                      {category.icon} {category.name}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Link>
                  ) : '—'
                } />
              </div>
            </div>
          )}
        </div>


        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Price</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
              €{Number(product.price).toFixed(2)}
            </p>
          </div>


          <div style={{
            background: 'var(--bg-2)',
            border: `1px solid ${stockColor}30`,
            borderRadius: 'var(--radius)',
            padding: '20px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Stock</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: stockColor, letterSpacing: '-0.03em' }}>
              {product.stock}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
              {product.stock === 0 ? 'Out of stock' : product.stock < 10 ? 'Low stock' : 'In stock'}
            </p>
          </div>


          {category && (
            <Link to={`/categories/${category.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: `${category.color}10`,
                border: `1px solid ${category.color}30`,
                borderRadius: 'var(--radius)',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                transition: 'all var(--transition)',
                cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${category.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${category.color}10`; }}
              >
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 10,
                  background: `${category.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, flexShrink: 0,
                }}>
                  {category.icon}
                </div>
                <div>
                  <p style={{ fontSize: 11, color: category.color, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Category</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)', marginTop: 2 }}>
                    {category.name}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>View category →</p>
                </div>
              </div>
            </Link>
          )}


          <div style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '20px',
          }}>
            <p style={{ fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontWeight: 600 }}>Quick Actions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => { setEditing(true); clearError('action'); }} style={{
                padding: '9px 14px',
                background: 'var(--bg-3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background var(--transition)',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-4)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-3)')}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 9.5L9.5 2l1.5 1.5L3.5 11H2V9.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                Edit product details
              </button>
              <button onClick={() => setShowMove(true)} style={{
                padding: '9px 14px',
                background: 'var(--bg-3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background var(--transition)',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-4)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-3)')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3l4 4-4 4M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Move to category
              </button>
              <button onClick={() => setShowDelete(true)} style={{
                padding: '9px 14px',
                background: 'var(--red-bg)',
                border: '1px solid rgba(255,92,92,0.2)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--red)',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background var(--transition)',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,92,92,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--red-bg)')}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5M5.5 6v3.5M7.5 6v3.5M3 3.5l.5 7.5h6L10 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Delete product
              </button>
            </div>
          </div>
        </div>
      </div>


      {showMove && (
        <MoveCategoryModal
          product={product}
          categories={categories}
          onMove={handleMove}
          onClose={() => { setShowMove(false); clearError('action'); }}
          loading={loading.action}
          error={errors.action}
        />
      )}

      {showDelete && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          danger
          loading={loading.action}
        />
      )}
    </div>
  );
}
