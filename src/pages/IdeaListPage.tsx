import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Lightbulb,
  Filter,
  CheckCircle2,
  Trash2,
  Eye,
  AlertCircle,
  UserCheck,
  Sparkles,
  X,
  UserRound,
} from 'lucide-react';
import { useIdeaStore } from '../store/ideaStore';
import Tag from '../components/ui/Tag';
import Modal from '../components/ui/Modal';
import type { Idea, IdeaStatus } from '../types/idea';

const statusColorMap: Record<IdeaStatus, 'blue' | 'slate' | 'emerald' | 'amber' | 'red'> = {
  草稿: 'slate',
  评审中: 'amber',
  孵化中: 'emerald',
  未通过: 'red',
};

const STATUS_FILTERS: (IdeaStatus | '全部')[] = ['全部', '草稿', '评审中', '孵化中', '未通过'];

const IdeaListPage: React.FC = () => {
  const navigate = useNavigate();
  const { ideas, claimIdea, deleteIdea, initDraft } = useIdeaStore();
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | '全部'>('全部');
  const [deptFilter, setDeptFilter] = useState('全部部门');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [claimTarget, setClaimTarget] = useState<Idea | null>(null);
  const [claimResult, setClaimResult] = useState<{ open: boolean; success: boolean; productId?: string; message?: string }>({
    open: false,
    success: false,
  });

  const [rejectTarget, setRejectTarget] = useState<Idea | null>(null);

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
    if (idea.status === '草稿') {
      navigate(`/ideas/${id}/wizard`);
    } else {
      navigate(`/ideas/${id}/prd`);
    }
  };

  const handleConfirmClaim = () => {
    if (!claimTarget) return;
    const result = claimIdea(claimTarget.id, '吴经理');
    setClaimTarget(null);
    setClaimResult({ open: true, success: result.success, productId: result.productId, message: result.message });
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
                <th className="px-6 py-4 font-semibold">负责 PM</th>
                <th className="px-6 py-4 font-semibold">AI 评分</th>
                <th className="px-6 py-4 font-semibold">创建时间</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {visible.map((idea) => (
                <tr key={idea.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div
                      className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer"
                      onClick={() => handleView(idea.id)}
                    >
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
                    <div className="flex items-center gap-2">
                      <Tag color={statusColorMap[idea.status]}>{idea.status}</Tag>
                      {idea.status === '未通过' && idea.rejectReason && (
                        <button
                          onClick={() => setRejectTarget(idea)}
                          className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                          title="查看未通过原因"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">原因</span>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {idea.assignedPm ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                          {idea.assignedPm[0]}
                        </div>
                        <span className="text-slate-700 text-sm">{idea.assignedPm}</span>
                      </div>
                    ) : idea.status === '孵化中' ? (
                      <Tag color="amber" size="sm">待认领</Tag>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {idea.aiScore > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-black text-slate-800 tabular-nums">{idea.aiScore}</div>
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
                        {idea.status === '草稿' ? '编辑' : '查看'}
                      </button>
                      {idea.status === '孵化中' && !idea.assignedPm && (
                        <button
                          onClick={() => setClaimTarget(idea)}
                          className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-violet-50 hover:bg-violet-100 text-sm font-medium text-violet-600 transition-colors ml-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> 认领
                        </button>
                      )}
                      {(idea.status === '草稿' || idea.status === '未通过') && (
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

      <Modal
        isOpen={!!claimTarget}
        onClose={() => setClaimTarget(null)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <UserCheck className="w-4.5 h-4.5" />
            </div>
            确认认领此创意提案？
          </div>
        }
        size="md"
      >
        {claimTarget && (
          <>
            <div className="mb-5 p-4 bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl border border-violet-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-violet-600 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 text-sm truncate">{claimTarget.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{claimTarget.id} · {claimTarget.author} · {claimTarget.dept}</div>
                  <div className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{claimTarget.summary}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 mb-6 leading-relaxed">
              <p>
                您即将作为
                <span className="font-bold text-violet-600 mx-1">产品经理 (PM)</span>
                认领此创意提案，认领后将产生以下变更：
              </p>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>您将作为 <span className="font-bold">吴经理</span> 绑定为该创意的负责 PM</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>系统将自动在 <span className="font-bold text-blue-600">「产品大盘」</span> 中新增一条 <Tag color="phase-prototype" size="sm">原型期</Tag> 产品线</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>关联参战部门（{claimTarget.dept} + 产品部）、初始化阶段门径文档清单、项目看板与周报模板</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>可在产品详情页继续完善团队与项目进度</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setClaimTarget(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
              >
                再考虑一下
              </button>
              <button
                onClick={handleConfirmClaim}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 text-sm font-bold shadow-sm"
              >
                <UserRound className="w-4 h-4" /> 确认认领并立项
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={claimResult.open}
        onClose={() => setClaimResult((r) => ({ ...r, open: false }))}
        title={claimResult.success ? '🎉 认领成功' : '认领失败'}
      >
        {claimResult.success ? (
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-sm text-slate-700 mb-2 leading-relaxed">
              您已成功认领此创意，产品线已同步创建至
              <span className="font-bold text-blue-600 mx-1">产品大盘</span>
              （原型期）。
            </p>
            {claimResult.productId && (
              <div className="inline-block mt-2 px-4 py-2 bg-blue-50 rounded-xl text-sm">
                <span className="text-slate-500">新产品编号：</span>
                <span className="font-black text-blue-700 tabular-nums">{claimResult.productId}</span>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-4">提示：点击左侧导航「产品大盘」即可查看并继续推进。</p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setClaimResult((r) => ({ ...r, open: false }))}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
              >
                继续留在机会池
              </button>
              <button
                onClick={() => {
                  setClaimResult((r) => ({ ...r, open: false }));
                  navigate('/products');
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm"
              >
                前往产品大盘 →
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <X className="w-7 h-7" />
            </div>
            <p className="text-sm text-slate-700 mb-6 leading-relaxed">{claimResult.message || '认领失败，请稍后重试。'}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setClaimResult((r) => ({ ...r, open: false }))}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
              >
                我知道了
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <AlertCircle className="w-4.5 h-4.5" />
            </div>
            创意未通过评审原因
          </div>
        }
        size="lg"
      >
        {rejectTarget && (
          <>
            <div className="mb-4 p-3 bg-slate-50 rounded-xl">
              <div className="font-bold text-slate-800 text-sm">{rejectTarget.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{rejectTarget.id} · {rejectTarget.createdAt} · AI 评分 {rejectTarget.aiScore}</div>
            </div>
            <div className="bg-red-50/60 rounded-2xl border border-red-100 p-5 text-sm leading-relaxed">
              <div className="whitespace-pre-wrap text-slate-700">
                {rejectTarget.rejectReason || '（暂无详细原因说明）'}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setRejectTarget(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 text-sm font-bold shadow-sm"
              >
                知道了
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default IdeaListPage;
