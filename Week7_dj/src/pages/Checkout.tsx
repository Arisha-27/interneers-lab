import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const Checkout: React.FC = () => {
  const { cart, cartCount, addToCart, removeFromCart, deleteFromCart, clearCart } = useCart();
  const [ordered, setOrdered] = useState(false);

  if (ordered) {
    return (
      <div style={{ maxWidth: '600px', margin: '120px auto', textAlign: 'center', minHeight: '50vh' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--color-espresso)' }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '16px', fontSize: '1.2rem' }}>Thank you for shopping at Maison.</p>
        <button 
          onClick={() => window.location.href = '/'}
          style={{ 
            marginTop: '32px', 
            padding: '14px 28px', 
            background: 'var(--color-espresso)', 
            color: 'var(--color-cream)',
            border: 'none', 
            cursor: 'pointer',
            fontSize: '14px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const orderTotal = cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + ((product?.price || 0) * item.quantity);
  }, 0);

  const handlePlaceOrder = () => {
    clearCart();
    setOrdered(true);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 24px', minHeight: '60vh' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '32px', color: 'var(--color-espresso)' }}>Checkout</h1>
      
      {cartCount === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Your cart is empty.</p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ 
              padding: '14px 28px', 
              background: 'var(--color-espresso)', 
              color: 'var(--color-cream)',
              border: 'none', 
              cursor: 'pointer',
              fontSize: '14px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div>
          <div style={{ padding: '32px', background: 'var(--color-warm-white)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '24px', fontWeight: '500', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cart.map(item => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                
                return (
                  <div key={item.productId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={product.image} alt={product.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <div style={{ fontWeight: '500', color: 'var(--color-espresso)' }}>{product.name}</div>
                        <div style={{ fontSize: '14px', marginTop: '4px' }}>${product.price.toLocaleString()}</div>
                        <button 
                          onClick={() => deleteFromCart(product.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '12px', padding: '4px 0', cursor: 'pointer', textDecoration: 'underline', marginTop: '4px' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                        <button 
                          onClick={() => removeFromCart(product.id)} 
                          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'var(--color-text-secondary)' }}>
                          -
                        </button>
                        <span style={{ fontSize: '14px', width: '20px', textAlign: 'center', fontWeight: '500' }}>{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(product.id)} 
                          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'var(--color-text-secondary)' }}>
                          +
                        </button>
                      </div>
                      <div style={{ width: '70px', textAlign: 'right', fontWeight: '500', color: 'var(--color-espresso)', fontSize: '1.1rem' }}>
                        ${(product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.4rem', color: 'var(--color-espresso)' }}>
              <span>Total</span>
              <span>${orderTotal.toLocaleString()}</span>
            </div>
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            style={{ 
              marginTop: '32px', 
              width: '100%', 
              padding: '18px', 
              background: 'var(--color-espresso)', 
              color: 'var(--color-cream)', 
              border: 'none', 
              fontSize: '1.1rem', 
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'background 0.2s',
              borderRadius: '2px'
            }}
          >
            PLACE ORDER
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
