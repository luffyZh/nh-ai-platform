import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Save,
  Send,
  FileText,
  User,
  Target,
  AlertTriangle,
  Zap,
  ArrowRight,
  Wand2,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { useIdeaStore } from '../store/ideaStore';
import { WIZARD_STEPS, type WizardStepKey } from '../types/idea';
import {
  pickMockByStep,
  pickAiAsk,
  generatePrdContent,
  generateOverallFeedback,
  MOCK_FILL_EXAMPLES,
  type WizardMockExample,
} from '../mock/ideaMock';
import Tag from '../components/ui/Tag';

const STEP_ICONS: Record<WizardStepKey, React.ReactNode> = {
  positioning: <Target className="w-4 h-4" />,
  targetUsers: <User className="w-4 h-4" />,
  painPoints: <AlertTriangle className="w-4 h-4" />,
  coreFeatures: <Zap className="w-4 h-4" />,
};

const IdeaWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    ideas,
    wizardStep,
    wizardForm,
    aiAskHistory,
    aiLoading,
    initDraft,
    loadIdea,
    setWizardStep,
    updateWizardForm,
    pushAiAsk,
    clearAiAsk,
    setPrdContent,
    setAiLoading,
    saveIdea,
  } = useIdeaStore();

  const [chatInput, setChatInput] = useState('');
  const [mockSeed, setMockSeed] = useState(() => Math.floor(Math.random() * 10));
  const [overallFired, setOverallFired] = useState(false);
  const [pickOpen, setPickOpen] = useState(false);
  const fillMenuRef = useRef<HTMLDivElement>(null);

  // 初始化：加载已有创意 / 重定向
  useEffect(() => {
    if (!id) return;
    const existed = ideas.find((i) => i.id === id);
    if (existed) {
      loadIdea(id);
      clearAiAsk();
      queueMicrotask(() => setOverallFired(false));
    } else {
      const newId = initDraft();
      navigate(`/ideas/${newId}/wizard`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        pickOpen &&
        fillMenuRef.current &&
        !fillMenuRef.current.contains(e.target as Node)
      ) {
        setPickOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [pickOpen]);

  const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.key === wizardStep);
  const currentStepObj = WIZARD_STEPS[currentStepIndex];

  // 四步完成自动触发综合反馈（只触发一次）
  useEffect(() => {
    if (overallFired) return;
    if (wizardStep !== 'coreFeatures') return;
    const allDone = WIZARD_STEPS.every(
      (s) => (wizardForm as Record<string, string>)[s.key].trim().length >= 10);
    if (!allDone) return;

    // 触发 AI 综合分析
    setAiLoading(true);
    setTimeout(() => {
      pushAiAsk({
        id: `ai-overall-${Date.now()}`,
        role: 'assistant',
        content: generateOverallFeedback({
          positioning: wizardForm.positioning,
          targetUsers: wizardForm.targetUsers,
          painPoints: wizardForm.painPoints,
          coreFeatures: wizardForm.coreFeatures,
        }),
        createdAt: new Date().toISOString(),
      });
      setOverallFired(true);
      setAiLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardStep, overallFired]);

  // 每次发消息后滚动到底
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiAskHistory.length, aiLoading]);

  const currentExample: WizardMockExample = useMemo(
    () => pickMockByStep(currentStepObj.key, mockSeed),
    [currentStepObj.key, mockSeed]
  );

  const handleFillThisStep = (exampleOverride?: WizardMockExample) => {
    const ex = exampleOverride ?? currentExample;
    const key = currentStepObj.key;
    updateWizardForm(key, ex[key]);
    setPickOpen(false);
  };

  const handleFillAll4Steps = (example: WizardMockExample) => {
    updateWizardForm('positioning', example.positioning);
    updateWizardForm('targetUsers', example.targetUsers);
    updateWizardForm('painPoints', example.painPoints);
    updateWizardForm('coreFeatures', example.coreFeatures);
    setOverallFired(false);
    setPickOpen(false);
    // 自动跳最后一步触发综合反馈
    setWizardStep('coreFeatures');
    saveIdea();
  };

  const handleNext = () => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      setWizardStep(WIZARD_STEPS[currentStepIndex + 1].key);
      saveIdea();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setWizardStep(WIZARD_STEPS[currentStepIndex - 1].key);
    }
  };

  const handleSendAsk = (forcedText?: string) => {
    const text = (forcedText ?? chatInput).trim();
    if (!text) return;
    pushAiAsk({
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    });
    setChatInput('');
    setAiLoading(true);
    setTimeout(() => {
      const allDone = WIZARD_STEPS.every(
        (s) => (wizardForm as Record<string, string>)[s.key].trim().length >= 10
      );
      let reply: string;
      if (allDone) {
        // 四步都填了 → 给综合分析 + 针对性回复
        const overall = generateOverallFeedback({
          positioning: wizardForm.positioning,
          targetUsers: wizardForm.targetUsers,
          painPoints: wizardForm.painPoints,
          coreFeatures: wizardForm.coreFeatures,
        });
        reply = `收到你说的「${text.slice(0, 40)}${text.length > 40 ? '…' : ''}」我记下了！\n\n同时我结合你填的 4 步信息一起给你综合建议：\n\n${overall}\n\n> 💡 小提示：你可以把你刚才的想法作为「补充：${text.slice(0, 20)}」直接合并到对应字段里，或者直接下一步生成 PRD 就行！`;
      } else {
        // 还没填完 → 给当前步建议
        const stepAsk = pickAiAsk(wizardStep, 0);
        reply = `收到！先把 4 步信息都填完后我会给你整份表单的综合评审哦～\n\n针对当前「${currentStepObj.title}」这步，我再给个追问：\n\n${stepAsk}\n\n或者点左上的「🎲 填充此步」，3 套现成的演示文案秒填！`;
      }
      // 把用户消息追加到当前步字段里
      const key = currentStepObj.key;
      const cur = (wizardForm as Record<string, string>)[key];
      updateWizardForm(key, cur ? `${cur}\n- 补充：${text}` : text);
      pushAiAsk({
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString(),
      });
      setAiLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 900);
  };

  const handleGeneratePrd = () => {
    if (!id) return;
    saveIdea();
    const current = ideas.find((i) => i.id === id);
    if (!current) return;
    const title =
      wizardForm.positioning.trim().slice(0, 28) || current.title || '产品需求文档';
    const content = generatePrdContent({
      title,
      positioning: wizardForm.positioning,
      targetUsers: wizardForm.targetUsers,
      painPoints: wizardForm.painPoints,
      coreFeatures: wizardForm.coreFeatures,
    });
    setPrdContent(content);
    saveIdea({ prdContent: content, title });
    navigate(`/ideas/${id}/prd`);
  };

  const handleSaveDraft = () => {
    saveIdea();
    navigate('/ideas');
  };

  const canGoNext =
    (wizardForm as Record<string, string>)[currentStepObj.key].trim().length >= 5;

  const completion = Math.round(
    (WIZARD_STEPS.filter(
      (s) => (wizardForm as Record<string, string>)[s.key].trim().length >= 10
    ).length /
      WIZARD_STEPS.length) *
      100
  );

  const allDone = WIZARD_STEPS.every(
    (s) => (wizardForm as Record<string, string>)[s.key].trim().length >= 10
  );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
      <div className="flex-1 overflow-hidden flex gap-6 px-6 py-6">
        {/* 左列：分步表单 */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden min-w-0">
          <div className="px-8 pt-7 pb-5 border-b border-slate-100 bg-gradient-to-br from-white to-blue-50/40">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800">AI 创意提案向导</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    4 步填完 → 右下「✨ 生成 PRD 初稿」，右侧 AI 会给出整份分析
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400">信息完整度</div>
                  <div className="text-lg font-black text-slate-800 tabular-nums">
                    {completion}%
                  </div>
                </div>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <button
                  onClick={handleSaveDraft}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold"
                >
                  <Save className="w-3.5 h-3.5" /> 保存草稿
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {WIZARD_STEPS.map((s, idx) => {
                const active = s.key === wizardStep;
                const done = idx < currentStepIndex;
                return (
                  <React.Fragment key={s.key}>
                    <button
                      onClick={() => {
                        if (idx <= currentStepIndex) setWizardStep(s.key);
                      }}
                      disabled={idx > currentStepIndex}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        active
                          ? 'bg-blue-600 text-white shadow-sm'
                          : done
                          ? 'bg-emerald-50 text-emerald-700 cursor-pointer hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          active
                            ? 'bg-white/20 text-white'
                            : done
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200'
                        }`}
                      >
                        {done ? '✓' : STEP_ICONS[s.key]}
                      </span>
                      {s.title}
                    </button>
                    {idx < WIZARD_STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 bg-slate-100 relative overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 bg-emerald-400 transition-all duration-500 ${
                            idx < currentStepIndex ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-10 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-1">
                    {currentStepObj.title}
                  </h3>
                  <p className="text-sm text-slate-500">{currentStepObj.subtitle}</p>
                </div>

                {/* 🎲 一键填充示例 - 下拉 */}
                <div className="relative flex-shrink-0" ref={fillMenuRef}>
                  <div className="flex items-stretch gap-1">
                    <button
                      onClick={() => handleFillThisStep()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 text-xs font-bold shadow-sm"
                      title={`一键填充「${currentExample.label}」的当前步示例`}
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      🎲 填充此步
                    </button>
                    <button
                      onClick={() => setPickOpen((v) => !v)}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 flex items-center justify-center"
                      title="切换示例方案 / 整套一键填充 4 步"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          pickOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {pickOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                        <span>🎬 示例方案（3 套轮换）</span>
                        <button
                          onClick={() => {
                            setMockSeed((n) => (n + 1) % MOCK_FILL_EXAMPLES.length);
                            setPickOpen(false);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-50 text-slate-500"
                        >
                          <RefreshCw className="w-3 h-3" /> 换一套
                        </button>
                      </div>
                      {MOCK_FILL_EXAMPLES.map((ex, i) => {
                        const selected = i === mockSeed % MOCK_FILL_EXAMPLES.length;
                        return (
                          <div
                            key={ex.label}
                            className={`px-3 py-2.5 border-b border-slate-50 last:border-b-0 ${
                              selected ? 'bg-indigo-50/60' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="text-sm font-black text-slate-800 truncate">
                                {selected && (
                                  <span className="text-indigo-500 mr-1">●</span>
                                )}
                                {ex.label}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleFillThisStep(ex)}
                                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-600 font-bold"
                              >
                                填当前步
                              </button>
                              <button
                                onClick={() => handleFillAll4Steps(ex)}
                                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 text-white font-bold shadow-sm inline-flex items-center gap-1"
                              >
                                ✨ 整套填充 4 步
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <div className="px-4 py-2 text-[11px] text-slate-400 bg-slate-50/80 rounded-b-2xl border-t border-slate-100">
                        小贴士：整套填充后会自动跳到「核心功能」并触发 AI 综合评审
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <textarea
                value={(wizardForm as Record<string, string>)[currentStepObj.key]}
                onChange={(e) => updateWizardForm(currentStepObj.key, e.target.value)}
                rows={9}
                placeholder={currentStepObj.placeholder}
                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-5 text-[15px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none leading-relaxed placeholder:text-slate-400"
              />
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400 mr-1">
                    💡 四步填完后，右侧 AI 会给你整份表单的综合评审
                  </span>
                  {currentStepObj.key === 'positioning' && (
                    <Tag color="blue">2B / 2C 明确</Tag>
                  )}
                  {currentStepObj.key === 'targetUsers' && (
                    <Tag color="amber">写清「谁买单 / 谁使用」</Tag>
                  )}
                  {currentStepObj.key === 'painPoints' && (
                    <Tag color="red">越具体的场景越好</Tag>
                  )}
                  {currentStepObj.key === 'coreFeatures' && (
                    <Tag color="emerald">只列 P0，≤ 5 项</Tag>
                  )}
                </div>
                <div className="text-xs text-slate-400 tabular-nums">
                  {(wizardForm as Record<string, string>)[currentStepObj.key].length}{' '}
                  字
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 px-10 py-4 bg-white flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> 上一步
            </button>
            <div className="text-xs text-slate-400 tabular-nums">
              {currentStepIndex + 1} / {WIZARD_STEPS.length}
              {allDone && (
                <span className="ml-2 text-emerald-600 font-bold">
                  ● 四步已填完，可生成 PRD
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {currentStepIndex === WIZARD_STEPS.length - 1 ? (
                <button
                  onClick={handleGeneratePrd}
                  disabled={!allDone}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 text-sm font-bold shadow-sm disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
                  title={!allDone ? '请先填完 4 步（每步 ≥ 10 字）' : ''}
                >
                  <FileText className="w-4 h-4" />
                  生成 PRD 初稿
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  下一步 <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 右列：AI 对话（四步填完触发综合建议 */}
        <div className="w-[420px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-br from-amber-50 to-white flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm ${
                allDone
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  : 'bg-amber-400/90'
              }`}
            >
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-slate-800 text-sm">
                {allDone ? '🎯 AI 创意评审官' : 'AI 创意引导助手'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {allDone
                  ? '四步已填完，已给你综合评审 + 追问点 👇'
                  : `当前进度 ${completion}%，填完 4 步后给综合评审`}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50">
            {aiAskHistory.length === 0 && (
              <div className="py-10 text-center text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-2xl mx-auto bg-gradient-to-br from-amber-100 via-white to-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-indigo-500" />
                </div>
                <div className="text-sm font-bold text-slate-600">
                  {allDone
                    ? '四步信息已集齐！'
                    : '先填左边 4 步表单'}
                </div>
                <div className="text-xs leading-relaxed max-w-[80%] mx-auto">
                  {allDone
                    ? '下方我来整份分析，或点左上「🎲 整套填充 4 步」秒完成演示 → 再点「生成 PRD 初稿」'
                    : '点左上「🎲 填充此步」按钮，3 套现成方案秒填 → 四步填完后我给综合评审（优势 + 追问 + 下一步动作）'}
                </div>
                <div className="pt-2 space-y-1.5 max-w-[85%] mx-auto text-left">
                  {['车载疲劳监测 AI 摄像头', '智能硬件 BOM 降本助手', '飞书 AI 周报自动生成']
                    .map((lbl, i) => (
                      <div
                        key={lbl}
                        onClick={() =>
                          handleFillAll4Steps(MOCK_FILL_EXAMPLES[i])}
                        className="text-[11px] px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-700 hover:bg-indigo-50 font-bold cursor-pointer transition-colors shadow-sm"
                      >
                        ✨ 一键整套填充：{lbl}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {aiAskHistory.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="text-xs text-slate-400 ml-2">
                    {allDone ? 'AI 正在通读 4 步，给你整份评审…' : 'AI 思考中…'}
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-slate-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1.5">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAsk()}
                placeholder="补充细节，或直接点下方快捷指令…（填完 4 步自动综合评审）"
                className="flex-1 bg-transparent text-sm px-3 py-1.5 outline-none text-slate-700 placeholder:text-slate-400"
              />
              <button
                onClick={() => handleSendAsk()}
                disabled={!chatInput.trim()}
                className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {[
                { label: '举个真实案例', text: '举个真实发生的案例' },
                { label: '用户 workaround?', text: '目前用户怎么 workaround？' },
                { label: '北极星指标', text: '这个想法的北极星指标是什么？' },
                { label: 'Go/No-Go 标准', text: '补充 Go/No-Go 上线决策标准' },
                { label: '评审挑战点', text: '立项评审最容易被挑战什么？' },
              ].map((c) => (
                <button
                  key={c.label}
                  onClick={() => handleSendAsk(c.text)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 font-bold transition-colors"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaWizardPage;
