import React from 'react';

type TagColor =
  | 'blue'
  | 'slate'
  | 'emerald'
  | 'amber'
  | 'red'
  | 'violet'
  | 'indigo'
  | 'sky'
  | 'orange'
  | 'rose'
  | 'phase-concept'
  | 'phase-prototype'
  | 'phase-evt'
  | 'phase-dvt'
  | 'phase-mp';

type TagSize = 'sm' | 'md';

interface TagProps {
  children: React.ReactNode;
  color?: TagColor;
  size?: TagSize;
}

const colorMap: Record<TagColor, string> = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  slate: 'bg-slate-50 text-slate-600 border-slate-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  violet: 'bg-violet-50 text-violet-600 border-violet-200',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  sky: 'bg-sky-50 text-sky-600 border-sky-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  rose: 'bg-rose-50 text-rose-600 border-rose-200',
  'phase-concept': 'bg-slate-50 text-slate-700 border-slate-300',
  'phase-prototype': 'bg-blue-50 text-blue-700 border-blue-300',
  'phase-evt': 'bg-violet-50 text-violet-700 border-violet-300',
  'phase-dvt': 'bg-amber-50 text-amber-700 border-amber-300',
  'phase-mp': 'bg-emerald-50 text-emerald-700 border-emerald-300',
};

const sizeMap: Record<TagSize, string> = {
  sm: 'px-2 py-0.5 rounded-md text-[11px] font-bold',
  md: 'px-2.5 py-1 rounded-md text-xs font-bold',
};

const Tag: React.FC<TagProps> = ({ children, color = 'blue', size = 'md' }) => {
  return (
    <span className={`inline-flex items-center border ${colorMap[color]} ${sizeMap[size]}`}>
      {children}
    </span>
  );
};

export default Tag;
