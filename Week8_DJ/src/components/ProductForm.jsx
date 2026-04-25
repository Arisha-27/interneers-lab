import React, { useState, useEffect } from 'react';
import ErrorAlert from './ErrorAlert.jsx';
import { ButtonSpinner } from './Spinner.jsx';

const FIELD = (label, name, type = 'text', placeholder = '', required = false) => ({
  label, name, type, placeholder, required,
});

const fields = [
  FIELD('Product Name', 'name', 'text', 'e.g. Wireless Earbuds Pro', true),
  FIELD('SKU', 'sku', 'text', 'e.g. EAR-001'),
  FIELD('Price (€)', 'price', 'number', '0.00', true),
  FIELD('Stock Quantity', 'stock', 'number', '0', true),
];

export default function ProductForm({ initial = {}, categories = [], onSubmit, onCancel, loading, error, submitLabel = 'Save Product' }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    categoryId: '',
    status: 'active',
    description: '',
    ...initial,
  });

  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      setForm(f => ({ ...f, ...initial }));
    }
  }, [initial?.id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--border-2)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    color: 'var(--text)',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color var(--transition)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-2)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: 6,
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {error && <ErrorAlert message={error} />}


      <div>
        <label style={labelStyle}>Product Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Wireless Earbuds Pro"
          required
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
        />
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>SKU</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="e.g. EAR-001"
            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13 }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
          />
        </div>
        <div>
          <label style={labelStyle}>Price (€) *</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            required
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
          />
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Stock Qty *</label>
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
            required
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
          />
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>


      <div>
        <label style={labelStyle}>Category *</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
        >
          <option value="">Select a category…</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>


      <div>
        <label style={labelStyle}>Image URL</label>
        <input
          name="image"
          value={form.image || ''}
          onChange={handleChange}
          placeholder="https://example.com/image.png"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
        />
      </div>


      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short product description…"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
        />
      </div>


      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-2)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-2)'; }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: loading ? 'var(--bg-4)' : 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent-2)'; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)'; }}
        >
          {loading && <ButtonSpinner />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
