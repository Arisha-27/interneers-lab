import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { navItems } from '../data/products';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Maison<span className={styles.brandDot} />
          </NavLink>
        </div>
        <ul className={styles.links}>
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink 
                to={item.href} 
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <button className={styles.cartBtn} onClick={() => navigate('/checkout')}>
            Cart <span className={styles.cartCount}>{cartCount}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;