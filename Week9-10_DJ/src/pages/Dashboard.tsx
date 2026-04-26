import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { Package, AlertTriangle, DollarSign, Tag, TrendingUp, ArrowRight, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { products } = useInventory();
  const navigate = useNavigate();

  const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
  const lowStock = products.filter(p => p.quantity < 10);
  const categories = [...new Set(products.map(p => p.category))];
  const recentProducts = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', change: '+12 this month' },
    { label: 'Low Stock Items', value: lowStock.length, icon: AlertTriangle, color: 'text-accent-amber', bg: 'bg-accent-amber/10', border: 'border-accent-amber/20', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', change: 'Need attention' },
    { label: 'Inventory Value', value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, icon: DollarSign, color: 'text-accent-teal', bg: 'bg-accent-teal/10', border: 'border-accent-teal/20', shadow: 'shadow-[0_0_15px_rgba(20,184,166,0.15)]', change: 'Total cost basis' },
    { label: 'Categories', value: categories.length, icon: Tag, color: 'text-accent-purple', bg: 'bg-accent-purple/10', border: 'border-accent-purple/20', shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', change: 'Active categories' },
  ];

  const chartData = useMemo(() => {
    return categories.map(cat => ({
      name: cat,
      value: products.filter(p => p.category === cat).reduce((s, p) => s + p.price * p.quantity, 0)
    })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [categories, products]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-dark-700/50 bg-dark-800">
        <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop" alt="Dashboard Banner" className="absolute right-0 top-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-800 via-dark-800/80 to-transparent"></div>
        <div className="relative h-full flex items-center justify-between px-8">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome to StockPilot</h2>
            <p className="text-brand-300/80 text-sm max-w-lg leading-relaxed">Here's what's happening with your inventory today. Monitor your stock levels, track performance, and make data-driven decisions.</p>
          </div>
          <button onClick={() => navigate('/reports')} className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-all text-sm border border-brand-500/50">
            View Reports <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color, bg, border, shadow, change }) => (
          <div key={label} className={`glass-panel rounded-2xl p-6 ${border} hover:border-dark-600 transition-all duration-300 group ${shadow}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${bg} ${border} rounded-xl flex items-center justify-center border`}>
                <Icon size={22} className={color} />
              </div>
              <div className="flex items-center gap-1 text-accent-teal text-xs font-semibold bg-accent-teal/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                <span>+2.4%</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-dark-100 tracking-tight">{value}</p>
            <p className="text-sm font-medium text-dark-300 mt-1">{label}</p>
            <p className="text-xs text-dark-500 mt-2">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-dark-100">Value by Category</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#1F2937'}}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#F3F4F6' }}
                  itemStyle={{ color: '#60A5FA' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3B82F6' : '#4B5563'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-dark-100 flex items-center gap-2">
              <AlertTriangle size={18} className="text-accent-amber" /> 
              Low Stock Alerts
            </h3>
            <button onClick={() => navigate('/reports')} className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
              All <ArrowUpRight size={14} />
            </button>
          </div>
          {lowStock.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-dark-500 py-8">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-4 border border-dark-700">
                <Package size={24} className="text-brand-500" />
              </div>
              <p className="font-medium text-dark-300">All stocked up! 🎉</p>
              <p className="text-sm mt-1 text-center">Your inventory is looking healthy.</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
              {lowStock.slice(0, 6).map(p => (
                <div key={p.id} onClick={() => navigate(`/products/${p.id}`)} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50 border border-dark-700/50 hover:bg-dark-700 hover:border-dark-600 cursor-pointer transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-dark-900 border border-dark-700 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                             onError={(e) => { (e.target as HTMLImageElement).style.display='none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }} />
                      ) : null}
                      <div className={`text-dark-500 absolute inset-0 flex items-center justify-center ${p.imageUrl ? 'hidden' : ''}`}>
                        <Package size={20} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-dark-100 truncate group-hover:text-brand-400 transition-colors">{p.name}</p>
                      <p className="text-xs text-dark-400 truncate">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm font-bold block ${p.quantity === 0 ? 'text-accent-rose' : 'text-accent-amber'}`}>{p.quantity} left</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-dark-100">Recent Products</h3>
          <button onClick={() => navigate('/products')} className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
            View Inventory <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentProducts.map(p => (
            <div key={p.id} onClick={() => navigate(`/products/${p.id}`)} className="cursor-pointer group rounded-xl overflow-hidden bg-dark-800/50 border border-dark-700/50 hover:border-brand-500/50 hover:shadow-glow transition-all">
              <div className="h-32 bg-dark-900 overflow-hidden relative flex items-center justify-center">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                       onError={(e) => { (e.target as HTMLImageElement).style.display='none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }} />
                ) : null}
                <div className={`text-dark-600 absolute inset-0 flex items-center justify-center ${p.imageUrl ? 'hidden' : ''}`}>
                  <Package size={32} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-dark-100 line-clamp-1 group-hover:text-brand-400 transition-colors">{p.name}</p>
                <p className="text-xs font-semibold text-brand-400 mt-1">${p.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;