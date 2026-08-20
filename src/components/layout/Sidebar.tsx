import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Lightbulb,
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Building2,
  Users,
  Shield,
} from 'lucide-react';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: '产品创意中心',
    items: [
      { label: '创意大盘', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: '创意管理', path: '/ideas', icon: <Lightbulb className="w-5 h-5" /> },
    ],
  },
  {
    title: '产品线管理',
    items: [
      { label: '产品大盘', path: '/products', icon: <FolderKanban className="w-5 h-5" /> },
      { label: '周报管理', path: '/reports', icon: <BookOpen className="w-5 h-5" /> },
    ],
  },
  {
    title: '系统管理',
    items: [
      { label: '部门管理', path: '/departments', icon: <Building2 className="w-5 h-5" /> },
      { label: '人员管理', path: '/users', icon: <Users className="w-5 h-5" /> },
      { label: '权限管理', path: '/permissions', icon: <Shield className="w-5 h-5" /> },
    ],
  },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-10">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
          <img src="/favicon.svg" alt="NHY AI-PLM" className="w-6 h-6" />
        </div>
        <span className="font-bold text-slate-800 text-lg tracking-tight">类脑资源管理平台</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">
              {group.title}
            </div>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
