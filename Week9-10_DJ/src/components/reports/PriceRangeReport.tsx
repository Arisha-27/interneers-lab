import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInventory } from '../../context/InventoryContext';
import { PRICE_RANGES } from '../../types';
import { exportToCSV } from '../../utils/csvExport';
import { Download } from 'lucide-react';

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

const PriceRangeReport: React.FC = () => {
  const { products } = useInventory();

  const { categories, chartData } = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    const data = PRICE_RANGES.map(range => {
      const row: Record<string, string | number> = { range: range.label };
      cats.forEach(cat => {
        row[cat] = products.filter(p => p.category === cat && p.price >= range.min && p.price < range.max).length;
      });
      return row;
    });
    return { categories: cats, chartData: data };
  }, [products]);

  const handleExport = () => {
    const headers = ['Price Range', ...categories];
    const rows = chartData.map(row => [row['range'], ...categories.map(c => row[c] || 0)] as (string | number)[]);
    exportToCSV('price-range-report', headers, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-end">
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-dark-100 rounded-xl text-sm font-medium transition-all border border-dark-700/50 shadow-sm">
          <Download size={14} /> Export CSV
        </button>
      </div>
      
      <div className="bg-dark-900/50 p-4 rounded-2xl border border-dark-700/30">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ borderRadius: '12px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#f8fafc' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: '#94a3b8' }} />
            {categories.map((cat, i) => (
              <Bar key={cat} dataKey={cat} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} stackId="a" maxBarSize={60} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto bg-dark-800/30 rounded-2xl border border-dark-700/50">
        <table className="w-full text-sm">
          <thead className="bg-dark-900/50">
            <tr className="border-b border-dark-700/50">
              <th className="text-left py-4 px-6 text-xs font-bold text-dark-400 uppercase tracking-wider">Price Range</th>
              {categories.map(cat => (
                <th key={cat} className="text-right py-4 px-6 text-xs font-bold text-dark-400 uppercase tracking-wider">{cat}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chartData.map(row => (
              <tr key={String(row['range'])} className="border-b border-dark-700/30 hover:bg-dark-700/20 transition-colors">
                <td className="py-4 px-6 font-bold text-dark-200">{row['range']}</td>
                {categories.map(cat => (
                  <td key={cat} className="py-4 px-6 text-right text-dark-300 font-medium">{row[cat] || 0}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceRangeReport;