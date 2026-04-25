import React from 'react';
import { Link } from 'react-router-dom';

function StatusBadge({ status, stock }) {
  const outOfStock = stock === 0;
  const config = outOfStock
    ? { label: 'Out of Stock', bg: 'var(--red-bg)',    color: 'var(--red)'   }
    : status === 'inactive'
    ? { label: 'Inactive',     bg: 'var(--bg-4)',      color: 'var(--text-3)'}
    : { label: 'Active',       bg: 'var(--green-bg)',  color: 'var(--green)' };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      background: config.bg,
      color: config.color,
      padding: '3px 8px',
      borderRadius: 99,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: config.color }} />
      {config.label}
    </span>
  );
}

export default function ProductCard({ product, category }) {
  const categoryColor = category?.color || 'var(--accent)';

  return (
    <Link
      to={`/products/${product.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px',
        transition: 'all var(--transition)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.border = `1px solid ${categoryColor}40`;
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${categoryColor}20`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.border = '1px solid var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}80)`,
          borderRadius: 'var(--radius) var(--radius) 0 0',
          zIndex: 2,
        }} />


        <div style={{
          margin: '-20px -20px 20px -20px',
          height: 180,
          background: 'var(--bg-3)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
        }}>
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{ fontSize: 48 }}>📦</div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: 4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {product.name}
            </h3>
            {product.sku && (
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace' }}>
                {product.sku}
              </span>
            )}
          </div>
          <StatusBadge status={product.status} stock={product.stock} />
        </div>

        {product.description && (
          <p style={{
            fontSize: 13,
            color: 'var(--text-2)',
            marginTop: 10,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.description}
          </p>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          paddingTop: 14,
          borderTop: '1px solid var(--border)',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text)',
          }}>
            €{Number(product.price).toFixed(2)}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
            <span style={{ color: product.stock > 10 ? 'var(--green)' : product.stock > 0 ? 'var(--yellow)' : 'var(--red)' }}>
              {product.stock}
            </span> in stock
          </span>
        </div>

        {category && (
          <div style={{ marginTop: 10 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              color: categoryColor,
              background: `${categoryColor}15`,
              padding: '3px 8px',
              borderRadius: 99,
              fontWeight: 500,
            }}>
              {category.icon} {category.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
