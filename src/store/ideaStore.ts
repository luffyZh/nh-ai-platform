import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Idea, ChatMessage, WizardStepKey, ReviewComment } from '../types/idea';
import { INITIAL_IDEAS } from '../mock/ideaMock';
import { buildProductFromIdea, useProductStore } from './productStore';

interface ClaimResult {
  success: boolean;
  productId?: string;
  message?: string;
}

interface ReviewResult {
  success: boolean;
  message?: string;
  productId?: string;
}

interface IdeaStore {
  ideas: Idea[];
  currentIdeaId: string | null;
  wizardStep: WizardStepKey;
  wizardForm: {
    positioning: string;
    targetUsers: string;
    painPoints: string;
    coreFeatures: string;
  };
  aiAskHistory: ChatMessage[];
  prdChatHistory: ChatMessage[];
  prdContent: string;
  aiLoading: boolean;

  initDraft: () => string;
  loadIdea: (id: string) => void;
  setCurrentIdeaId: (id: string | null) => void;
  setWizardStep: (step: WizardStepKey) => void;
  updateWizardForm: (field: keyof IdeaStore['wizardForm'], value: string) => void;
  pushAiAsk: (msg: ChatMessage) => void;
  clearAiAsk: () => void;
  setPrdContent: (content: string) => void;
  pushPrdChat: (msg: ChatMessage) => void;
  setAiLoading: (loading: boolean) => void;
  saveIdea: (patch?: Partial<Idea>) => void;
  submitIdea: () => void;
  startReview: () => ReviewResult;
  passReview: (args: { comment: string; assignPm?: string }) => ReviewResult;
  rejectReview: (args: { comment: string }) => ReviewResult;
  pushReviewComment: (comment: ReviewComment) => void;
  claimIdea: (id: string, pmName?: string) => ClaimResult;
  deleteIdea: (id: string) => void;
  resetWizard: () => void;
}

const emptyForm = {
  positioning: '',
  targetUsers: '',
  painPoints: '',
  coreFeatures: '',
};

const PM_CANDIDATES = ['吴经理', '张伟', '李娜', '王强', '周德友'];

