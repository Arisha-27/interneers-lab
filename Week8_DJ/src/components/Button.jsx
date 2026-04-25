import React from 'react';
import { ButtonSpinner } from './Spinner.jsx';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style: extraStyle = {},
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition)',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    opacity: disabled ? 0.5 : 1,
  };

  const sizes = {
    sm: { padding: '6px 14px', fontSize: 13 },
    md: { padding: '10px 20px', fontSize: 14 },
    lg: { padding: '12px 28px', fontSize: 15 },
  };

  const variants = {
    primary:  { background: 'var(--accent)',  color: 'white'          },
    danger:   { background: 'var(--red)',     color: 'white'          },
    ghost:    { background: 'var(--bg-3)',    color: 'var(--text-2)', border: '1px solid var(--border)' },
    outline:  { background: 'transparent',   color: 'var(--text-2)', border: '1px solid var(--border-2)' },
    success:  { background: 'var(--green)',   color: 'white'          },
  };

  const style = { ...base, ...sizes[size], ...variants[variant], ...extraStyle };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? <ButtonSpinner /> : icon}
      {children}
    </button>
  );
}
