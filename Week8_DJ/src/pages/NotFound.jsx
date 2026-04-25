import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-enter" style={{
      maxWidth: 500,
      margin: '0 auto',
      padding: '100px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 96,
        fontWeight: 800,
        color: 'var(--bg-4)',
        letterSpacing: '-0.05em',
        lineHeight: 1,
      }}>
        404
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 24,
        fontWeight: 700,
        color: 'var(--text)',
        marginTop: 16,
      }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 8 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 32,
        padding: '10px 24px',
        background: 'var(--accent)',
        color: 'white',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
        fontSize: 14,
        textDecoration: 'none',
      }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
}
