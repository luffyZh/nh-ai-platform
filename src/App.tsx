import React, { useState } from 'react';
import { 
  Lightbulb, FolderKanban, BookOpen, Users, 
  Bell, Search, Plus, ChevronDown, LayoutDashboard, 
  Activity, AlertCircle, X, Shield, Building2
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// --- Mock Data ---
const MOCK_PRODUCTS = [
  { id: 'P-2026001', name: 'NHY 智能座舱语音助手 V2.0', pm: '张伟', depts: ['算法一部', '软件中心'], phase: 'EVT', health: '正常', date: '2026-08-01' },
  { id: 'P-2026002', name: '高精度自动驾驶视觉感知模组', pm: '李娜', depts: ['硬件二部', '算法二部'], phase: '原型期', health: '风险', date: '2026-08-10' },
  { id: 'P-2026003', name: '新一代车载无线充电面板', pm: '王强', depts: ['硬件一部', '测试中心'], phase: 'DVT', health: '正常', date: '2026-07-15' },
];

const MOCK_REPORTS = [
  { id: 'R-001', title: '智能座舱 V2.0 - 第32周进展汇报', product: '智能座舱 V2.0', author: '张伟', dept: '软件中心', date: '2026-08-14', status: '已发送' },
  { id: 'R-002', title: '视觉感知模组 - 算法迭代周报', product: '视觉感知模组', author: '李娜', dept: '算法二部', date: '2026-08-14', status: '待确认' },
  { id: 'R-003', title: '无线充电面板 - EVT打样总结', product: '无线充电面板', author: '王强', dept: '硬件一部', date: '2026-08-13', status: '已发送' },
];

const MOCK_USERS = [
  { id: 'U-1001', name: '张伟', account: 'zhangwei', dept: '软件中心', role: '产品经理', status: '正常' },
  { id: 'U-1002', name: '李娜', account: 'lina', dept: '算法二部', role: '项目经理', status: '正常' },
  { id: 'U-1003', name: '王强', account: 'wangqiang', dept: '硬件一部', role: '部门负责人', status: '正常' },
];

const MOCK_DEPTS = [
  { id: 'D-001', name: '软件中心', parent: '研究院', manager: '刘总', count: 45 },
  { id: 'D-002', name: '算法二部', parent: '算法中心', manager: '赵总', count: 28 },
  { id: 'D-003', name: '硬件一部', parent: '硬件中心', manager: '王强', count: 32 },
];

const RADAR_DATA = [
  { subject: '交付及时率', A: 92, fullMark: 100 },
  { subject: '打样直通率', A: 85, fullMark: 100 },
  { subject: '成本控制率', A: 88, fullMark: 100 },
  { subject: '需求变更率', A: 82, fullMark: 100 },
  { subject: '文档合规率', A: 95, fullMark: 100 },
];

const BAR_DATA = [
  { name: '智能座舱 V2.0', 期望值: 95, 实际值: 96 },
  { name: '视觉感知模组', 期望值: 90, 实际值: 82 },
  { name: '无线充电面板', 期望值: 98, 实际值: 98 },
  { name: '疲劳监测系统', 期望值: 95, 实际值: 94 },
];

// --- UI Components ---
const Tag = ({ children, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${colorMap[color]}`}>
      {children}
    </span>
  );
};

const StatusDot = ({ status }) => {
  const colorMap = {
    '正常': 'bg-emerald-500', '风险': 'bg-amber-500', '延期': 'bg-red-500',
    '已发送': 'bg-emerald-500', '待确认': 'bg-amber-500'
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colorMap[status] || 'bg-slate-400'}`}></div>
      <span className="text-sm text-slate-600">{status}</span>
    </div>
  );
};

