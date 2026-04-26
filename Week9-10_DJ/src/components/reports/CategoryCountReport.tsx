import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useInventory } from '../../context/InventoryContext';
import { getCategoryProductCounts } from '../../utils/reportHelpers';
import { exportToCSV } from '../../utils/csvExport';
import { Download, Filter } from 'lucide-react';

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

const CategoryCountReport: React.FC = () => {
  const { products } = useInventory();
  const [minCount, setMinCount] = useState(0);
  const [maxCount, setMaxCount] = useState(1000);

  const data = useMemo(() => {
    const counts = getCategoryProductCounts(products);
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .filter(d => d.count >= minCount && d.count <= maxCount)
      .sort((a, b) => b.count - a.count);
  }, [products, minCount, maxCount]);

  const handleExport = () => {
    exportToCSV('category-count-report', ['Category', 'Product Count'], data.map(d => [d.category, d.count]));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-dark-800/80 rounded-2xl border border-dark-700/50 shadow-inner">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-dark-300 uppercase tracking-wider">
            <Filter size={16} className="text-brand-500" /> Filter by count
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-dark-500 font-medium">Min</label>
            <input type="number" min={0} value={minCount} onChange={e => setMinCount(+e.target.value || 0)} className="w-20 px-3 py-2 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 transition-all shadow-inner" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-dark-500 font-medium">Max</label>
            <input type="number" min={0} value={maxCount} onChange={e => setMaxCount(+e.target.value || 1000)} className="w-20 px-3 py-2 text-sm bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-dark-100 transition-all shadow-inner" />
          </div>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-100 rounded-xl text-sm font-medium transition-all border border-dark-600 hover:border-dark-500 shadow-sm">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-16 text-dark-500 font-medium">No categories match the filter range.</div>
      ) : (
        <>
          <div className="bg-dark-900/50 p-4 rounded-2xl border border-dark-700/30">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ borderRadius: '12px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#f8fafc' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto bg-dark-800/30 rounded-2xl border border-dark-700/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700/50 bg-dark-900/50">
                  <th className="text-left py-4 px-6 text-xs font-bold text-dark-400 uppercase tracking-wider">Category</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-dark-400 uppercase tracking-wider">Product Count</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-dark-400 uppercase tracking-wider">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={row.category} className="border-b border-dark-700/30 hover:bg-dark-700/20 transition-colors">
                    <td className="py-4 px-6 font-medium text-dark-200">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ background: COLORS[i % COLORS.length] }} />
                        {row.category}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-dark-100">{row.count}</td>
                    <td className="py-4 px-6 text-right text-dark-400 font-medium">{((row.count / products.length) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryCountReport;