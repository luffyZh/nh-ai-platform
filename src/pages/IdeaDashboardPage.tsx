import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Activity, AlertCircle } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { RADAR_DATA, BAR_DATA } from '../mock/metricsMock';
import { useIdeaStore } from '../store/ideaStore';
import IdeaListPage from './IdeaListPage';
import type { IdeaStatus } from '../types/idea';
import Tag from '../components/ui/Tag';

const statusTagColor: Record<IdeaStatus, 'slate' | 'emerald' | 'amber' | 'red'> = {
  草稿: 'slate',
  评审中: 'amber',
  孵化中: 'emerald',
  未通过: 'red',
};

const IdeaDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { ideas } = useIdeaStore();
  const [tab, setTab] = useState<'dashboard' | 'ideas'>('dashboard');

  const totalIdeas = ideas.length;
  const incubated = ideas.filter((i) => i.status === '孵化中').length;
  const pendingClaim = ideas.filter((i) => i.status === '孵化中' && !i.assignedPm).length;
  const topIdeas = [...ideas]
    .filter((i) => i.status !== '草稿' && i.summary)
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 4);

  if (tab === 'ideas') {
    return <IdeaListPage />;
  }

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-hidden animate-in fade-in duration-500">
      <div className="flex justify-between items-end flex-wrap gap-3 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <div>
            <h2 className="text-xl font-black text-slate-800">全院创意与效能大盘</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              数据更新时间：2026-08-17 14:00 · 本页仅展示院级汇总，切 Tab 到「创意机会池」可管理具体提案
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select className="h-9 rounded-xl border border-slate-200 px-4 bg-white text-sm text-slate-700 font-bold outline-none shadow-sm focus:ring-2 focus:ring-blue-500">
            <option>全部部门 (全局)</option>
            <option>硬件一部</option>
            <option>硬件二部</option>
            <option>算法中心</option>
            <option>软件中心</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-500 font-medium">累计创意提案</div>
            <div className="text-3xl font-black text-slate-800 mt-1 tabular-nums">
              {totalIdeas} <span className="text-sm font-normal text-slate-400 ml-1">个</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-500 font-medium">孵化中（已立项）</div>
            <div className="text-3xl font-black text-slate-800 mt-1 tabular-nums">
              {incubated} <span className="text-sm font-normal text-amber-500 ml-1">+{pendingClaim} 待认领</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-500 font-medium">全局综合效能得分</div>
            <div className="text-3xl font-black text-slate-800 mt-1 tabular-nums">
              92.5 <span className="text-sm font-normal text-emerald-500 ml-1">+1.2%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-500 font-medium">当前延期 / 风险项目</div>
            <div className="text-3xl font-black text-slate-800 mt-1 tabular-nums">
              5 <span className="text-sm font-normal text-slate-400 ml-1">项</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col min-h-0">
          <h3 className="text-sm font-black text-slate-800 mb-3 flex-shrink-0">全局核心能力雷达图</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Radar
                  name="全院平均"
                  dataKey="A"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col">
            <h3 className="text-sm font-black text-slate-800 mb-3 flex-shrink-0">重点项目效能指标达成对比</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BAR_DATA} margin={{ top: 5, right: 15, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  <Bar dataKey="期望值" fill="#cbd5e1" radius={[3, 3, 0, 0]} barSize={16} />
                  <Bar dataKey="实际值" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h3 className="text-sm font-black text-slate-800">🏆 高潜创意 TOP（AI 评分）</h3>
              <button
                onClick={() => setTab('ideas')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                查看全部 →
              </button>
            </div>
            {topIdeas.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm">
                <Lightbulb className="w-8 h-8 mb-2 text-slate-300" />
                暂无评分数据，先新建创意提案吧！
              </div>
            ) : (
              <div className="flex-1 min-h-0 space-y-2 overflow-y-auto">
                {topIdeas.map((idea, idx) => (
                  <div
                    key={idea.id}
                    onClick={() =>
                      navigate(idea.status === '草稿' ? `/ideas/${idea.id}/wizard` : `/ideas/${idea.id}/prd`)
                    }
                    className="group rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 p-3 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                          idx === 0
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                            : idx === 1
                            ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
                            : idx === 2
                            ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600">
                            {idea.title}
                          </div>
                          <div className="flex-shrink-0 text-sm font-black text-slate-800 tabular-nums">
                            {idea.aiScore}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <Tag color={statusTagColor[idea.status]}>{idea.status}</Tag>
                          <span className="text-xs text-slate-400 truncate">
                            {idea.dept} · {idea.author}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDashboardPage;
