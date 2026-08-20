import React from 'react';
import { Search, Plus } from 'lucide-react';
import Tag from '../components/ui/Tag';
import { MOCK_DEPTS } from '../mock/deptMock';

const DepartmentManagementPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索部门名称"
              className="w-64 h-9 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm">
          <Plus className="w-4 h-4" /> 新建部门
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">部门名称</th>
              <th className="px-6 py-4 font-semibold">上级部门</th>
              <th className="px-6 py-4 font-semibold">部门负责人</th>
              <th className="px-6 py-4 font-semibold">部门人数</th>
              <th className="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {MOCK_DEPTS.map((dept) => (
              <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{dept.name}</td>
                <td className="px-6 py-4 text-slate-500">{dept.parent}</td>
                <td className="px-6 py-4 text-slate-600">{dept.manager}</td>
                <td className="px-6 py-4">
                  <Tag color="blue">{dept.count} 人</Tag>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="cursor-pointer text-sm font-medium text-blue-600 mr-4">编辑</span>
                  <span className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600">
                    删除
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentManagementPage;
