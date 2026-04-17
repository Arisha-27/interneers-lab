import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NewArrivals from './pages/NewArrivals';
import Sale from './pages/Sale';
import About from './pages/About';
import Checkout from './pages/Checkout';
import './styles/global.css';

const App: React.FC = () => (
  <CartProvider>
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '32px 48px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        letterSpacing: '0.06em',
      }}>
        © 2025 Maison — All rights reserved.
      </footer>
    </BrowserRouter>
  </CartProvider>
);

export default App;
