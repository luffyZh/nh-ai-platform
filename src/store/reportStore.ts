import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeeklyReport, ReportItem, ReportStatus } from '../types/report';
import type { ChatMessage } from '../types/idea';
import {
  INITIAL_REPORTS,
  WEEK_LABEL,
  BUILD_MY_LINKED_PRODUCTS,
  buildMarkdownFromReport,
  generateReportItems,
} from '../mock/reportMock';

export const CURRENT_USER = '吴经理';
export const CURRENT_DEPT = '软件中心';

interface ReportStore {
  reports: WeeklyReport[];
  currentReportId: string | null;

  initDraft: () => string;
  loadReport: (id: string) => WeeklyReport | null;
  setCurrentReportId: (id: string | null) => void;
  setMarkdownContent: (content: string) => void;
  replaceItemsFromLinkedProducts: (linkedProductIds?: string[]) => { items: ReportItem[]; markdownContent: string };
  addItem: (item: Omit<ReportItem, 'id' | 'createdAt'>) => void;
  removeItem: (itemId: string) => void;
  pushChat: (msg: ChatMessage) => void;
  saveReport: (patch?: Partial<WeeklyReport>) => void;
  submitReport: () => { success: boolean; message?: string };
  setReportStatus: (id: string, status: ReportStatus) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const todayISO = () => new Date().toISOString().slice(0, 10);

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: INITIAL_REPORTS,
      currentReportId: null,

      initDraft: () => {
        const id = `R-${Date.now()}-${uid().slice(0, 4)}`;
        const linked = BUILD_MY_LINKED_PRODUCTS();
        const newReport: WeeklyReport = {
          id,
          title: `${CURRENT_USER} - 本周工作周报（${WEEK_LABEL}）`,
          author: CURRENT_USER,
          dept: CURRENT_DEPT,
          weekLabel: WEEK_LABEL,
          createdAt: todayISO(),
          updatedAt: todayISO(),
          status: '草稿',
          linkedProductIds: linked.map((p) => p.productId),
          items: [],
          markdownContent: '',
          chatHistory: [
            {
              id: uid(),
              role: 'assistant',
              content: `👋 周报助手来了！检测到您本周共关联 **${linked.length} 个项目**（${linked.map((p) => p.productName).join(' / ')}），点右侧「🚀 一键生成本周周报」按钮，立刻把各项目进展自动整理好～`,
              createdAt: new Date().toISOString(),
            },
          ],
        };
        newReport.markdownContent = buildMarkdownFromReport(newReport);
        set((s) => ({ reports: [newReport, ...s.reports], currentReportId: id }));
        return id;
      },

      loadReport: (id) => {
        const r = get().reports.find((x) => x.id === id) || null;
        set({ currentReportId: id });
        return r;
      },

      setCurrentReportId: (id) => set({ currentReportId: id }),

      setMarkdownContent: (content) => {
        const { currentReportId, reports } = get();
        if (!currentReportId) return;
        set({
          reports: reports.map((r) =>
            r.id === currentReportId ? { ...r, markdownContent: content, updatedAt: todayISO() } : r
          ),
        });
      },

      replaceItemsFromLinkedProducts: (linkedProductIds) => {
        const { currentReportId, reports } = get();
        if (!currentReportId) return { items: [], markdownContent: '' };
        const current = reports.find((r) => r.id === currentReportId);
        if (!current) return { items: [], markdownContent: '' };
        const useIds = linkedProductIds || current.linkedProductIds;
        const linked = BUILD_MY_LINKED_PRODUCTS().filter((p) => useIds.includes(p.productId));
        const items = generateReportItems(linked);
        const next = { ...current, items, markdownContent: '', updatedAt: todayISO() };
        next.markdownContent = buildMarkdownFromReport(next);
        set({ reports: reports.map((r) => (r.id === currentReportId ? next : r)) });
        return { items, markdownContent: next.markdownContent };
      },

      addItem: (item) => {
        const { currentReportId, reports } = get();
        if (!currentReportId) return;
        const full: ReportItem = { ...item, id: uid(), createdAt: new Date().toISOString() };
        set({
          reports: reports.map((r) => {
            if (r.id !== currentReportId) return r;
            const items = [...r.items, full];
            return { ...r, items, markdownContent: buildMarkdownFromReport({ ...r, items }), updatedAt: todayISO() };
          }),
        });
      },

      removeItem: (itemId) => {
        const { currentReportId, reports } = get();
        if (!currentReportId) return;
        set({
          reports: reports.map((r) => {
            if (r.id !== currentReportId) return r;
            const items = r.items.filter((x) => x.id !== itemId);
            return { ...r, items, markdownContent: buildMarkdownFromReport({ ...r, items }), updatedAt: todayISO() };
          }),
        });
      },

      pushChat: (msg) => {
        const { currentReportId, reports } = get();
        if (!currentReportId) return;
        set({
          reports: reports.map((r) =>
            r.id === currentReportId ? { ...r, chatHistory: [...r.chatHistory, msg] } : r
          ),
        });
      },

      saveReport: (patch) => {
        const { currentReportId, reports } = get();
        if (!currentReportId) return;
        set({
          reports: reports.map((r) =>
            r.id === currentReportId ? { ...r, ...(patch || {}), updatedAt: todayISO() } : r
          ),
        });
      },

      submitReport: () => {
        const { currentReportId, reports } = get();
        if (!currentReportId) return { success: false, message: '请先选择周报' };
        const current = reports.find((r) => r.id === currentReportId);
        if (!current) return { success: false, message: '周报不存在' };
        if (current.items.length === 0 && current.markdownContent.trim().length < 30) {
          return { success: false, message: '周报内容为空，请先生成或补充内容' };
        }
        set({
          reports: reports.map((r) => (r.id === currentReportId ? { ...r, status: '待确认', updatedAt: todayISO() } : r)),
        });
        return { success: true, message: '周报已提交，进入待确认队列' };
      },

      setReportStatus: (id, status) => {
        set((s) => ({
          reports: s.reports.map((r) => (r.id === id ? { ...r, status, updatedAt: todayISO() } : r)),
        }));
      },
    }),
    {
      name: 'nhy-report-store',
    }
  )
);
