import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/reports': 'Reports',
};

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDetail = location.pathname.startsWith('/products/');
  const title = isDetail ? 'Product Detail' : (titles[location.pathname] || 'StockPilot');

  return (
    <header className="bg-dark-900/60 backdrop-blur-md border-b border-dark-700/50 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {isDetail && (
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-dark-800/50 hover:bg-dark-700 text-dark-300 hover:text-dark-100 transition-all border border-dark-700/50">
            <ArrowLeft size={18} />
          </button>
        )}
        <h2 className="text-2xl font-bold text-dark-100 tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
      </div>
    </header>
  );
};

export default Header;