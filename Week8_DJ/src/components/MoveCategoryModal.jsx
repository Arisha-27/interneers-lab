import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { ButtonSpinner } from './Spinner.jsx';
import ErrorAlert from './ErrorAlert.jsx';

export default function MoveCategoryModal({ product, categories, onMove, onClose, loading, error }) {
  const [selectedId, setSelectedId] = useState('');
  const available = categories.filter(c => c.id !== product.categoryId);

  return (
    <Modal title="Move to Category" onClose={onClose} width={420}>
      <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20 }}>
        Moving <strong style={{ color: 'var(--text)' }}>{product.name}</strong> to a new category.
      </p>

      {error && <ErrorAlert message={error} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        {available.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontSize: 13, textAlign: 'center', padding: 16 }}>
            No other categories available.
          </p>
        )}
        {available.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedId(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: selectedId === cat.id ? `${cat.color}20` : 'var(--bg)',
              border: selectedId === cat.id ? `2px solid ${cat.color}` : '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all var(--transition)',
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `${cat.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}>
              {cat.icon}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                {cat.name}
              </div>
              {cat.description && (
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 1 }}>{cat.description}</div>
              )}
            </div>
            {selectedId === cat.id && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <circle cx="8" cy="8" r="7.5" fill={cat.color}/>
                <path d="M5 8l2.2 2.2L11 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
        <button
          onClick={onClose}
          style={{
            padding: '10px 18px',
            background: 'var(--bg-3)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-2)',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => selectedId && onMove(selectedId)}
          disabled={!selectedId || loading}
          style={{
            padding: '10px 20px',
            background: selectedId ? 'var(--accent)' : 'var(--bg-4)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            color: selectedId ? 'white' : 'var(--text-3)',
            fontSize: 14,
            fontWeight: 600,
            cursor: !selectedId || loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all var(--transition)',
          }}
        >
          {loading && <ButtonSpinner />}
          Move Product
        </button>
      </div>
    </Modal>
  );
}
