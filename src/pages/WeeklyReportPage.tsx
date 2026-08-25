import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileEdit, Eye } from 'lucide-react';
import Tag from '../components/ui/Tag';
import StatusDot from '../components/ui/StatusDot';
import { useReportStore } from '../store/reportStore';
import type { ReportStatus } from '../types/report';

const STATUS_TABS: (ReportStatus | '全部')[] = ['全部', '草稿', '待确认', '已发送'];

const STATUS_COLOR: Record<ReportStatus, 'slate' | 'amber' | 'emerald'> = {
  草稿: 'slate',
  待确认: 'amber',
  已发送: 'emerald',
};

const WeeklyReportPage: React.FC = () => {
  const navigate = useNavigate();
  const reports = useReportStore((s) => s.reports);
  const initDraft = useReportStore((s) => s.initDraft);

  const [activeTab, setActiveTab] = useState<ReportStatus | '全部'>('全部');
  const [keyword, setKeyword] = useState('');

  const counts = useMemo(() => {
    const c: Record<string, number> = { 全部: reports.length };
    (['草稿', '待确认', '已发送'] as ReportStatus[]).forEach((st) => {
      c[st] = reports.filter((r) => r.status === st).length;
    });
    return c;
  }, [reports]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (activeTab !== '全部' && r.status !== activeTab) return false;
      if (keyword) {
        const k = keyword.toLowerCase();
        const inTitle = r.title.toLowerCase().includes(k);
        const inAuthor = r.author.toLowerCase().includes(k);
        const inProduct = r.items.some((it) => it.productName.toLowerCase().includes(k));
        if (!inTitle && !inAuthor && !inProduct) return false;
      }
      return true;
    });
  }, [reports, activeTab, keyword]);

  const handleNew = () => {
    const id = initDraft();
    navigate(`/reports/${id}/edit`);
  };

  const handleView = (id: string) => navigate(`/reports/${id}/edit`);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索周报标题 / 汇报人 / 关联项目名"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-80 h-9 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select className="h-9 rounded-xl border border-slate-200 px-3 bg-slate-50 text-sm text-slate-600 outline-none">
            <option>所有部门</option>
            <option>软件中心</option>
            <option>硬件一部</option>
            <option>算法二部</option>
          </select>
          <select className="h-9 rounded-xl border border-slate-200 px-3 bg-slate-50 text-sm text-slate-600 outline-none">
            <option>所有人员</option>
            <option>吴经理</option>
            <option>张伟</option>
            <option>李娜</option>
            <option>王强</option>
          </select>
        </div>

        <button
          onClick={handleNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-sm text-white text-sm font-bold transition-all"
        >
          <Plus className="w-4 h-4" />
          新建周报
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === t
                ? 'bg-white shadow-sm border border-slate-200 text-slate-900'
                : 'text-slate-500 hover:bg-white/60 border border-transparent'
            }`}
          >
            {t}
            <span
              className={`ml-1.5 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs ${
                activeTab === t ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts[t] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">周报标题</th>
              <th className="px-6 py-4 font-semibold">关联项目</th>
              <th className="px-6 py-4 font-semibold">汇报人</th>
              <th className="px-6 py-4 font-semibold">所属部门</th>
              <th className="px-6 py-4 font-semibold">周期</th>
              <th className="px-6 py-4 font-semibold">条目</th>
              <th className="px-6 py-4 font-semibold">状态</th>
              <th className="px-6 py-4 font-semibold">更新时间</th>
              <th className="px-6 py-4 font-semibold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-20 text-center text-slate-400">
                  暂无周报，点右上角「新建周报」开始
                </td>
              </tr>
            ) : (
              filtered.map((report) => {
                const productSet = Array.from(new Set(report.items.map((it) => it.productName)));
                return (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{report.title}</td>
                    <td className="px-6 py-4 max-w-xs">
                      {productSet.length === 0 ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {productSet.slice(0, 3).map((p) => (
                            <Tag key={p} color="slate">
                              {p}
                            </Tag>
                          ))}
                          {productSet.length > 3 && (
                            <Tag color="slate">+{productSet.length - 3}</Tag>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{report.author}</td>
                    <td className="px-6 py-4">
                      <Tag color="slate">{report.dept}</Tag>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{report.weekLabel.replace(/第\s*/, '第').split('(')[0]}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {report.items.length} 条
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusDot status={report.status} />
                        <Tag color={STATUS_COLOR[report.status]}>{report.status}</Tag>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{report.updatedAt}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {report.status === '草稿' ? (
                        <button
                          onClick={() => handleView(report.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-sm font-medium text-indigo-600"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                          继续编辑
                        </button>
                      ) : (
                        <button
                          onClick={() => handleView(report.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-sm font-medium text-blue-600"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          查看
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyReportPage;
