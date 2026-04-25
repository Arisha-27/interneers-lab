import React from 'react';
import { useStore } from '../context/StoreContext.jsx';

export default function ToastContainer() {
  const { notifications } = useStore();

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
    }}>
      {notifications.map(n => (
        <Toast key={n.id} toast={n} />
      ))}
    </div>
  );
}

function Toast({ toast }) {
  const icons = {
    success: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7.5" stroke="var(--green)" strokeWidth="1.5"/>
        <path d="M5 8l2.2 2.2L11 5.5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7.5" stroke="var(--red)" strokeWidth="1.5"/>
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  };

  const colors = {
    success: { bg: 'var(--bg-3)', border: 'var(--green)', dot: 'var(--green)' },
    error:   { bg: 'var(--bg-3)', border: 'var(--red)',   dot: 'var(--red)'   },
  };

  const c = colors[toast.type] || colors.success;

  return (
    <div style={{
      pointerEvents: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderLeft: `3px solid ${c.border}`,
      borderRadius: 'var(--radius-sm)',
      padding: '10px 16px',
      minWidth: 260,
      maxWidth: 380,
      boxShadow: 'var(--shadow-lg)',
      animation: 'fadeUp 0.3s ease both',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text)',
    }}>
      {icons[toast.type] || icons.success}
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
}
