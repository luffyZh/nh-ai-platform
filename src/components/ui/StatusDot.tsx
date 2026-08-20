import React from 'react';

interface StatusDotProps {
  status: string;
}

const colorMap: Record<string, string> = {
  '正常': 'bg-emerald-500',
  '风险': 'bg-amber-500',
  '延期': 'bg-red-500',
  '已发送': 'bg-emerald-500',
  '待确认': 'bg-amber-500',
};

const StatusDot: React.FC<StatusDotProps> = ({ status }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colorMap[status] || 'bg-slate-400'}`}></div>
      <span className="text-sm text-slate-600">{status}</span>
    </div>
  );
};

export default StatusDot;
