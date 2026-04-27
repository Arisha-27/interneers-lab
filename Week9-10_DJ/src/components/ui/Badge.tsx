import React from 'react';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const styles: Record<Variant, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export const Badge: React.FC<{ variant?: Variant; children: React.ReactNode }> = ({ variant = 'default', children }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
    {children}
  </span>
);