export const useIdeaStore = create<IdeaStore>()(
  persist(
    (set, get) => ({
      ideas: INITIAL_IDEAS,
      currentIdeaId: null,
      wizardStep: 'positioning',
      wizardForm: { ...emptyForm },
      aiAskHistory: [],
      prdChatHistory: [],
      prdContent: '',
      aiLoading: false,

      initDraft: () => {
        const id = `ID-${Date.now()}`;
        const draft: Idea = {
          id,
          title: '未命名创意',
          summary: '',
          author: '吴经理',
          dept: '软件中心',
          status: '草稿',
          aiScore: 0,
          createdAt: new Date().toISOString().slice(0, 10),
          positioning: '',
          targetUsers: '',
          painPoints: '',
          coreFeatures: '',
          prdContent: '',
          reviewComments: [],
        };
        set({
          ideas: [draft, ...get().ideas],
          currentIdeaId: id,
          wizardStep: 'positioning',
          wizardForm: { ...emptyForm },
          aiAskHistory: [],
          prdChatHistory: [],
          prdContent: '',
        });
        return id;
      },

      loadIdea: (id) => {
        const idea = get().ideas.find((i) => i.id === id);
        if (!idea) return;
        set({
          currentIdeaId: id,
          wizardStep: 'positioning',
          wizardForm: {
            positioning: idea.positioning || '',
            targetUsers: idea.targetUsers || '',
            painPoints: idea.painPoints || '',
            coreFeatures: idea.coreFeatures || '',
          },
          prdContent: idea.prdContent || '',
          aiAskHistory: [],
          prdChatHistory: [],
        });
      },

      setCurrentIdeaId: (id) => set({ currentIdeaId: id }),
      setWizardStep: (step) => set({ wizardStep: step }),
      updateWizardForm: (field, value) =>
        set((s) => ({ wizardForm: { ...s.wizardForm, [field]: value } })),
      pushAiAsk: (msg) => set((s) => ({ aiAskHistory: [...s.aiAskHistory, msg] })),
      clearAiAsk: () => set({ aiAskHistory: [] }),
      setPrdContent: (content) => set({ prdContent: content }),
      pushPrdChat: (msg) => set((s) => ({ prdChatHistory: [...s.prdChatHistory, msg] })),
      setAiLoading: (loading) => set({ aiLoading: loading }),

      saveIdea: (patch) => {
        const { currentIdeaId, wizardForm, prdContent, ideas } = get();
        if (!currentIdeaId) return;
        const title =
          wizardForm.positioning.trim().slice(0, 20) ||
          patch?.title ||
          '未命名创意';
        const summary =
          `${wizardForm.targetUsers.trim().slice(0, 30)} · ${wizardForm.painPoints.trim().slice(0, 30)}` ||
          patch?.summary ||
          '（尚未填写关键信息）';
        set({
          ideas: ideas.map((i) =>
            i.id === currentIdeaId
              ? {
                  ...i,
                  title,
                  summary,
                  positioning: wizardForm.positioning,
                  targetUsers: wizardForm.targetUsers,
                  painPoints: wizardForm.painPoints,
                  coreFeatures: wizardForm.coreFeatures,
                  prdContent,
                  ...(patch || {}),
                }
              : i
          ),
        });
      },

      submitIdea: () => {
        get().saveIdea({ status: '草稿', aiScore: 72 + Math.floor(Math.random() * 20) });
      },

      startReview: () => {
        const { currentIdeaId, ideas } = get();
        if (!currentIdeaId) return { success: false, message: '创意不存在' };
        const idea = ideas.find((i) => i.id === currentIdeaId);
        if (!idea) return { success: false, message: '创意不存在' };
        if (idea.status !== '草稿') {
          return { success: false, message: '只有草稿状态可以发起评审' };
        }
        const score = idea.aiScore > 0 ? idea.aiScore : 72 + Math.floor(Math.random() * 20);
        const firstComment: ReviewComment = {
          id: `r-${Date.now()}`,
          reviewer: '系统',
          role: '流程',
          content: `提案已提交评审委员会，将由 3+ 位评委进行 AI 辅助审阅，预计 2 个工作日内出结果。AI 辅助评分：${score} / 100`,
          createdAt: new Date().toLocaleString('zh-CN'),
          result: '待评审',
        };
        set({
          ideas: ideas.map((i) =>
            i.id === currentIdeaId
              ? {
                  ...i,
                  status: '评审中',
                  aiScore: score,
                  reviewComments: [...(i.reviewComments || []), firstComment],
                }
              : i
          ),
        });
        return { success: true, message: '已成功发起评审，进入「评审中」队列' };
      },

      pushReviewComment: (comment) => {
        const { currentIdeaId, ideas } = get();
        if (!currentIdeaId) return;
        set({
          ideas: ideas.map((i) =>
            i.id === currentIdeaId
              ? { ...i, reviewComments: [...(i.reviewComments || []), comment] }
              : i
          ),
        });
      },

      passReview: ({ comment, assignPm }) => {
        const { currentIdeaId, ideas } = get();
        if (!currentIdeaId) return { success: false, message: '创意不存在' };
        const idea = ideas.find((i) => i.id === currentIdeaId);
        if (!idea) return { success: false, message: '创意不存在' };
        if (idea.status !== '评审中') {
          return { success: false, message: '只有评审中状态可以执行评审通过' };
        }
        const passComment: ReviewComment = {
          id: `r-${Date.now()}`,
          reviewer: '评审委员会',
          role: '评委结论',
          content: comment || '评审通过，进入孵化阶段。',
          createdAt: new Date().toLocaleString('zh-CN'),
          result: '通过',
        };

        let productId: string | undefined;
        let assignedPm = assignPm && assignPm !== '暂不分配，后续在列表认领' ? assignPm : undefined;

        let newIdeas = ideas.map((i) =>
          i.id === currentIdeaId
            ? {
                ...i,
                status: '孵化中' as const,
                assignedPm,
                reviewComments: [...(i.reviewComments || []), passComment],
              }
            : i
        );

        if (assignedPm) {
          const depts = Array.from(new Set([idea.dept, '产品部']));
          const product = buildProductFromIdea({
            ideaId: idea.id,
            title: idea.title,
            summary: idea.summary,
            pm: assignedPm,
            depts,
            author: idea.author,
          });
          useProductStore.getState().addProduct(product);
          productId = product.id;
          newIdeas = newIdeas.map((i) =>
            i.id === currentIdeaId ? { ...i, productId: product.id } : i
          );
        }

        set({ ideas: newIdeas });
        return {
          success: true,
          message: assignedPm
            ? `评审通过，已分配给 ${assignedPm}，产品线同步创建至产品大盘`
            : '评审通过，已进入孵化阶段（暂未分配 PM，可在列表认领）',
          productId,
        };
      },

      rejectReview: ({ comment }) => {
        const { currentIdeaId, ideas } = get();
        if (!currentIdeaId) return { success: false, message: '创意不存在' };
        const idea = ideas.find((i) => i.id === currentIdeaId);
        if (!idea) return { success: false, message: '创意不存在' };
        if (idea.status !== '评审中') {
          return { success: false, message: '只有评审中状态可以执行评审不通过' };
        }
        if (!comment.trim()) {
          return { success: false, message: '评审不通过必须填写原因' };
        }
        const rejectComment: ReviewComment = {
          id: `r-${Date.now()}`,
          reviewer: '评审委员会',
          role: '评委结论',
          content: comment,
          createdAt: new Date().toLocaleString('zh-CN'),
          result: '未通过',
        };
        set({
          ideas: ideas.map((i) =>
            i.id === currentIdeaId
              ? {
                  ...i,
                  status: '未通过' as const,
                  rejectReason: comment,
                  reviewComments: [...(i.reviewComments || []), rejectComment],
                }
              : i
          ),
        });
        return { success: true, message: '评审不通过，已记录原因' };
      },

      claimIdea: (id, pmName = '吴经理') => {
        const idea = get().ideas.find((i) => i.id === id);
        if (!idea) {
          return { success: false, message: '创意提案不存在' };
        }
        if (idea.status !== '孵化中') {
          return { success: false, message: '只有「孵化中」状态的创意可以认领' };
        }
        if (idea.assignedPm) {
          return { success: false, message: `该创意已分配给 ${idea.assignedPm}，无需重复认领` };
        }

        const depts = Array.from(new Set([idea.dept, '产品部']));
        const product = buildProductFromIdea({
          ideaId: idea.id,
          title: idea.title,
          summary: idea.summary,
          pm: pmName,
          depts,
          author: idea.author,
        });

        useProductStore.getState().addProduct(product);

        set((s) => ({
          ideas: s.ideas.map((i) =>
            i.id === id
              ? { ...i, assignedPm: pmName, productId: product.id }
              : i
          ),
        }));

        return { success: true, productId: product.id };
      },

      deleteIdea: (id) =>
        set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),

      resetWizard: () =>
        set({
          currentIdeaId: null,
          wizardStep: 'positioning',
          wizardForm: { ...emptyForm },
          aiAskHistory: [],
          prdChatHistory: [],
          prdContent: '',
        }),
    }),
    {
      name: 'nhy-idea-store',
      partialize: (state) => ({ ideas: state.ideas }),
    }
  )
);

export const REVIEW_PM_OPTIONS = ['暂不分配，后续在列表认领', ...PM_CANDIDATES];
