import { useState, useMemo } from 'react';
import { products } from '../data/products';
import Product from './Product';
import styles from '../styles/ProductList.module.css';

const ALL = 'All';

interface ProductListProps {
  filterBadge?: string;
  sectionLabel?: string;
  sectionTitle?: string;
}

const ProductList: React.FC<ProductListProps> = ({ 
  filterBadge, 
  sectionLabel = "Curated Selection", 
  sectionTitle = "The Collection" 
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>(ALL);

  const baseProducts = useMemo(
    () => (filterBadge ? products.filter((p) => p.badge === filterBadge) : products),
    [filterBadge]
  );

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(baseProducts.map((p) => p.category)))],
    [baseProducts]
  );

  const filtered = useMemo(
    () =>
      activeFilter === ALL
        ? baseProducts
        : baseProducts.filter((p) => p.category === activeFilter),
    [activeFilter]
  );

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleFilter = (category: string) => {
    setActiveFilter(category);
    setExpandedId(null);
  };

  return (
    <section className={styles.section}>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.sectionLabel}>{sectionLabel}</p>
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
        </div>
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <Product
              key={product.id}
              product={product}
              isExpanded={expandedId === product.id}
              onToggle={handleToggle}
            />
          ))
        ) : (
          <div className={styles.emptyState}>No products in this category.</div>
        )}
      </div>
    </section>
  );
};

export default ProductList;