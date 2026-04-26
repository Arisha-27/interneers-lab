import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, FileText, TrendingUp } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

const Sidebar: React.FC = () => (
  <aside className="w-64 min-h-screen bg-dark-800/40 backdrop-blur-xl border-r border-dark-700/50 flex flex-col shadow-2xl relative z-10">
    <div className="px-6 py-6 border-b border-dark-700/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-glow">
          <TrendingUp size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl leading-tight font-display tracking-tight">StockPilot</h1>
          <p className="text-brand-400 text-xs font-medium">Inventory Manager</p>
        </div>
      </div>
    </div>
    <nav className="flex-1 px-4 py-6 space-y-2">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]'
                : 'text-dark-400 hover:bg-dark-700/30 hover:text-dark-100'
            }`
          }
        >
          <Icon size={18} className={({ isActive }) => (isActive ? 'text-brand-400' : 'text-dark-500')} />
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="px-6 py-5 border-t border-dark-700/50 bg-dark-800/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-brand-600 rounded-full flex items-center justify-center p-[2px]">
          <div className="w-full h-full bg-dark-900 rounded-full flex items-center justify-center">
            <span className="text-dark-100 text-xs font-bold">AD</span>
          </div>
        </div>
        <div>
          <p className="text-dark-100 text-sm font-medium">Admin User</p>
          <p className="text-dark-500 text-xs">admin@stockpilot.io</p>
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;