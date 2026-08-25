import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Send,
  Sparkles,
  FileText,
  Wand2,
  Copy,
  Share2,
  AlertCircle,
  Eye,
  Edit3,
  XCircle,
  Scale,
  UserRound,
} from 'lucide-react';
import { useIdeaStore, REVIEW_PM_OPTIONS } from '../store/ideaStore';
import MarkdownPreview from '../components/ui/MarkdownPreview';
import Tag from '../components/ui/Tag';
import { generateChatReply, generatePrdContent } from '../mock/ideaMock';
import Modal from '../components/ui/Modal';
import type { IdeaStatus, ReviewComment } from '../types/idea';

const QUICK_PROMPTS = [
  { label: '重写「竞品分析」', text: '把竞品对比部分写得更真实，加 2 家具体友商' },
  { label: '补充痛点案例', text: '在痛点分析里加 3 个真实业务场景案例' },
  { label: '细化 MVP 功能', text: '细化 MVP 功能，标注 P0/P1/P2 优先级和验收标准' },
  { label: '完善里程碑', text: '里程碑加上风险等级、资源需求和缓解措施' },
  { label: '强化北极星', text: '背景目标章节加上 Go/No-Go 决策标准' },
  { label: '真实 Persona', text: '重写目标用户为 3 个带姓名年龄故事的 Persona' },
];

const PRD_STATUS_TAG: Record<IdeaStatus, 'slate' | 'amber' | 'emerald' | 'red'> = {
  草稿: 'slate',
  评审中: 'amber',
  孵化中: 'emerald',
  未通过: 'red',
};

const REVIEW_RESULT_COLOR: Record<ReviewComment['result'], string> = {
  通过: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  未通过: 'bg-red-50 text-red-700 border-red-200',
  待评审: 'bg-slate-50 text-slate-600 border-slate-200',
};

const REVIEW_AVATAR_BG: Record<string, string> = {
  系统: 'bg-slate-200 text-slate-700',
  评审委员会: 'bg-violet-100 text-violet-700',
};

const REVIEW_PM_DEFAULT = REVIEW_PM_OPTIONS[0];

const IdeaPrdPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    ideas,
    prdContent,
    prdChatHistory,
    aiLoading,
    loadIdea,
    initDraft,
    setPrdContent,
    pushPrdChat,
    setAiLoading,
    saveIdea,
    submitIdea,
    startReview,
    passReview,
    rejectReview,
  } = useIdeaStore();

  const [chatInput, setChatInput] = useState('');
  const [submitOpen, setSubmitOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState('');

  const [passOpen, setPassOpen] = useState(false);
  const [passComment, setPassComment] = useState('');
  const [passPm, setPassPm] = useState(REVIEW_PM_DEFAULT);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [rejectError, setRejectError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const existed = ideas.find((i) => i.id === id);
    if (!existed) {
      const newId = initDraft();
      navigate(`/ideas/${newId}/wizard`, { replace: true });
      return;
    }
    loadIdea(id);
    if (!existed.prdContent) {
      const content = generatePrdContent({
        title: existed.title,
        positioning: existed.positioning,
        targetUsers: existed.targetUsers,
        painPoints: existed.painPoints,
        coreFeatures: existed.coreFeatures,
      });
      setPrdContent(content);
      setEditDraft(content);
    } else {
      setEditDraft(existed.prdContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (prdContent) setEditDraft(prdContent);
  }, [prdContent]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [prdChatHistory.length, aiLoading]);

  const idea = ideas.find((i) => i.id === id);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSendChat = (forceText?: string) => {
    const text = (forceText ?? chatInput).trim();
    if (!text) return;
    pushPrdChat({
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    });
    setChatInput('');
    setAiLoading(true);
    setTimeout(() => {
      const { reply, updatedPrd } = generateChatReply(text, editMode ? editDraft : prdContent);
      setPrdContent(updatedPrd);
      setEditDraft(updatedPrd);
      saveIdea({ prdContent: updatedPrd });
      pushPrdChat({
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString(),
      });
      setAiLoading(false);
    }, 900 + Math.random() * 400);
  };

  const handleSave = () => {
    const finalContent = editMode ? editDraft : prdContent;
    saveIdea({ prdContent: finalContent });
    setPrdContent(finalContent);
    showToast('✅ 已保存 PRD 内容');
  };

  const handleSubmit = () => {
    submitIdea();
    setSubmitOpen(false);
    showToast('✅ 草稿已保存并生成 AI 辅助评分（仍为草稿态），点击「发起评审」正式进入队列');
  };

  const handleStartReview = () => {
    const result = startReview();
    if (result.success) {
      showToast('🚀 已发起评审！已通知评审委员会，右栏切换为评审面板');
    } else {
      showToast(`❌ ${result.message || '发起评审失败'}`);
    }
  };

  const handleCopy = async () => {
    const src = editMode ? editDraft : prdContent;
    try {
      await navigator.clipboard.writeText(src);
      showToast('📋 Markdown 原文已复制到剪贴板');
    } catch {
      showToast('复制失败，请手动选中复制');
    }
  };

  const handleToggleEdit = () => {
    if (!editMode) {
      setEditDraft(prdContent);
      setEditMode(true);
    } else {
      setPrdContent(editDraft);
      saveIdea({ prdContent: editDraft });
      showToast('✅ 编辑内容已保存并切换到预览');
      setEditMode(false);
    }
  };

  const handleConfirmPass = () => {
    const assignPm = passPm === REVIEW_PM_DEFAULT ? undefined : passPm;
    const result = passReview({ comment: passComment.trim() || '评审通过，进入孵化阶段', assignPm });
    setPassOpen(false);
    setPassComment('');
    setPassPm(REVIEW_PM_DEFAULT);
    if (result.success) {
      if (assignPm) {
        showToast(`✅ 评审通过！已分配 PM ${assignPm}，产品大盘已同步（${result.productId || ''}）`);
      } else {
        showToast('✅ 评审通过！暂未分配 PM，创意将显示在机会池「待认领」队列');
      }
    } else {
      showToast(`❌ ${result.message || '评审失败'}`);
    }
  };

  const handleConfirmReject = () => {
    const comment = rejectComment.trim();
    if (!comment) {
      setRejectError(true);
      showToast('⚠️ 请先填写不通过原因');
      return;
    }
    const result = rejectReview({ comment });
    setRejectOpen(false);
    setRejectComment('');
    setRejectError(false);
    if (result.success) {
      showToast('❌ 已打回！创意列表标记为未通过，可点击「原因」查看详情');
    } else {
      showToast(`❌ ${result.message || '评审失败'}`);
    }
  };

  if (!idea) {
    return (
      <div className="p-10 text-center text-slate-400">
        <AlertCircle className="w-10 h-10 mx-auto mb-3" /> 创意不存在或已被删除
      </div>
    );
  }

  const isDraft = idea.status === '草稿';
  const inReview = idea.status === '评审中';
  const reviewComments: ReviewComment[] = idea.reviewComments ?? [];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
      <div className="flex-1 overflow-hidden flex gap-0">
        {/* 左栏：PRD 预览 / 编辑 */}
        <div className="flex-1 bg-white border-r border-slate-200 flex flex-col overflow-hidden min-w-0">
          <div className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/30 to-white px-7 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => (isDraft ? navigate(`/ideas/${id}/wizard`) : navigate('/ideas'))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {isDraft ? '回到向导' : '返回列表'}
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-800 truncate">{idea.title}</h2>
                  <Tag color={PRD_STATUS_TAG[idea.status]}>{idea.status}</Tag>
                  {idea.assignedPm && (
                    <div className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      <UserRound className="w-3 h-3" /> PM：{idea.assignedPm}
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3 flex-wrap">
                  <span>ID：{idea.id}</span>
                  <span>作者：{idea.author}（{idea.dept}）</span>
                  <span>AI 评分：{idea.aiScore > 0 ? idea.aiScore : '—'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <button
                onClick={handleToggleEdit}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${
                  editMode
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {editMode ? (
                  <>
                    <Eye className="w-3.5 h-3.5" /> 预览模式
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" /> 编辑模式
                  </>
                )}
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                <Copy className="w-3.5 h-3.5" /> 复制 MD
              </button>
              <button
                onClick={() => showToast('📤 已模拟分享链接复制（MVP 仅演示）')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                <Share2 className="w-3.5 h-3.5" /> 分享
              </button>
              <div className="h-6 w-px bg-slate-200 mx-1" />
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold"
              >
                <Save className="w-4 h-4" /> {isDraft ? '保存草稿' : '保存修改'}
              </button>
              {isDraft && (
                <>
                  <button
                    onClick={() => setSubmitOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-bold border border-slate-200"
                  >
                    <Save className="w-4 h-4" /> 保存并评分
                  </button>
                  <button
                    onClick={handleStartReview}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 text-sm font-bold shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" /> 🚀 发起评审
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {editMode ? (
              <div className="px-5 py-4 h-full">
                <textarea
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  onBlur={() => {
                    setPrdContent(editDraft);
                  }}
                  className="w-full h-full min-h-[600px] resize-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm leading-relaxed text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 font-mono"
                  placeholder="在此直接编辑 Markdown 原文…切换到预览模式可查看渲染效果"
                />
              </div>
            ) : (
              <MarkdownPreview content={prdContent} onRepaint={(t) => handleSendChat(t)} />
            )}
          </div>
        </div>

        {/* 右栏：评审中 = 评审面板 / 其他 = AI 聊天 */}
        {inReview ? (
          <div className="w-[440px] flex-shrink-0 bg-white flex flex-col overflow-hidden">
            <div className="border-b border-slate-200 bg-gradient-to-br from-amber-50/70 via-white to-white px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                  评审面板 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">当前提案在评审队列，给出结论后自动变更状态</div>
              </div>
            </div>

            <div className="px-4 py-3 border-b border-slate-100 bg-white">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>📜 评审意见时间轴</span>
                <span className="text-slate-400">{reviewComments.length} 条</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/60">
              {reviewComments.length === 0 ? (
                <div className="py-10 text-center text-slate-400 space-y-3">
                  <div className="w-14 h-14 rounded-2xl mx-auto bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <Scale className="w-7 h-7 text-orange-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-600">暂无评审意见</p>
                  <p className="text-xs mt-1 leading-relaxed">下方按钮可直接给出评审结论</p>
                </div>
              ) : (
                reviewComments.map((c) => {
                  const firstChar = c.reviewer?.[0] ?? '?';
                  const bg = REVIEW_AVATAR_BG[c.reviewer] ?? 'bg-blue-100 text-blue-700';
                  return (
                    <div key={c.id} className="flex gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${bg}`}>
                        {firstChar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-bold text-slate-700">{c.reviewer}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">{c.role}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${REVIEW_RESULT_COLOR[c.result]}`}>
                            {c.result}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-auto">{c.createdAt}</span>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap shadow-sm">
                          {c.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-3 sticky bottom-0">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setRejectError(false);
                    setRejectComment('');
                    setRejectOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-sm transition-colors"
                >
                  <XCircle className="w-4 h-4" /> 评审不通过
                </button>
                <button
                  onClick={() => {
                    setPassComment('');
                    setPassPm(REVIEW_PM_DEFAULT);
                    setPassOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-sm transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> 评审通过
                </button>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 text-center">
                评审结论将写入时间轴并同步更新创意状态
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[440px] flex-shrink-0 bg-white flex flex-col overflow-hidden">
            <div className="border-b border-slate-200 bg-gradient-to-br from-indigo-50/70 via-white to-white px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
                <Wand2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                  AI PRD 精修助手 <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">一句话指令，精准改写目标章节</div>
              </div>
            </div>

            <div className="px-4 py-3 border-b border-slate-100 bg-white">
              <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                🔥 常用指令（一键发送）
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handleSendChat(p.text)}
                    disabled={aiLoading}
                    className="text-[11px] px-2.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/60">
              {prdChatHistory.length === 0 && (
                <div className="py-10 text-center text-slate-400 space-y-3">
                  <div className="w-14 h-14 rounded-2xl mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-600">PRD 初稿已生成完毕！</p>
                    <p className="text-xs mt-1 leading-relaxed">
                      上方点章节快捷按钮，或在下方直接输入指令<br />
                      例：<span className="font-bold text-slate-500">"重写第三部分痛点，更有说服力"</span>
                    </p>
                  </div>
                </div>
              )}
              {prdChatHistory.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                    <span className="text-xs text-slate-400 ml-2">AI 正在改写 PRD…</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-3">
              <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all p-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                  rows={2}
                  placeholder="输入指令，如：竞品对标写得太虚，补 2 家真实友商…（Enter 发送，Shift+Enter 换行）"
                  className="flex-1 bg-transparent text-sm px-2 py-1.5 outline-none text-slate-700 placeholder:text-slate-400 resize-none leading-relaxed"
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={!chatInput.trim() || aiLoading}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center hover:brightness-110 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                <span>
                  ⚠️ AI 内容仅供参考，提交评审前请 PM 人工复核
                </span>
                <span>消息数：{prdChatHistory.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 草稿：保存并评分 Modal */}
      <Modal
        isOpen={submitOpen}
        onClose={() => setSubmitOpen(false)}
        title="确认保存草稿并生成 AI 评分？"
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed">
            <div className="font-black mb-1.5 flex items-center gap-1.5 text-slate-800">
              <Sparkles className="w-4 h-4 text-indigo-500" /> 说明：
            </div>
            <ul className="list-disc list-inside space-y-1 text-[13px] text-slate-600">
              <li>保存当前 PRD 草稿并由 AI 自动计算辅助评分</li>
              <li>创意<strong className="text-slate-800">仍保持「草稿」</strong>态，不会出现在公共评审队列</li>
              <li>如需正式进入评审，关闭后点击右上角「🚀 发起评审」按钮</li>
            </ul>
          </div>
          <div className="text-xs text-slate-500">
            提案 ID：<span className="font-mono">{id}</span> · 当前评分：{idea.aiScore > 0 ? idea.aiScore : '保存时自动生成'}
          </div>
        </div>
        <div className="pt-5 flex justify-end gap-3">
          <button
            onClick={() => setSubmitOpen(false)}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
          >
            再改改
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 text-sm font-bold shadow-sm inline-flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> 确认保存
          </button>
        </div>
      </Modal>

      {/* 评审通过 Modal */}
      <Modal
        isOpen={passOpen}
        onClose={() => setPassOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
            确认评审通过并进入孵化阶段？
          </div>
        }
        size="md"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              评审意见 <span className="text-slate-400 font-normal">（可选，会记录到评审时间轴）</span>
            </label>
            <textarea
              value={passComment}
              onChange={(e) => setPassComment(e.target.value)}
              rows={4}
              placeholder="示例：\n1. 战略方向高度一致，符合 NHY 硬件+AI 核心打法\n2. ROI 评估通过，预计 8 个月回本\n3. MVP 阶段请先落地 1-2 个种子部门做试点"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              分配产品经理 PM <span className="text-slate-400 font-normal">（可暂不分配，后续在列表认领）</span>
            </label>
            <select
              value={passPm}
              onChange={(e) => setPassPm(e.target.value)}
              className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 font-medium"
            >
              {REVIEW_PM_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            {passPm !== REVIEW_PM_DEFAULT && (
              <div className="mt-2 p-3 bg-blue-50 rounded-xl text-xs text-blue-800 border border-blue-200 leading-relaxed">
                ✅ 选择 <strong>{passPm}</strong> 作为该创意的 PM：创意将立即进入孵化中状态，并且产品大盘会自动新增一条原型期产品线
              </div>
            )}
            {passPm === REVIEW_PM_DEFAULT && (
              <div className="mt-2 p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200 leading-relaxed">
                ⏸ 暂未分配 PM：创意进入孵化中状态，创意机会池中该行将显示「待认领」，后续 PM 可在列表中手动认领
              </div>
            )}
          </div>
        </div>
        <div className="pt-5 flex justify-end gap-3">
          <button
            onClick={() => setPassOpen(false)}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
          >
            再想想
          </button>
          <button
            onClick={handleConfirmPass}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-bold shadow-sm inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> 确认评审通过
          </button>
        </div>
      </Modal>

      {/* 评审不通过 Modal */}
      <Modal
        isOpen={rejectOpen}
        onClose={() => {
          setRejectOpen(false);
          setRejectError(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <AlertCircle className="w-4.5 h-4.5" />
            </div>
            确认评审不通过？
          </div>
        }
        size="md"
      >
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            不通过原因 <span className="text-red-500">（必填）</span>
          </label>
          <textarea
            value={rejectComment}
            onChange={(e) => {
              setRejectComment(e.target.value);
              if (e.target.value.trim()) setRejectError(false);
            }}
            rows={5}
            placeholder="请结构化填写原因，示例：\n1. 战略方向不符：偏离我院硬件+AI核心赛道，属于通用性企业服务\n2. ROI 不高原因：院内已有企微预定，重复建设ROI<2\n3. 下一步整改建议：可先作为Hackathon项目试点，验证后再立项"
            className={`w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 outline-none resize-none transition-colors ${
              rejectError
                ? 'border-2 border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border border-slate-200 focus:ring-2 focus:ring-red-100 focus:border-red-400'
            }`}
          />
          {rejectError && (
            <div className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> 请先填写不通过原因
            </div>
          )}
          <div className="mt-1 p-3 bg-red-50 rounded-xl text-xs text-red-800 border border-red-200 leading-relaxed">
            ❌ 打回后创意状态将变更为「未通过」，并在机会池中标记红色标签；提交人可根据意见修改后重新发起评审
          </div>
        </div>
        <div className="pt-5 flex justify-end gap-3">
          <button
            onClick={() => {
              setRejectOpen(false);
              setRejectError(false);
            }}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
          >
            再想想
          </button>
          <button
            onClick={handleConfirmReject}
            className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm font-bold shadow-sm inline-flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4" /> 确认打回
          </button>
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-slate-900/90 backdrop-blur text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaPrdPage;
