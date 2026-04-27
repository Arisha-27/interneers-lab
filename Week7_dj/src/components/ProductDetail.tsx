import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Product } from "../types";
import { useCart } from '../context/CartContext';
import styles from '../styles/ProductDetail.module.css';

interface ProductDetailProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [isOpen]);

  const modalContent = (
    <div className={`${styles.modalBackdrop} ${isOpen ? styles.open : ''}`} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <div className={styles.modalGrid}>
          <div className={styles.imageColumn}>
            <img src={product.image} alt={product.name} />
          </div>
          <div className={styles.infoColumn}>
            <div>
              <p className={styles.category}>{product.category}</p>
              <h2 className={styles.name}>{product.name}</h2>
              <p className={styles.price}>${product.price.toLocaleString()}</p>
            </div>
            
            <p className={styles.description}>{product.description}</p>
            
            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Material</span>
                <span className={styles.detailValue}>{product.material}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Dimensions</span>
                <span className={styles.detailValue}>{product.dimensions}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Availability</span>
                <span className={styles.detailValue}>
                  {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.btnPrimary} 
                disabled={!product.inStock}
                onClick={() => { addToCart(product.id); onClose(); }}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            <p className={styles.sku}>SKU: {product.sku}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Use a portal to ensure the fixed positioned modal breaks out of all overflow:hidden containers
  return createPortal(modalContent, document.body);
};

export default ProductDetail;