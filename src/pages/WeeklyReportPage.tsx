import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Tag from '../components/ui/Tag';
import StatusDot from '../components/ui/StatusDot';
import Drawer from '../components/ui/Drawer';
import { MOCK_REPORTS } from '../mock/reportMock';
import type { WeeklyReport } from '../mock/reportMock';

const WeeklyReportPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<WeeklyReport | null>(null);

  const handleView = (report: WeeklyReport) => {
    setCurrentReport(report);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索周报标题"
              className="w-64 h-9 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
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
            {MOCK_REPORTS.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{report.title}</td>
                <td className="px-6 py-4 text-slate-600">{report.product}</td>
                <td className="px-6 py-4 text-slate-600">{report.author}</td>
                <td className="px-6 py-4">
                  <Tag color="slate">{report.dept}</Tag>
                </td>
                <td className="px-6 py-4">
                  <StatusDot status={report.status} />
                </td>
                <td className="px-6 py-4 text-slate-500">{report.date}</td>
                <td className="px-6 py-4 text-right">
                  <span
                    onClick={() => handleView(report)}
                    className="cursor-pointer px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-sm font-medium text-blue-600"
                  >
                    查看
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="周报详情 (Markdown 预览)"
      >
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
              <h2 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">
                一、 本周核心进展
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-2 text-sm">
                <li>完成 {currentReport.product} 的核心架构设计评审。</li>
                <li>与硬件部门对齐了 BOM 成本，当前偏差率控制在 5% 以内。</li>
                <li>输出 PRD v2.0，已提交内部知识库。</li>
              </ul>

              <h2 className="text-lg font-bold text-slate-800 border-l-4 border-amber-500 pl-3 mt-6">
                二、 存在的风险与问题
              </h2>
              <p className="text-sm pl-2 bg-amber-50 p-3 rounded-lg text-amber-800">
                ⚠️ 供应商 A 的芯片交期可能延误 1 周，需要 PMO 协助协调备用供应商资源。
              </p>

              <h2 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 mt-6">
                三、 下周计划
              </h2>
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

export default WeeklyReportPage;
