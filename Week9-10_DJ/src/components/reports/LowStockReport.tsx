import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { getLowStockProducts, getLowStockCategories } from '../../utils/reportHelpers';
import { exportToCSV } from '../../utils/csvExport';
import { Badge } from '../ui/Badge';
import { Download, AlertTriangle, ExternalLink } from 'lucide-react';

const LowStockReport: React.FC = () => {
  const { products } = useInventory();
  const navigate = useNavigate();
  const [threshold, setThreshold] = useState(10);
  const [view, setView] = useState<'products' | 'categories'>('products');

  const lowProducts = useMemo(() => getLowStockProducts(products, threshold), [products, threshold]);
  const lowCategories = useMemo(() => getLowStockCategories(products, threshold), [products, threshold]);

  const handleExport = () => {
    if (view === 'products') {
      exportToCSV('low-stock-products', ['Name', 'Category', 'SKU', 'Quantity', 'Price'],
        lowProducts.map(p => [p.name, p.category, p.sku, p.quantity, `$${p.price.toFixed(2)}`]));
    } else {
      exportToCSV('low-stock-categories', ['Category', 'Total Products', 'Low Stock Count', '% Low Stock'],
        lowCategories.map(c => [c.category, c.total, c.lowCount, `${c.percentage.toFixed(1)}%`]));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-accent-amber/10 rounded-2xl border border-accent-amber/20 shadow-inner">
        <div className="flex items-center gap-4">
          <AlertTriangle size={20} className="text-accent-amber" />
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-dark-300 uppercase tracking-wider">Low stock threshold (qty &lt;)</label>
            <input type="number" min={1} value={threshold} onChange={e => setThreshold(+e.target.value || 1)} className="w-20 px-3 py-2 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-accent-amber focus:ring-1 focus:ring-accent-amber text-dark-100 transition-all shadow-inner" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-inner">
            {(['products', 'categories'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${view === v ? 'bg-dark-700 text-white shadow-md' : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'}`}>{v}</button>
            ))}
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-dark-100 rounded-xl text-sm font-medium transition-all border border-dark-700/50 shadow-sm">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {view === 'products' ? (
        <div>
          <p className="text-sm text-dark-400 mb-4 font-medium">
            <span className="font-bold text-accent-rose">{lowProducts.length}</span> products below threshold of {threshold}
          </p>
          {lowProducts.length === 0 ? (
            <div className="text-center py-16 text-dark-500 font-medium bg-dark-800/30 rounded-2xl border border-dark-700/50">🎉 No low-stock products found!</div>
          ) : (
            <div className="overflow-x-auto bg-dark-800/30 rounded-2xl border border-dark-700/50">
              <table className="w-full text-sm">
                <thead className="bg-dark-900/50">
                  <tr className="border-b border-dark-700/50">
                    {['Product', 'Category', 'SKU', 'Quantity', 'Price', 'Action'].map(h => (
                      <th key={h} className="text-left py-4 px-6 text-xs font-bold text-dark-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lowProducts.map(p => (
                    <tr key={p.id} className="border-b border-dark-700/30 hover:bg-dark-700/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-xl object-cover shadow-sm" /> : <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-xl">📦</div>}
                          <span className="font-bold text-dark-100">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6"><Badge variant="info">{p.category}</Badge></td>
                      <td className="py-4 px-6 text-dark-400 font-mono">{p.sku}</td>
                      <td className="py-4 px-6">
                        <span className={`font-bold px-3 py-1 rounded-lg ${p.quantity === 0 ? 'bg-accent-rose/20 text-accent-rose' : 'bg-accent-amber/20 text-accent-amber'}`}>{p.quantity}</span>
                      </td>
                      <td className="py-4 px-6 font-bold text-brand-400">${p.price.toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <button onClick={() => navigate(`/products/${p.id}`)} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-dark-800/50 hover:bg-brand-500/10 text-dark-300 hover:text-brand-400 border border-dark-700/50 hover:border-brand-500/30 rounded-xl transition-all text-xs font-medium">
                          <ExternalLink size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-sm text-dark-400 mb-4 font-medium">
            <span className="font-bold text-accent-rose">{lowCategories.length}</span> categories with &gt;10% low-stock products
          </p>
          {lowCategories.length === 0 ? (
            <div className="text-center py-16 text-dark-500 font-medium bg-dark-800/30 rounded-2xl border border-dark-700/50">✅ All categories look healthy!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lowCategories.map(c => (
                <div key={c.category} className="flex flex-col gap-4 p-5 bg-dark-800/50 rounded-2xl border border-dark-700/50 shadow-sm hover:border-dark-600 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-dark-100 text-lg">{c.category}</span>
                      <p className="text-sm text-dark-400 mt-1">{c.lowCount} of {c.total} products low</p>
                    </div>
                    <Badge variant={c.percentage >= 50 ? 'danger' : 'warning'} className="px-3 py-1 text-sm shadow-lg">{c.percentage.toFixed(0)}%</Badge>
                  </div>
                  <div className="w-full bg-dark-900 rounded-full h-3 shadow-inner overflow-hidden border border-dark-700">
                    <div className={`h-3 rounded-full transition-all duration-1000 ${c.percentage >= 50 ? 'bg-accent-rose' : 'bg-accent-amber'}`} style={{ width: `${Math.min(c.percentage, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LowStockReport;