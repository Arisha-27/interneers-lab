import React, { useEffect } from 'react';

export default function Modal({ title, onClose, children, width = 540 }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        animation: 'fadeIn 0.15s ease both',
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border-2)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: width,
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideUp 0.25s cubic-bezier(0.4,0,0.2,1) both',
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text)',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-2)',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-2)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmModal({ title, message, onConfirm, onCancel, danger = false, loading = false }) {
  return (
    <Modal title={title} onClose={onCancel} width={420}>
      <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '9px 18px',
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
          onClick={onConfirm}
          disabled={loading}
          style={{
            padding: '9px 18px',
            background: danger ? 'var(--red)' : 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Deleting…' : 'Confirm'}
        </button>
      </div>
    </Modal>
  );
}
