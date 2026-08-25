import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Sparkles,
  FileText,
  Wand2,
  X,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  User,
  Briefcase,
  Hash,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
} from 'lucide-react';
import Tag from '../components/ui/Tag';
import MarkdownPreview from '../components/ui/MarkdownPreview';
import { useReportStore } from '../store/reportStore';
import { BUILD_MY_LINKED_PRODUCTS, REPORT_QUICK_PROMPTS, generateReplyForReport, buildMarkdownFromReport } from '../mock/reportMock';
import type { ReportItem, ReportItemCategory, ReportStatus } from '../types/report';
import type { ChatMessage } from '../types/idea';

const STATUS_COLOR: Record<ReportStatus, 'slate' | 'amber' | 'emerald'> = {
  草稿: 'slate',
  待确认: 'amber',
  已发送: 'emerald',
};

const CATEGORY_META: Record<ReportItemCategory, { title: string; bg: string; border: string; tagColor: 'blue' | 'amber' | 'emerald'; Icon: React.ComponentType<{ className?: string }> }> = {
  核心进展: { title: '核心进展', bg: 'from-blue-50 to-white', border: 'border-blue-200', tagColor: 'blue', Icon: CheckCircle },
  风险问题: { title: '风险问题', bg: 'from-amber-50 to-white', border: 'border-amber-200', tagColor: 'amber', Icon: AlertCircle },
  下周计划: { title: '下周计划', bg: 'from-emerald-50 to-white', border: 'border-emerald-200', tagColor: 'emerald', Icon: Target },
};

const uid = () => Math.random().toString(36).slice(2, 10);

const WeeklyReportEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<number | null>(null);

  const {
    reports,
    loadReport,
    initDraft,
    setMarkdownContent,
    replaceItemsFromLinkedProducts,
    addItem,
    removeItem,
    pushChat,
    saveReport,
    submitReport,
  } = useReportStore();

  const [toast, setToast] = useState<string | null>(null);
  const [autoSaveText, setAutoSaveText] = useState<string>('');
  const [editMarkdown, setEditMarkdown] = useState<string>('');
  const [genLoading, setGenLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

  const current = useMemo(() => reports.find((r) => r.id === id) || null, [reports, id]);
  const linkedProducts = useMemo(() => BUILD_MY_LINKED_PRODUCTS().filter((p) => current?.linkedProductIds.includes(p.productId)), [current]);
  const groupedItems = useMemo(() => {
    const g: Record<ReportItemCategory, ReportItem[]> = { 核心进展: [], 风险问题: [], 下周计划: [] };
    current?.items.forEach((it) => g[it.category].push(it));
    return g;
  }, [current]);

  useEffect(() => {
    if (!id) return;
    const existed = reports.find((r) => r.id === id);
    if (!existed) {
      const newId = initDraft();
      navigate(`/reports/${newId}/edit`, { replace: true });
      return;
    }
    loadReport(id);
    setEditMarkdown(existed.markdownContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (current) setEditMarkdown(current.markdownContent);
  }, [current?.id, current?.items.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [current?.chatHistory.length, aiLoading]);

  useEffect(() => {
    if (toast) {
      const t = window.setTimeout(() => setToast(null), 2600);
      return () => window.clearTimeout(t);
    }
  }, [toast]);

  const scheduleSave = (after = 1200) => {
    if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = window.setTimeout(() => {
      setAutoSaveText(`于 ${new Date().toLocaleTimeString('zh-CN', { hour12: false })} 自动保存`);
      setTimeout(() => setAutoSaveText((s) => (s ? '' : s)), 4200);
    }, after);
  };

  const handleMarkdownChange = (val: string) => {
    setEditMarkdown(val);
    setMarkdownContent(val);
    scheduleSave();
  };

  const handleOneClickGen = async () => {
    setGenLoading(true);
    setToast('正在从 4 个关联项目拉取本周进展…');
    await new Promise((r) => setTimeout(r, 900));
    const { items } = replaceItemsFromLinkedProducts();
    setToast(`✅ 已生成 ${items.length} 条周报条目，已同步到 Markdown 编辑器`);
    setGenLoading(false);
    scheduleSave(600);
  };

  const handleSendQuick = (text: string) => {
    if (!id || !current) return;
    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    pushChat(userMsg);
    setAiLoading(true);
    setTimeout(() => {
      const { reply } = generateReplyForReport(text, current.markdownContent);
      const assistant: ChatMessage = {
        id: uid(),
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString(),
      };
      pushChat(assistant);
      setAiLoading(false);
    }, 700);
  };

  const handleSend = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    handleSendQuick(text);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    scheduleSave(600);
  };

  const handleSubmit = () => {
    const res = submitReport();
    if (!res.success) {
      setToast(`⚠️ ${res.message || '提交失败'}`);
      return;
    }
    setToast('✅ 周报已提交，状态变更为「待确认」，PMO 将在 24 小时内复核');
    setTimeout(() => navigate('/reports'), 1800);
  };

  if (!current) {
    return (
      <div className="p-12 flex items-center justify-center">
        <div className="text-slate-400 animate-pulse">正在加载周报草稿…</div>
      </div>
    );
  }

  const itemsTotal = current.items.length;

  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-4 xl:p-6 flex flex-col gap-4 overflow-hidden">
      <div className="max-w-[1800px] w-full mx-auto flex-1 min-h-0 flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-center justify-between flex-wrap gap-4 shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/reports')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/60 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              返回周报列表
            </button>
            <div className="flex items-start flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{current.title}</h2>
                <Tag color={STATUS_COLOR[current.status]} size="sm">
                  {current.status}
                </Tag>
                {itemsTotal > 0 && (
                  <Tag color="indigo" size="sm">
                    <Hash className="w-3 h-3 mr-1" />
                    {itemsTotal} 条
                  </Tag>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {current.author}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {current.dept}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {current.weekLabel}
                </span>
                <span>· 关联 {linkedProducts.length} 个项目</span>
                {autoSaveText && (
                  <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                    <Save className="w-3.5 h-3.5" />
                    {autoSaveText}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {current.status === '草稿' && (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                确认提交周报
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 items-stretch flex-1 min-h-0">

          {/* 中 1/3：Markdown 正文（编辑 / 预览切换） */}
          <section className="flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 min-h-0">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm font-bold text-slate-800">Markdown 周报</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setPreviewMode('edit')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    previewMode === 'edit' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  结构化 + MD 编辑
                </button>
                <button
                  onClick={() => setPreviewMode('preview')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    previewMode === 'preview' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Markdown 预览
                </button>
                <span className="text-xs text-slate-400">{editMarkdown.length} 字</span>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              {previewMode === 'edit' ? (
                <textarea
                  value={editMarkdown}
                  onChange={(e) => handleMarkdownChange(e.target.value)}
                  spellCheck={false}
                  className="w-full h-full px-5 py-4 outline-none resize-none font-mono text-[13px] leading-7 text-slate-700 bg-slate-50/30"
                  placeholder="# 周报标题&#10;&#10;> 汇报人｜部门｜周期&#10;&#10;## 1、核心进展&#10;...（左上方结构列表改动会自动同步到此，亦可直接手写）"
                />
              ) : (
                <div className="h-full overflow-auto p-6">
                  <MarkdownPreview content={editMarkdown || buildMarkdownFromReport(current)} />
                </div>
              )}
            </div>
          </section>


          {/* 左 1/3：结构化工作记录 */}
          <section className="flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 min-h-0">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-800">结构化工作记录（每条关联项目 Tag）</h3>
                <span className="text-xs text-slate-400">
                  共 {current.items.length} 条，来自 {linkedProducts.length} 个项目
                </span>
              </div>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto flex-1 min-h-0">
              {(Object.keys(CATEGORY_META) as ReportItemCategory[]).map((cat) => {
                const meta = CATEGORY_META[cat];
                const arr = groupedItems[cat];
                const Icon = meta.Icon;
                return (
                  <section key={cat} className={`rounded-2xl bg-gradient-to-br ${meta.bg} border ${meta.border} p-4`}>
                    <header className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-${meta.tagColor}-600`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">
                            {meta.title}
                            <span className="ml-2 text-xs text-slate-500 font-normal">{arr.length} 条</span>
                          </h4>
                          <p className="text-xs text-slate-400">
                            每条自动绑定关联项目 ID Tag，方便 PMO 追溯
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          addItem({
                            productId: linkedProducts[0]?.productId || 'P-2026004',
                            productName: linkedProducts[0]?.productName || 'GuardX 电子哨兵',
                            category: cat,
                            content: '（新增）双击此处编辑本条工作内容…',
                          })
                        }
                        className={`text-xs inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/80 hover:bg-white border transition-colors ${
                          cat === '核心进展'
                            ? 'border-slate-200 text-slate-600 hover:text-blue-600'
                            : cat === '风险问题'
                            ? 'border-amber-200 text-amber-700 hover:text-amber-700 hover:border-amber-300'
                            : 'border-emerald-200 text-emerald-700 hover:text-emerald-700 hover:border-emerald-300'
                        }`}
                      >
                        + 手动追加一条
                      </button>
                    </header>

                    {arr.length === 0 ? (
                      <div className="rounded-xl bg-white/70 border border-dashed border-slate-200 p-5 text-center text-sm text-slate-400">
                        暂无{meta.title}条目，点右侧「🚀 一键生成周报」自动拉取
                      </div>
                    ) : (
                      <ul className="space-y-2.5">
                        {arr.map((it) => {
                          const prod = linkedProducts.find((p) => p.productId === it.productId);
                          return (
                            <li
                              key={it.id}
                              className="group flex flex-col bg-white/95 rounded-xl border border-slate-100 shadow-sm px-4 py-3 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 shrink-0">
                                  <Icon className={`w-4 h-4 text-${meta.tagColor}-500`} />
                                </div>
                                <p className="flex-1 text-sm text-slate-700 leading-relaxed w-full">{it.content}</p>
                                <button
                                  onClick={() => handleRemoveItem(it.id)}
                                  title="删除本条"
                                  className="opacity-0 group-hover:opacity-100 w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="my-2 border-t border-dashed border-slate-200" />
                              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                                <Tag color={meta.tagColor} size="sm">
                                  <Zap className="w-3 h-3 mr-1 opacity-70" />
                                  {prod?.productName || it.productName}
                                </Tag>
                                <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                  P{it.productId.slice(-4)}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          </section>

          {/* 右 1/3：AI 周报助手 */}
          <aside className="flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 min-h-0">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">AI 周报助手</h3>
                  <p className="text-[11px] text-slate-500">一键生成 / 智能润色 / 量化增强</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 p-4 min-h-0">
              <div className={`rounded-2xl border p-4 ${genLoading ? 'bg-indigo-50 border-indigo-200 animate-pulse' : 'bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100'}`}>
                {genLoading ? (
                  <div className="text-sm text-indigo-700 space-y-1.5">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      AI 正在从 4 个项目拉取进展…
                    </p>
                    <div className="space-y-1.5 text-xs">
                      <div className="h-1.5 w-full bg-white/60 rounded"><div className="h-full w-1/3 bg-indigo-400 rounded animate-[slide_1s_infinite]" /></div>
                      <p>① 已抓取 P-004 电子哨兵 原型阶段 12 条 Feed</p>
                      <p>② 已抓取 P-003 智能座舱 架构评审 8 条结论…</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-indigo-700 font-bold mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 border border-indigo-100">
                      <CheckCircle2 className="w-3 h-3" />
                      本周已关联 {linkedProducts.length} 个项目
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {linkedProducts.map((p) => (
                        <Tag key={p.productId} color="indigo" size="sm">
                          {p.productName}
                        </Tag>
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 leading-6 mb-3">
                      对应的项目周报已完成，是否 <b>🚀 一键生成</b> 本周工作周报？按「进展 / 风险 / 下周计划」自动拆分，并给每条绑定项目 ID Tag。
                    </p>
                    <button
                      onClick={handleOneClickGen}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      🚀 一键生成本周周报
                    </button>
                  </>
                )}
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2 px-1">
                  常用指令（一键发送）
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {REPORT_QUICK_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleSendQuick(p.text)}
                      className="text-left text-xs px-3 py-2 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {current.chatHistory.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[94%] text-xs leading-6 rounded-2xl px-3.5 py-2.5 ${
                        m.role === 'user'
                          ? 'bg-indigo-500 text-white rounded-br-sm'
                          : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-bl-sm'
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[94%] text-xs rounded-2xl px-3.5 py-2.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-bl-sm">
                      <span className="inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                        AI 正在组织本周要点…
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 bg-white shrink-0 space-y-2">
              <div className="rounded-xl border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all bg-slate-50/60 overflow-hidden">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={3}
                  placeholder="问点什么，例：把 P-004 的进展单独拎出来做个详细版（Shift+Enter 换行）"
                  className="w-full block px-3 py-2 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 resize-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  ⚠️ AI 内容仅供参考，提交前请 PM 人工复核
                </span>
                <button
                  onClick={handleSend}
                  disabled={!chatInput.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-100 disabled:text-blue-500 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  发送
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReportEditPage;
