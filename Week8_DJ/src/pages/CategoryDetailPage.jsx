import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { PageSpinner } from '../components/Spinner.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ProductList from '../components/ProductList.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import Modal from '../components/Modal.jsx';
import { ConfirmModal } from '../components/Modal.jsx';
import CategoryForm from '../components/CategoryForm.jsx';
import { categoryApi } from '../utils/api.js';

export default function CategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, loading, errors, updateCategory, deleteCategory, fetchProducts, fetchCategories, clearError } = useStore();

  const [category, setCategory] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    loadCategory();
    if (!products.length) fetchProducts();
    if (!categories.length) fetchCategories();
  }, [id]);

  // Keep local category in sync with store
  useEffect(() => {
    const found = categories.find(c => c.id === id);
    if (found) setCategory(found);
  }, [categories, id]);

  async function loadCategory() {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const cat = await categoryApi.get(id);
      setCategory(cat);
    } catch (e) {
      setFetchError(e.message);
    } finally {
      setFetchLoading(false);
    }
  }

  const handleEdit = async (data) => {
    try {
      const updated = await updateCategory(id, data);
      setCategory(updated);
      setShowEdit(false);
    } catch (_) {}
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(id);
      navigate('/categories');
    } catch (_) {}
  };

  if (fetchLoading) return <PageSpinner />;

  if (fetchError) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px' }}>
        <ErrorAlert message={fetchError} />
        <Link to="/categories" style={{ display: 'block', marginTop: 16, color: 'var(--accent)', fontSize: 14 }}>
          ← Back to Categories
        </Link>
      </div>
    );
  }

  if (!category) return null;

  const catProducts = products.filter(p => p.categoryId === id);

  return (
    <div className="page-enter" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Categories', to: '/categories' },
          { label: category.name },
        ]}
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 40, height: 40,
              borderRadius: 10,
              background: `${category.color}20`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}>
              {category.icon}
            </span>
            {category.name}
          </span>
        }
        subtitle={category.description}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { setShowEdit(true); clearError('action'); }}
              style={{
                padding: '9px 16px',
                background: 'var(--bg-3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-2)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all var(--transition)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-2)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 9.5L9.5 2l1.5 1.5L3.5 11H2V9.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
              Edit
            </button>
            <button
              onClick={() => setShowDelete(true)}
              style={{
                padding: '9px 16px',
                background: 'var(--red-bg)',
                border: '1px solid rgba(255,92,92,0.2)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--red)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'background var(--transition)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,92,92,0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--red-bg)')}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5M5.5 6v3.5M7.5 6v3.5M3 3.5l.5 7.5h6L10 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Delete
            </button>
          </div>
        }
      />

      {errors.action && !showEdit && (
        <div style={{ marginBottom: 24 }}>
          <ErrorAlert message={errors.action} onDismiss={() => clearError('action')} />
        </div>
      )}

      {/* Category stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 12,
        marginBottom: 36,
      }}>
        {[
          { label: 'Total Products',    value: catProducts.length,                                                    color: category.color },
          { label: 'Active',            value: catProducts.filter(p => p.status === 'active').length,                 color: 'var(--green)'  },
          { label: 'Out of Stock',      value: catProducts.filter(p => p.stock === 0).length,                         color: 'var(--red)'    },
          { label: 'Total Stock Value', value: `€${catProducts.reduce((s,p) => s + p.price * p.stock, 0).toFixed(0)}`, color: '#3b9eff'       },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '16px 20px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Products heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>
          Products in {category.name}
        </h2>
        <Link to="/products/new" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          background: `${category.color}20`,
          border: `1px solid ${category.color}40`,
          borderRadius: 'var(--radius-sm)',
          color: category.color,
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'all var(--transition)',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = `${category.color}30`)}
          onMouseLeave={e => (e.currentTarget.style.background = `${category.color}20`)}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          Add Product
        </Link>
      </div>

      <ProductList
        products={catProducts}
        categories={categories}
        loading={loading.products}
        emptyMessage={`No products in ${category.name} yet.`}
      />

      {/* Modals */}
      {showEdit && (
        <Modal title={`Edit ${category.name}`} onClose={() => { setShowEdit(false); clearError('action'); }}>
          <CategoryForm
            initial={category}
            onSubmit={handleEdit}
            onCancel={() => { setShowEdit(false); clearError('action'); }}
            loading={loading.action}
            error={errors.action}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {showDelete && (
        <ConfirmModal
          title="Delete Category"
          message={`Delete "${category.name}"? This will fail if the category still has products — move or delete them first.`}
          onConfirm={handleDelete}
          onCancel={() => { setShowDelete(false); clearError('action'); }}
          danger
          loading={loading.action}
        />
      )}
    </div>
  );
}
