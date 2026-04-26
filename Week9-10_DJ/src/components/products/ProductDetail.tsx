import React, { useState } from 'react';
import { Product } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Edit2, Trash2, Calendar, Tag, Hash, DollarSign, Package } from 'lucide-react';

interface Props {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

const ProductDetail: React.FC<Props> = ({ product, onEdit, onDelete }) => {
  const isLow = product.quantity < 10;
  const isOut = product.quantity === 0;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="glass-panel rounded-2xl overflow-hidden border border-dark-700/50 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-72 md:h-auto bg-dark-900 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-dark-700/50">
            {product.imageUrl && !imgError ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-dark-600 bg-dark-800/50">
                <Package size={64} />
                <span className="text-sm font-medium mt-3">No Image Available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent pointer-events-none"></div>
            {isLow && (
              <div className={`absolute top-4 left-4 ${isOut ? 'bg-accent-rose/20 text-accent-rose border border-accent-rose/30' : 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30'} text-sm font-bold px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg`}>
                {isOut ? 'Out of Stock' : 'Low Stock'}
              </div>
            )}
          </div>
          <div className="p-8 flex flex-col justify-between bg-dark-800/30">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-dark-400 font-mono text-sm mb-2">{product.sku}</p>
                  <h1 className="text-3xl font-bold text-dark-100">{product.name}</h1>
                </div>
                <Badge variant="info">{product.category}</Badge>
              </div>
              <p className="text-dark-300 text-sm leading-relaxed mb-8 bg-dark-900/50 p-4 rounded-xl border border-dark-700/30">{product.description || 'No description provided.'}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: DollarSign, label: 'Price', value: `$${product.price.toFixed(2)}`, color: 'text-brand-400' },
                  { icon: Package, label: 'Quantity', value: product.quantity, color: isOut ? 'text-accent-rose' : isLow ? 'text-accent-amber' : 'text-accent-teal' },
                  { icon: Tag, label: 'Category', value: product.category, color: 'text-dark-200' },
                  { icon: Hash, label: 'SKU', value: product.sku, color: 'text-dark-200' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="bg-dark-800/80 rounded-xl p-4 border border-dark-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-dark-500" />
                      <span className="text-xs text-dark-400 uppercase tracking-wider font-semibold">{label}</span>
                    </div>
                    <span className={`font-bold text-lg ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 text-xs font-medium text-dark-500 mb-8 items-center bg-dark-900/50 px-4 py-3 rounded-lg border border-dark-700/30">
                <Calendar size={14} className="text-brand-500" />
                <span>Created: <span className="text-dark-300">{product.createdAt}</span></span>
                <span className="w-1 h-1 bg-dark-600 rounded-full"></span>
                <span>Updated: <span className="text-dark-300">{product.updatedAt}</span></span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button icon={<Edit2 size={16} />} onClick={onEdit} className="flex-1 bg-brand-600 hover:bg-brand-500 text-white shadow-glow py-3 rounded-xl transition-all" data-testid="detail-edit-btn">Edit Product</Button>
              <Button variant="danger" icon={<Trash2 size={16} />} onClick={onDelete} className="px-6 bg-accent-rose/10 text-accent-rose hover:bg-accent-rose hover:text-white border border-accent-rose/20 hover:border-transparent py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]">Delete</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;