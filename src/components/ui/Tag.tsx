import React from 'react';

type TagColor = 'blue' | 'slate' | 'emerald' | 'amber' | 'red';

interface TagProps {
  children: React.ReactNode;
  color?: TagColor;
}

const colorMap: Record<TagColor, string> = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  slate: 'bg-slate-50 text-slate-600 border-slate-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  red: 'bg-red-50 text-red-600 border-red-200',
};

const Tag: React.FC<TagProps> = ({ children, color = 'blue' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${colorMap[color]}`}>
      {children}
    </span>
  );
};

export default Tag;
