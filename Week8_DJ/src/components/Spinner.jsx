import React from 'react';

export default function Spinner({ size = 24, color = 'var(--accent)', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{
        animation: 'spin 0.75s linear infinite',
        display: 'block',
        ...style,
      }}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" strokeOpacity="0.2" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PageSpinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '64px 24px',
      color: 'var(--text-2)',
      fontFamily: 'var(--font-body)',
      fontSize: '14px',
    }}>
      <Spinner size={28} />
      <span>Loading…</span>
    </div>
  );
}

export function ButtonSpinner() {
  return <Spinner size={16} color="currentColor" style={{ marginRight: 6 }} />;
}