const Drawer = ({ isOpen, onClose, title, children }) => (
  <div className={`fixed inset-0 z-50 flex justify-end ${isOpen ? 'visible' : 'pointer-events-none'}`}>
    <div className={`absolute inset-0 bg-slate-900/30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
    <div className={`relative w-[600px] bg-white h-full shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
      <div className="h-16 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>
      <div className="p-8 overflow-y-auto flex-1">
        {children}
      </div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Views ---
const IdeaDashboardView = () => (
  <div className="p-6 space-y-6 animate-in fade-in duration-500">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-slate-800">全院创意与效能大盘</h2>
        <p className="text-sm text-slate-500 mt-1">数据更新时间：2026-08-17 14:00</p>
      </div>
      <select className="h-10 rounded-xl border border-slate-200 px-4 bg-white text-sm text-slate-700 font-bold outline-none shadow-sm focus:ring-2 focus:ring-blue-500">
        <option>全部部门 (全局)</option>
        <option>硬件一部</option>
        <option>硬件二部</option>
        <option>算法中心</option>
        <option>软件中心</option>
      </select>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm text-slate-500 font-medium">累计孵化创意</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">128 <span className="text-sm font-normal text-slate-400 ml-1">个</span></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm text-slate-500 font-medium">全局综合效能得分</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">92.5 <span className="text-sm font-normal text-emerald-500 ml-1">+1.2%</span></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm text-slate-500 font-medium">当前延期/风险项目</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">5 <span className="text-sm font-normal text-slate-400 ml-1">项</span></div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-6">全局核心能力雷达图</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
              <Radar name="全院平均" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-6">重点项目效能指标达成对比</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BAR_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="期望值" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="实际值" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

const ProductListView = () => (
  <div className="p-6 space-y-6 animate-in fade-in duration-500">
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="搜索产品名称/编号" className="w-64 h-9 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <select className="h-9 rounded-xl border border-slate-200 px-3 bg-slate-50 text-sm text-slate-600 outline-none">
          <option>所有阶段</option>
          <option>原型期</option>
          <option>EVT</option>
        </select>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm">
        <Plus className="w-4 h-4" /> 新建立项
      </button>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
            <th className="px-6 py-4 font-semibold">产品编号 / 名称</th>
            <th className="px-6 py-4 font-semibold">产品经理</th>
            <th className="px-6 py-4 font-semibold">参战部门</th>
            <th className="px-6 py-4 font-semibold">当前阶段</th>
            <th className="px-6 py-4 font-semibold">健康度</th>
            <th className="px-6 py-4 font-semibold text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {MOCK_PRODUCTS.map((prod, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-800 cursor-pointer hover:text-blue-600">{prod.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{prod.id}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">{prod.pm[0]}</div>
                  <span className="text-slate-600">{prod.pm}</span>
                </div>
              </td>
              <td className="px-6 py-4"><div className="flex gap-2">{prod.depts.map(d => <Tag key={d} color="slate">{d}</Tag>)}</div></td>
              <td className="px-6 py-4"><Tag color={prod.phase === 'MP' ? 'emerald' : 'blue'}>{prod.phase}</Tag></td>
              <td className="px-6 py-4"><StatusDot status={prod.health} /></td>
              <td className="px-6 py-4 text-right">
                <span className="cursor-pointer px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-sm font-medium text-blue-600">工作台</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const WeeklyReportView = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  const handleView = (report) => {
    setCurrentReport(report);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="搜索周报标题" className="w-64 h-9 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <select className="h-9 rounded-xl border border-slate-200 px-3 bg-slate-50 text-sm text-slate-600 outline-none">
            <option>所有部门</option>
            <option>软件中心</option>
            <option>硬件一部</option>
          </select>
          <select className="h-9 rounded-xl border border-slate-200 px-3 bg-slate-50 text-sm text-slate-600 outline-none">
            <option>所有人员</option>
            <option>张伟</option>
            <option>李娜</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">周报标题</th>
              <th className="px-6 py-4 font-semibold">关联产品</th>
              <th className="px-6 py-4 font-semibold">汇报人</th>
              <th className="px-6 py-4 font-semibold">所属部门</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">生成时间</th>
              <th className="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {MOCK_REPORTS.map((report, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{report.title}</td>
                <td className="px-6 py-4 text-slate-600">{report.product}</td>
                <td className="px-6 py-4 text-slate-600">{report.author}</td>
                <td className="px-6 py-4"><Tag color="slate">{report.dept}</Tag></td>
                <td className="px-6 py-4"><StatusDot status={report.status} /></td>
                <td className="px-6 py-4 text-slate-500">{report.date}</td>
                <td className="px-6 py-4 text-right">
                  <span onClick={() => handleView(report)} className="cursor-pointer px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-sm font-medium text-blue-600">查看</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="周报详情 (Markdown 预览)">
        {currentReport && (
          <div className="space-y-6 text-slate-700">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{currentReport.title}</h1>
              <div className="flex gap-4 text-sm text-slate-500 border-b border-slate-200 pb-4">
                <span>汇报人：{currentReport.author}</span>
                <span>部门：{currentReport.dept}</span>
                <span>日期：{currentReport.date}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">一、 本周核心进展</h2>
              <ul className="list-disc list-inside space-y-2 pl-2 text-sm">
                <li>完成 {currentReport.product} 的核心架构设计评审。</li>
                <li>与硬件部门对齐了 BOM 成本，当前偏差率控制在 5% 以内。</li>
                <li>输出 PRD v2.0，已提交内部知识库。</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-800 border-l-4 border-amber-500 pl-3 mt-6">二、 存在的风险与问题</h2>
              <p className="text-sm pl-2 bg-amber-50 p-3 rounded-lg text-amber-800">
                ⚠️ 供应商 A 的芯片交期可能延误 1 周，需要 PMO 协助协调备用供应商资源。
              </p>

              <h2 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 mt-6">三、 下周计划</h2>
              <ul className="list-decimal list-inside space-y-2 pl-2 text-sm">
                <li>发起 EVT 阶段第一次打样。</li>
                <li>完成软件底层驱动的联调测试。</li>
              </ul>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

const UserMgmtView = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="搜索姓名/账号" className="w-64 h-9 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm">
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
            {MOCK_USERS.map((user, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                <td className="px-6 py-4 text-slate-500">{user.account}</td>
                <td className="px-6 py-4"><Tag color="slate">{user.dept}</Tag></td>
                <td className="px-6 py-4 text-slate-600">{user.role}</td>
                <td className="px-6 py-4"><StatusDot status={user.status} /></td>
                <td className="px-6 py-4 text-right">
                  <span className="cursor-pointer text-sm font-medium text-blue-600 mr-4">编辑</span>
                  <span className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600">禁用</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="新建人员与部门绑定">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">姓名 <span className="text-red-500">*</span></label>
            <input type="text" placeholder="请输入真实姓名" className="w-full h-10 rounded-xl border border-slate-200 px-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">所属部门 <span className="text-red-500">*</span></label>
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
            <button onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold">取消</button>
            <button onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm">确认保存</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const DeptMgmtView = () => (
  <div className="p-6 space-y-6 animate-in fade-in duration-500">
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="搜索部门名称" className="w-64 h-9 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
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
          {MOCK_DEPTS.map((dept, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800">{dept.name}</td>
              <td className="px-6 py-4 text-slate-500">{dept.parent}</td>
              <td className="px-6 py-4 text-slate-600">{dept.manager}</td>
              <td className="px-6 py-4"><Tag color="blue">{dept.count} 人</Tag></td>
              <td className="px-6 py-4 text-right">
                <span className="cursor-pointer text-sm font-medium text-blue-600 mr-4">编辑</span>
                <span className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600">删除</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main App Layout ---
export default function App() {
  const [activeMenu, setActiveMenu] = useState('创意大盘');

  const renderContent = () => {
    switch (activeMenu) {
      case '创意大盘': return <IdeaDashboardView />;
      case '产品大盘': return <ProductListView />;
      case '周报管理': return <WeeklyReportView />;
      case '人员管理': return <UserMgmtView />;
      case '部门管理': return <DeptMgmtView />;
      case '权限管理': return <div className="p-6 text-slate-500 text-center mt-20">权限管理模块开发中...</div>;
      default: return <IdeaDashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">NHY AI-PLM</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">产品创意中心</div>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${activeMenu === '创意大盘' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} onClick={() => setActiveMenu('创意大盘')}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">创意大盘</span>
          </div>

          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-6">产品线管理</div>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${activeMenu === '产品大盘' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} onClick={() => setActiveMenu('产品大盘')}>
            <FolderKanban className="w-5 h-5" />
            <span className="text-sm">产品大盘</span>
          </div>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${activeMenu === '周报管理' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} onClick={() => setActiveMenu('周报管理')}>
            <BookOpen className="w-5 h-5" />
            <span className="text-sm">周报管理</span>
          </div>

          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-6">系统管理</div>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${activeMenu === '部门管理' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} onClick={() => setActiveMenu('部门管理')}>
            <Building2 className="w-5 h-5" />
            <span className="text-sm">部门管理</span>
          </div>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${activeMenu === '人员管理' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} onClick={() => setActiveMenu('人员管理')}>
            <Users className="w-5 h-5" />
            <span className="text-sm">人员管理</span>
          </div>
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${activeMenu === '权限管理' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} onClick={() => setActiveMenu('权限管理')}>
            <Shield className="w-5 h-5" />
            <span className="text-sm">权限管理</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-0">
          <div className="flex items-center text-sm text-slate-500">
            <span>首页</span>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-medium">{activeMenu}</span>
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

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}