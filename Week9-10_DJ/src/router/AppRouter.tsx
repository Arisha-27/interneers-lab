import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import ProductDetailPage from '../pages/ProductDetailPage';
import Reports from '../pages/Reports';

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;