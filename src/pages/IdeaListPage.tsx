import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Lightbulb, Filter, CheckCircle2, Trash2, Eye } from 'lucide-react';
import { useIdeaStore } from '../store/ideaStore';
import Tag from '../components/ui/Tag';
import Modal from '../components/ui/Modal';
import type { IdeaStatus } from '../types/idea';

const statusColorMap: Record<IdeaStatus, 'blue' | 'slate' | 'emerald' | 'amber' | 'red'> = {
  草稿: 'slate',
  已提交: 'blue',
  孵化中: 'emerald',
  已立项: 'emerald',
  已驳回: 'red',
};

const STATUS_FILTERS: (IdeaStatus | '全部')[] = ['全部', '草稿', '已提交', '孵化中', '已立项', '已驳回'];

const IdeaListPage: React.FC = () => {
  const navigate = useNavigate();
  const { ideas, claimIdea, deleteIdea, initDraft } = useIdeaStore();
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | '全部'>('全部');
  const [deptFilter, setDeptFilter] = useState('全部部门');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const departments = ['全部部门', ...Array.from(new Set(ideas.map((i) => i.dept)))];

  const visible = ideas.filter((i) => {
    if (statusFilter !== '全部' && i.status !== statusFilter) return false;
    if (deptFilter !== '全部部门' && i.dept !== deptFilter) return false;
    if (keyword.trim()) {
      const k = keyword.trim().toLowerCase();
      if (
        !i.title.toLowerCase().includes(k) &&
        !i.summary.toLowerCase().includes(k) &&
        !i.author.toLowerCase().includes(k)
      ) {
        return false;
      }
    }
    return true;
  });

  const counts = STATUS_FILTERS.reduce(
    (acc, s) => {
      acc[s] = s === '全部' ? ideas.length : ideas.filter((i) => i.status === s).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const handleNew = () => {
    const id = initDraft();
    navigate(`/ideas/${id}/wizard`);
  };

  const handleView = (id: string) => {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    if (idea.prdContent) {
      navigate(`/ideas/${id}/prd`);
    } else {
      navigate(`/ideas/${id}/wizard`);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-800">创意机会池</h2>
          <p className="text-sm text-slate-500 mt-1">
            全员提交的创意提案在这里孵化，PM 可认领并推进立项。当前共有{' '}
            <span className="font-bold text-blue-600">{ideas.length}</span> 个提案。
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm"
        >
          <Plus className="w-4 h-4" /> 新建创意提案
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {STATUS_FILTERS.map((s) => {
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s}
                <span
                  className={`ml-1.5 text-xs font-bold ${
                    active ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  {counts[s] || 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索创意名称 / 一句话简介 / 提交人"
                className="w-80 h-10 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 px-3 bg-slate-50 text-sm text-slate-600 outline-none"
              >
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-xs text-slate-400">筛选结果 {visible.length} 条</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {visible.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Lightbulb className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">当前筛选条件下暂无创意提案</p>
            <p className="text-xs mt-1">点击右上角「新建创意提案」做第一个吃螃蟹的人吧！</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">创意 ID / 名称</th>
                <th className="px-6 py-4 font-semibold">一句话简介</th>
                <th className="px-6 py-4 font-semibold">提交人 / 部门</th>
                <th className="px-6 py-4 font-semibold">当前状态</th>
                <th className="px-6 py-4 font-semibold">AI 评分</th>
                <th className="px-6 py-4 font-semibold">创建时间</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {visible.map((idea) => (
                <tr key={idea.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer" onClick={() => handleView(idea.id)}>
                      {idea.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{idea.id}</div>
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <div className="text-slate-600 text-sm line-clamp-2">{idea.summary || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {idea.author[0]}
                      </div>
                      <div>
                        <div className="text-slate-700 font-medium">{idea.author}</div>
                        <div className="text-xs text-slate-400">{idea.dept}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Tag color={statusColorMap[idea.status]}>{idea.status}</Tag>
                  </td>
                  <td className="px-6 py-4">
                    {idea.aiScore > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-black text-slate-800 tabular-nums">
                          {idea.aiScore}
                        </div>
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${
                              idea.aiScore >= 80
                                ? 'bg-emerald-500'
                                : idea.aiScore >= 60
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${idea.aiScore}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">— 待评审</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{idea.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleView(idea.id)}
                        className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-sm font-medium text-blue-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {idea.prdContent ? 'PRD' : '编辑'}
                      </button>
                      {idea.status === '已提交' && (
                        <button
                          onClick={() => claimIdea(idea.id)}
                          className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-sm font-medium text-emerald-600 transition-colors ml-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> 认领
                        </button>
                      )}
                      {(idea.status === '草稿' || idea.status === '已驳回') && (
                        <button
                          onClick={() => setDeleteTarget(idea.id)}
                          className="cursor-pointer inline-flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-red-50 text-sm font-medium text-red-500 hover:text-red-600 transition-colors ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="确认删除创意提案？"
      >
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          删除后此提案将从机会池中移除，{' '}
          <span className="font-bold text-red-600">已生成的 PRD 和对话记录将一并清除且不可恢复</span>
          ，你确定要继续吗？
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
          >
            取消
          </button>
          <button
            onClick={() => {
              if (deleteTarget) deleteIdea(deleteTarget);
              setDeleteTarget(null);
            }}
            className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm font-bold shadow-sm"
          >
            确认删除
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default IdeaListPage;
