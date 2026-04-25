import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import ProductForm from '../components/ProductForm.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function NewProductPage() {
  const navigate = useNavigate();
  const { categories, loading, errors, createProduct, fetchCategories, clearError } = useStore();

  useEffect(() => {
    if (!categories.length) fetchCategories();
    return () => clearError('action');
  }, []);

  const handleSubmit = async (data) => {
    try {
      const prod = await createProduct(data);
      navigate(`/products/${prod.id}`);
    } catch (_) {}
  };

  return (
    <div className="page-enter" style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: 'Products', to: '/products' },
          { label: 'New Product' },
        ]}
        title="Add Product"
        subtitle="Fill in the details to create a new product"
      />

      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 32,
      }}>
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/products')}
          loading={loading.action}
          error={errors.action}
          submitLabel="Create Product"
        />
      </div>
    </div>
  );
}
