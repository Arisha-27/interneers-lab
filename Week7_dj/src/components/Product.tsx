import type { Product as ProductType } from '../types';
import ProductDetail from './ProductDetail';
import styles from '../styles/Product.module.css';

interface ProductProps {
  product: ProductType;
  isExpanded: boolean;
  onToggle: (id: number) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className={styles.stars}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`${styles.star} ${star <= Math.round(rating) ? styles.filled : ''}`}
      >
        ★
      </span>
    ))}
  </div>
);

const Product: React.FC<ProductProps> = ({ product, isExpanded, onToggle }) => {
  const badgeClass =
    product.badge === 'Sale'
      ? styles.sale
      : product.badge === 'New'
        ? styles.new
        : '';

  return (
    <article className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.imageWrapper} onClick={() => onToggle(product.id)}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {product.badge && (
          <span className={`${styles.badge} ${badgeClass}`}>{product.badge}</span>
        )}
        {!product.inStock && (
          <div className={styles.outOfStock}>Sold Out</div>
        )}
      </div>

      <div className={styles.body} onClick={() => onToggle(product.id)}>
        <p className={styles.category}>{product.category}</p>
        <h2 className={styles.name}>{product.name}</h2>

        <div className={styles.rating}>
          <StarRating rating={product.rating} />
          <span className={styles.reviewCount}>({product.reviewCount})</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.pricing}>
            <span className={styles.price}>${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button className={styles.expandBtn} aria-expanded={isExpanded}>
            Details
            <span className={`${styles.chevron} ${isExpanded ? styles.rotated : ''}`}>
              ↓
            </span>
          </button>
        </div>
      </div>

      <ProductDetail product={product} isOpen={isExpanded} onClose={() => onToggle(product.id)} />
    </article>
  );
};

export default Product;