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
} from 'lucide-react';
import { useIdeaStore } from '../store/ideaStore';
import MarkdownPreview from '../components/ui/MarkdownPreview';
import Tag from '../components/ui/Tag';
import { generateChatReply, generatePrdContent } from '../mock/ideaMock';
import Modal from '../components/ui/Modal';

const QUICK_PROMPTS = [
  { label: '重写「竞品分析」', text: '把竞品对比部分写得更真实，加 2 家具体友商' },
  { label: '补充痛点案例', text: '在痛点分析里加 3 个真实业务场景案例' },
  { label: '细化 MVP 功能', text: '细化 MVP 功能，标注 P0/P1/P2 优先级和验收标准' },
  { label: '完善里程碑', text: '里程碑加上风险等级、资源需求和缓解措施' },
  { label: '强化北极星', text: '背景目标章节加上 Go/No-Go 决策标准' },
  { label: '真实 Persona', text: '重写目标用户为 3 个带姓名年龄故事的 Persona' },
];

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
  } = useIdeaStore();

  const [chatInput, setChatInput] = useState('');
  const [submitOpen, setSubmitOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const existed = ideas.find((i) => i.id === id);
    if (!existed) {
      const newId = initDraft();
      navigate(`/ideas/${newId}/wizard`, { replace: true });
      return;
    }
    loadIdea(id);
    // 若无 PRD 内容，补一个骨架
    if (!existed.prdContent) {
      const content = generatePrdContent({
        title: existed.title,
        positioning: existed.positioning,
        targetUsers: existed.targetUsers,
        painPoints: existed.painPoints,
        coreFeatures: existed.coreFeatures,
      });
      setPrdContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [prdChatHistory.length, aiLoading]);

  const idea = ideas.find((i) => i.id === id);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
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
      const { reply, updatedPrd } = generateChatReply(text, prdContent);
      setPrdContent(updatedPrd);
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
    saveIdea();
    showToast('✅ 已保存 PRD 草稿（含 AI 最新改写）');
  };

  const handleSubmit = () => {
    submitIdea();
    setSubmitOpen(false);
    showToast('🎉 已提交评审！可在创意机会池里查看进度');
    setTimeout(() => navigate('/ideas'), 1200);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prdContent);
      showToast('📋 Markdown 原文已复制到剪贴板');
    } catch {
      showToast('复制失败，请手动选中复制');
    }
  };

  if (!idea) {
    return (
      <div className="p-10 text-center text-slate-400">
        <AlertCircle className="w-10 h-10 mx-auto mb-3" /> 创意不存在或已被删除
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
      <div className="flex-1 overflow-hidden flex gap-0">
        {/* 左栏：PRD 预览 */}
        <div className="flex-1 bg-white border-r border-slate-200 flex flex-col overflow-hidden min-w-0">
          <div className="border-b border-slate-200 bg-gradient-to-br from-white via-blue-50/30 to-white px-7 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => navigate(`/ideas/${id}/wizard`)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> 回到向导
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-800 truncate">{idea.title}</h2>
                  <Tag
                    color={
                      idea.status === '孵化中' || idea.status === '已立项'
                        ? 'emerald'
                        : idea.status === '已提交'
                        ? 'blue'
                        : idea.status === '已驳回'
                        ? 'red'
                        : 'slate'
                    }
                  >
                    {idea.status}
                  </Tag>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                  <span>ID：{idea.id}</span>
                  <span>作者：{idea.author}（{idea.dept}）</span>
                  <span>AI 评分：{idea.aiScore > 0 ? idea.aiScore : '—'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
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
                <Save className="w-4 h-4" /> 保存草稿
              </button>
              <button
                onClick={() => setSubmitOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 text-sm font-bold shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> 提交评审
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <MarkdownPreview content={prdContent} onRepaint={(t) => handleSendChat(t)} />
          </div>
        </div>

        {/* 右栏：AI 局部重绘对话框 */}
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
      </div>

      <Modal
        isOpen={submitOpen}
        onClose={() => setSubmitOpen(false)}
        title="确认提交立项评审？"
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900 leading-relaxed">
            <div className="font-black mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> 提交后将：
            </div>
            <ul className="list-disc list-inside space-y-1 text-[13px] text-blue-800">
              <li>状态变更为「<span className="font-bold">已提交</span>」并进入创意机会池公共列表</li>
              <li>研究院领导 &amp; PMO 可在评审列表中看到你的提案</li>
              <li>PM 可直接「认领」进入孵化阶段</li>
              <li>AI 评分将作为评审参考（不决定结果）</li>
            </ul>
          </div>
          <div className="text-xs text-slate-500">
            提案 ID：<span className="font-mono">{id}</span> · 当前评分：{idea.aiScore > 0 ? idea.aiScore : '提交时自动生成'}
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
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 text-sm font-bold shadow-sm inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> 确认提交评审
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
