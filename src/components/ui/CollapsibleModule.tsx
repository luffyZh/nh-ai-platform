import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

export interface CollapsibleModuleProps {
  index?: number | string;
  title: string;
  itemCount?: number;
  defaultOpen?: boolean;
  selected?: boolean;
  draggable?: boolean;
  className?: string;
  onToggle?: (open: boolean) => void;
  children?: React.ReactNode;
}

const CollapsibleModule: React.FC<CollapsibleModuleProps> = ({
  index,
  title,
  itemCount,
  defaultOpen = true,
  selected = false,
  draggable = true,
  className = '',
  onToggle,
  children,
}) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const handleToggle = (): void => {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  return (
    <div
      className={`
        relative w-full rounded-2xl bg-white transition-all duration-200
        ${selected
          ? 'ring-2 ring-blue-500/70 ring-offset-1 shadow-[0_4px_20px_-8px_rgba(59,130,246,0.35)]'
          : 'border border-slate-200 shadow-sm hover:border-slate-300'
        }
        ${className}
      `}
    >
      {/* 模块头部：拖拽把手(左) → 选中蓝条 → 序号标题 → 数量徽章 → 弹性空间 → Chevron(最右) */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none group"
        onClick={handleToggle}
      >
        {/* 1. 最左：6 点拖拽把手 */}
        {draggable && (
          <div
            title="拖拽排序"
            className="flex-shrink-0 p-1 rounded-md text-slate-300 group-hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        {/* 2. 蓝色选中态侧条（选中时显示） */}
        <div
          className={`flex-shrink-0 w-1 h-6 rounded-full transition-colors ${
            selected ? 'bg-blue-500' : 'bg-transparent'
          }`}
        />

        {/* 3. 序号标题（序号和标题合并为一个整体，紧凑排列） */}
        <span className="flex-shrink-0 min-w-0 flex items-center gap-1.5">
          {index !== undefined && (
            <span className="text-[15px] font-black text-slate-700 tabular-nums">
              {index}.
            </span>
          )}
          <span className="truncate text-[15px] font-black text-slate-800">
            {title}
          </span>
        </span>

        {/* 4. 数量徽章（N 项）：紧跟在标题后面 */}
        {itemCount !== undefined && (
          <span className="flex-shrink-0 inline-flex items-center justify-center min-w-[2.25rem] px-2 h-6 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500 border border-slate-200/80">
            {itemCount} 项
          </span>
        )}

        {/* 5. 弹性空间：把 Chevron 推到最右侧 */}
        <div className="flex-1 min-w-0" />

        {/* 6. 最右：折叠 Chevron（核心需求点） */}
        <button
          type="button"
          aria-label={open ? '折叠模块' : '展开模块'}
          className={`
            flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl
            transition-all duration-200
            ${selected
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
        >
          {open ? (
            <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* 展开内容区：和头部之间加分隔线 */}
      {open && (
        <div className="border-t border-slate-100 px-6 py-6 space-y-6 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleModule;
