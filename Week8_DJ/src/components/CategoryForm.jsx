import React, { useState, useEffect } from 'react';
import ErrorAlert from './ErrorAlert.jsx';
import { ButtonSpinner } from './Spinner.jsx';

const COLORS = ['#6c63ff','#22d3a8','#f5a623','#ff5c5c','#3b9eff','#e040fb','#00e5ff','#ff6d00'];
const ICONS  = ['📦','⚡','👕','🏡','📚','🎮','🍎','🛠','🎨','💄','🚗','⌚','🎵','🏋','🧪'];

export default function CategoryForm({ initial = {}, onSubmit, onCancel, loading, error, submitLabel = 'Save Category' }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    color: '#6c63ff',
    icon: '📦',
    ...initial,
  });

  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      setForm(f => ({ ...f, ...initial }));
    }
  }, [initial?.id]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

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
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {error && <ErrorAlert message={error} />}

      {/* Preview */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        background: 'var(--bg)',
        borderRadius: 'var(--radius)',
        border: `2px solid ${form.color}40`,
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${form.color}20`,
          border: `2px solid ${form.color}60`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}>
          {form.icon}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
            {form.name || 'Category Name'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
            {form.description || 'Category description…'}
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label style={labelStyle}>Category Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Electronics"
          required
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = form.color)}
          onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
        />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Brief description of this category…"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = form.color)}
          onBlur={e => (e.target.style.borderColor = 'var(--border-2)')}
        />
      </div>

      {/* Icon picker */}
      <div>
        <label style={labelStyle}>Icon</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {ICONS.map(icon => (
            <button
              key={icon}
              type="button"
              onClick={() => setForm(f => ({ ...f, icon }))}
              style={{
                width: 38,
                height: 38,
                fontSize: 20,
                borderRadius: 8,
                border: form.icon === icon ? `2px solid ${form.color}` : '1px solid var(--border)',
                background: form.icon === icon ? `${form.color}20` : 'var(--bg)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label style={labelStyle}>Colour</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setForm(f => ({ ...f, color }))}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: color,
                border: form.color === color ? `3px solid white` : '3px solid transparent',
                outline: form.color === color ? `2px solid ${color}` : 'none',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                boxSizing: 'border-box',
              }}
            />
          ))}
          {/* Custom color */}
          <div style={{ position: 'relative', width: 28, height: 28 }}>
            <input
              type="color"
              value={form.color}
              onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              style={{
                opacity: 0,
                position: 'absolute',
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                top: 0,
                left: 0,
              }}
            />
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '2px dashed var(--border-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              pointerEvents: 'none',
            }}>
              +
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
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
            background: loading ? 'var(--bg-4)' : form.color,
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
        >
          {loading && <ButtonSpinner />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
