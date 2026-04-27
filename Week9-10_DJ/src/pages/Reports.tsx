import React, { useState } from 'react';
import CategoryCountReport from '../components/reports/CategoryCountReport';
import PriceRangeReport from '../components/reports/PriceRangeReport';
import LowStockReport from '../components/reports/LowStockReport';
import { BarChart3, DollarSign, AlertTriangle } from 'lucide-react';

const tabs = [
  { id: 'category', label: 'Category Count', icon: BarChart3, desc: 'Products per category with range filter' },
  { id: 'price', label: 'Price Distribution', icon: DollarSign, desc: 'Products across price segments' },
  { id: 'lowstock', label: 'Low Stock', icon: AlertTriangle, desc: 'Items & categories running low' },
];

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('category');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-dark-100">Inventory Reports</h2>
        <p className="text-dark-400 text-sm mt-1">Analyze your inventory with detailed insights and visualizations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs.map(({ id, label, icon: Icon, desc }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`p-5 rounded-2xl border text-left transition-all duration-300 ${activeTab === id ? 'border-brand-500/50 bg-brand-500/10 shadow-glow' : 'border-dark-700/50 bg-dark-800/40 hover:border-dark-600 hover:bg-dark-800/80'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${activeTab === id ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-dark-900 border border-dark-700 text-dark-400'}`}>
              <Icon size={20} />
            </div>
            <p className={`text-base font-bold mb-1 ${activeTab === id ? 'text-brand-400' : 'text-dark-100'}`}>{label}</p>
            <p className="text-xs font-medium text-dark-400">{desc}</p>
          </button>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-6 min-h-[500px]">
        {activeTab === 'category' && <CategoryCountReport />}
        {activeTab === 'price' && <PriceRangeReport />}
        {activeTab === 'lowstock' && <LowStockReport />}
      </div>
    </div>
  );
};

export default Reports;