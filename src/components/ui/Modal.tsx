import React from 'react';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
}

const sizeMap: Record<ModalSize, string> = {
  sm: 'w-[400px]',
  md: 'w-[520px]',
  lg: 'w-[680px]',
  xl: 'w-[860px]',
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative ${sizeMap[size]} max-w-full bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]`}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
