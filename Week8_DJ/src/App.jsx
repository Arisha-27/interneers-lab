import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext.jsx';
import Navbar from './components/Navbar.jsx';
import ToastContainer from './components/ToastContainer.jsx';

import Dashboard         from './pages/Dashboard.jsx';
import ProductsPage      from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import NewProductPage    from './pages/NewProductPage.jsx';
import CategoriesPage    from './pages/CategoriesPage.jsx';
import CategoryDetailPage from './pages/CategoryDetailPage.jsx';
import NotFound          from './pages/NotFound.jsx';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"                    element={<Dashboard />} />
            <Route path="/products"            element={<ProductsPage />} />
            <Route path="/products/new"        element={<NewProductPage />} />
            <Route path="/products/:id"        element={<ProductDetailPage />} />
            <Route path="/categories"          element={<CategoriesPage />} />
            <Route path="/categories/:id"      element={<CategoryDetailPage />} />
            <Route path="*"                    element={<NotFound />} />
          </Routes>
        </main>
        <ToastContainer />
      </BrowserRouter>
    </StoreProvider>
  );
}
