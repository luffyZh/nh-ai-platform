import React from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
  showHeader?: boolean;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-[520px]',
  showHeader = true,
}) => {
  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${isOpen ? 'visible' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-slate-900/30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`relative ${width} bg-white h-full shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
      >
        {showHeader && (
          <div className="h-16 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        )}
        <div className="overflow-hidden flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
