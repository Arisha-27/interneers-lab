import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const navItems = [
  { to: '/',            label: 'Dashboard' },
  { to: '/products',    label: 'Products'  },
  { to: '/categories',  label: 'Categories'},
];

export default function Navbar() {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(13,15,20,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.9"/>
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.6"/>
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.6"/>
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
          }}>
            Productly
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 500,
                color: isActive ? 'var(--text)' : 'var(--text-2)',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--bg-3)' : 'transparent',
                transition: 'all var(--transition)',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
