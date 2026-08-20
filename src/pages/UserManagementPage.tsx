import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import Tag from '../components/ui/Tag';
import StatusDot from '../components/ui/StatusDot';
import Modal from '../components/ui/Modal';
import { MOCK_USERS } from '../mock/userMock';

const UserManagementPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索姓名/账号"
              className="w-64 h-9 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm"
        >
          <Plus className="w-4 h-4" /> 新建人员
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">姓名</th>
              <th className="px-6 py-4 font-semibold">账号</th>
              <th className="px-6 py-4 font-semibold">所属部门</th>
              <th className="px-6 py-4 font-semibold">系统角色</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {MOCK_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                <td className="px-6 py-4 text-slate-500">{user.account}</td>
                <td className="px-6 py-4">
                  <Tag color="slate">{user.dept}</Tag>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.role}</td>
                <td className="px-6 py-4">
                  <StatusDot status={user.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="cursor-pointer text-sm font-medium text-blue-600 mr-4">编辑</span>
                  <span className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600">
                    禁用
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="新建人员与部门绑定"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="请输入真实姓名"
              className="w-full h-10 rounded-xl border border-slate-200 px-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              所属部门 <span className="text-red-500">*</span>
            </label>
            <select className="w-full h-10 rounded-xl border border-slate-200 px-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500">
              <option value="">请选择绑定部门</option>
              <option>软件中心</option>
              <option>硬件一部</option>
              <option>算法二部</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">分配角色</label>
            <select className="w-full h-10 rounded-xl border border-slate-200 px-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500">
              <option>普通员工</option>
              <option>产品经理</option>
              <option>部门负责人</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
            >
              取消
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm"
            >
              确认保存
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
