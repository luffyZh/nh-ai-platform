import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';

const pathNameMap: Record<string, string> = {
  '/': '创意大盘',
  '/products': '产品大盘',
  '/reports': '周报管理',
  '/departments': '部门管理',
  '/users': '人员管理',
  '/permissions': '权限管理',
};

const Header: React.FC = () => {
  const location = useLocation();
  const currentPageName = pathNameMap[location.pathname] || '页面';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-0">
      <div className="flex items-center text-sm text-slate-500">
        <span>首页</span>
        <span className="mx-2">/</span>
        <span className="text-slate-800 font-medium">{currentPageName}</span>
      </div>
      <div className="flex items-center gap-5">
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
