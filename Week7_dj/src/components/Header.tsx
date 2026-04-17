import styles from '../styles/Header.module.css';

const Header: React.FC = () => (
  <header className={styles.hero}>
    <div className={styles.inner}>
      <div>
        <p className={styles.eyebrow}>Spring / Summer 2025</p>
        <h1 className={styles.title}>
          Crafted for&nbsp;
          <span className={styles.titleEmphasis}>living</span>
          <br />beautifully.
        </h1>
        <p className={styles.subtitle}>
          Objects made to last. Each piece is chosen for its craft, materiality,
          and quiet intelligence of design.
        </p>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statNumber}>148</div>
          <div className={styles.statLabel}>Products</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>32</div>
          <div className={styles.statLabel}>Artisans</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNumber}>12</div>
          <div className={styles.statLabel}>Countries</div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;