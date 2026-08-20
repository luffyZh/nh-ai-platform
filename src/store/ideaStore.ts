import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Idea, ChatMessage, WizardStepKey } from '../types/idea';
import { INITIAL_IDEAS } from '../mock/ideaMock';

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
  claimIdea: (id: string) => void;
  deleteIdea: (id: string) => void;
  resetWizard: () => void;
}

const emptyForm = {
  positioning: '',
  targetUsers: '',
  painPoints: '',
  coreFeatures: '',
};

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
        get().saveIdea({ status: '已提交', aiScore: 72 + Math.floor(Math.random() * 20) });
      },

      claimIdea: (id) =>
        set((s) => ({
          ideas: s.ideas.map((i) =>
            i.id === id ? { ...i, status: '孵化中' } : i
          ),
        })),

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
