import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import ProductDetail from '../components/products/ProductDetail';
import ProductForm from '../components/products/ProductForm';
import { Modal } from '../components/ui/Modal';
import { Product } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct, updateProduct, deleteProduct } = useInventory();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const product = getProduct(id!);

  if (!product) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-3">🔍</div>
      <p className="text-slate-500 font-medium">Product not found</p>
    </div>
  );

  const handleUpdate = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateProduct(product.id, data);
    setEditing(false);
  };

  const handleDelete = () => {
    deleteProduct(product.id);
    navigate('/products');
  };

  return (
    <div>
      <ProductDetail product={product} onEdit={() => setEditing(true)} onDelete={handleDelete} />
      <Modal isOpen={editing} onClose={() => setEditing(false)} title="Edit Product" size="lg">
        <ProductForm product={product} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
      </Modal>
    </div>
  );
};

export default ProductDetailPage;