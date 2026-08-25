import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronDown, RefreshCw } from 'lucide-react';

const pathNameMap: Record<string, string> = {
  '/': '创意大盘',
  '/products': '产品大盘',
  '/reports': '周报管理',
  '/departments': '部门管理',
  '/users': '人员管理',
  '/permissions': '权限管理',
};

const NHY_STORAGE_KEYS = ['nhy-idea-store', 'nhy-product-store'];

const Header: React.FC = () => {
  const location = useLocation();
  const currentPageName = pathNameMap[location.pathname] || '页面';

  const handleReset = () => {
    const ok = window.confirm(
      '确认重置所有演示数据？\n\n将清空创意管理与产品大盘的全部本地缓存，并刷新页面回到初始状态。'
    );
    if (!ok) return;
    NHY_STORAGE_KEYS.forEach((k) => window.localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-0">
      <div className="flex items-center text-sm text-slate-500">
        <span>首页</span>
        <span className="mx-2">/</span>
        <span className="text-slate-800 font-medium">{currentPageName}</span>
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={handleReset}
          title="重置演示数据并刷新"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-xs font-bold">重置演示</span>
        </button>
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-slate-500 hover:text-slate-700" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
        </div>
        <div className="h-5 w-px bg-slate-200"></div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            PM
          </div>
          <span className="text-sm font-medium text-slate-700">吴经理</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
