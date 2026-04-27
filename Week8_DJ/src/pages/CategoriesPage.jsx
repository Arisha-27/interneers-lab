import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { PageSpinner } from '../components/Spinner.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import Modal from '../components/Modal.jsx';
import { ConfirmModal } from '../components/Modal.jsx';
import CategoryForm from '../components/CategoryForm.jsx';

function CategoryRow({ category, productCount, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        background: hovered ? 'var(--bg-3)' : 'var(--bg-2)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        transition: 'all var(--transition)',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <Link to={`/categories/${category.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${category.color}20`,
          border: `2px solid ${category.color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          flexShrink: 0,
          transition: 'border-color var(--transition)',
        }}>
          {category.icon}
        </div>
      </Link>

      {/* Info */}
      <Link to={`/categories/${category.id}`} style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
          {category.name}
        </div>
        {category.description && (
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {category.description}
          </div>
        )}
      </Link>

      {/* Badge */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '6px 16px',
        background: `${category.color}15`,
        borderRadius: 'var(--radius-sm)',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: category.color }}>
          {productCount}
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          products
        </span>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: 6,
        opacity: hovered ? 1 : 0,
        transition: 'opacity var(--transition)',
      }}>
        <button
          onClick={e => { e.preventDefault(); onEdit(category); }}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-4)',
            border: '1px solid var(--border)',
            borderRadius: 7,
            cursor: 'pointer',
            color: 'var(--text-2)',
            transition: 'all var(--transition)',
          }}
          title="Edit category"
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text-2)'; }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 9.5L9.5 2l1.5 1.5L3.5 11H2V9.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
        </button>
        <button
          onClick={e => { e.preventDefault(); onDelete(category); }}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--red-bg)',
            border: '1px solid rgba(255,92,92,0.2)',
            borderRadius: 7,
            cursor: 'pointer',
            color: 'var(--red)',
            transition: 'all var(--transition)',
          }}
          title="Delete category"
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,92,92,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--red-bg)')}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5M5.5 6v3.5M7.5 6v3.5M3 3.5l.5 7.5h6L10 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { categories, products, loading, errors, fetchCategories, fetchProducts, createCategory, updateCategory, deleteCategory, clearError } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (!products.length) fetchProducts();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createCategory(data);
      setShowCreate(false);
    } catch (_) {}
  };

  const handleEdit = async (data) => {
    try {
      await updateCategory(editTarget.id, data);
      setEditTarget(null);
    } catch (_) {}
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    } catch (_) {}
  };

  return (
    <div className="page-enter" style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Categories' }]}
        title="Categories"
        subtitle={`${categories.length} categories, ${products.length} total products`}
        actions={
          <button onClick={() => { setShowCreate(true); clearError('action'); }} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '10px 20px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            color: 'white',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'background var(--transition)',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            New Category
          </button>
        }
      />

      {errors.categories && (
        <div style={{ marginBottom: 24 }}>
          <ErrorAlert message={errors.categories} onDismiss={() => clearError('categories')} />
        </div>
      )}

      {errors.action && !showCreate && !editTarget && (
        <div style={{ marginBottom: 24 }}>
          <ErrorAlert message={errors.action} onDismiss={() => clearError('action')} />
        </div>
      )}

      {loading.categories ? (
        <PageSpinner />
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗂</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-2)' }}>No categories yet.</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Create your first category to start organising products.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {categories.map(cat => (
            <CategoryRow
              key={cat.id}
              category={cat}
              productCount={products.filter(p => p.categoryId === cat.id).length}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <Modal title="New Category" onClose={() => { setShowCreate(false); clearError('action'); }}>
          <CategoryForm
            onSubmit={handleCreate}
            onCancel={() => { setShowCreate(false); clearError('action'); }}
            loading={loading.action}
            error={errors.action}
            submitLabel="Create Category"
          />
        </Modal>
      )}

      {/* Edit modal */}
      {editTarget && (
        <Modal title="Edit Category" onClose={() => { setEditTarget(null); clearError('action'); }}>
          <CategoryForm
            initial={editTarget}
            onSubmit={handleEdit}
            onCancel={() => { setEditTarget(null); clearError('action'); }}
            loading={loading.action}
            error={errors.action}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Category"
          message={`Delete "${deleteTarget.name}"? This will fail if the category has products — move or delete them first.`}
          onConfirm={handleDelete}
          onCancel={() => { setDeleteTarget(null); clearError('action'); }}
          danger
          loading={loading.action}
        />
      )}
    </div>
  );
}
