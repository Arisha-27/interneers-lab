import React from 'react';

export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div style={{
      background: 'var(--red-bg)',
      border: '1px solid rgba(255,92,92,0.3)',
      borderLeft: '3px solid var(--red)',
      borderRadius: 'var(--radius-sm)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      fontSize: 14,
      color: 'var(--text)',
      animation: 'fadeUp 0.2s ease both',
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7.5" stroke="var(--red)" strokeWidth="1.5"/>
        <path d="M8 4.5V8.5" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8" cy="11" r="0.75" fill="var(--red)"/>
      </svg>
      <span style={{ flex: 1, lineHeight: 1.5 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-3)',
            cursor: 'pointer',
            padding: 2,
            lineHeight: 1,
            flexShrink: 0,
          }}
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
