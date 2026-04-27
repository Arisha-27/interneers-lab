import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { Edit2, Trash2, ExternalLink, Package } from 'lucide-react';

interface Props {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<Props> = ({ product, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const isLow = product.quantity > 0 && product.quantity < 10;
  const isOut = product.quantity === 0;

  return (
    <div data-testid={`product-card-${product.id}`} className="glass-panel rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-glow transition-all duration-300 flex flex-col h-full border border-dark-700/50">
      <div className="relative h-48 bg-dark-900 overflow-hidden cursor-pointer flex-shrink-0 flex items-center justify-center" onClick={() => navigate(`/products/${product.id}`)}>
        {product.imageUrl && !imgError ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-dark-600 bg-dark-800/50">
            <Package size={48} />
            <span className="text-xs font-medium mt-2">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent pointer-events-none"></div>
        {isLow && (
          <div className="absolute top-3 right-3 bg-accent-amber/20 text-accent-amber border border-accent-amber/30 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg">
            Low Stock
          </div>
        )}
        {isOut && (
          <div className="absolute top-3 right-3 bg-accent-rose/20 text-accent-rose border border-accent-rose/30 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-dark-100 text-base leading-tight line-clamp-1 cursor-pointer hover:text-brand-400 transition-colors" onClick={() => navigate(`/products/${product.id}`)}>{product.name}</h3>
          <span className="text-brand-400 font-bold text-base ml-2">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-dark-400 text-xs font-mono mb-4 line-clamp-1">{product.sku}</p>
        
        <div className="flex items-center justify-between mb-auto pb-4">
          <span className="px-2.5 py-1 bg-dark-700/50 text-dark-300 text-xs font-medium rounded-lg border border-dark-600/50">{product.category}</span>
          <span className={`text-sm font-semibold ${isOut ? 'text-accent-rose' : isLow ? 'text-accent-amber' : 'text-accent-teal'}`}>
            {product.quantity} in stock
          </span>
        </div>
        
        <div className="flex gap-2 pt-4 border-t border-dark-700/50">
          <button onClick={() => navigate(`/products/${product.id}`)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-dark-300 hover:text-brand-400 bg-dark-800/50 hover:bg-brand-500/10 border border-dark-700/50 hover:border-brand-500/30 rounded-xl transition-all">
            <ExternalLink size={14} /> View
          </button>
          <button data-testid={`edit-${product.id}`} onClick={() => onEdit(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-dark-300 hover:text-accent-teal bg-dark-800/50 hover:bg-accent-teal/10 border border-dark-700/50 hover:border-accent-teal/30 rounded-xl transition-all">
            <Edit2 size={14} /> Edit
          </button>
          <button onClick={() => onDelete(product.id)} className="px-3 py-2 text-dark-400 hover:text-accent-rose bg-dark-800/50 hover:bg-accent-rose/10 border border-dark-700/50 hover:border-accent-rose/30 rounded-xl transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;