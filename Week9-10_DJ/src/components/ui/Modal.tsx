import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative glass-panel rounded-2xl w-full ${sizeMap[size]} max-h-[90vh] overflow-auto border border-dark-700/50 shadow-glow`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-dark-700/50">
          <h3 className="text-xl font-bold text-dark-100">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-dark-800/50 hover:bg-dark-700 text-dark-400 hover:text-dark-100 transition-all border border-dark-700/50">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-6 bg-dark-900/50">{children}</div>
      </div>
    </div>
  );
};