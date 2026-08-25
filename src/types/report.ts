import type { ChatMessage } from './idea';

export type ReportStatus = '草稿' | '待确认' | '已发送';

export type ReportItemCategory = '核心进展' | '风险问题' | '下周计划';

export interface ReportItem {
  id: string;
  productId: string;
  productName: string;
  category: ReportItemCategory;
  content: string;
  createdAt: string;
}

export interface WeeklyReport {
  id: string;
  title: string;
  author: string;
  dept: string;
  weekLabel: string;
  createdAt: string;
  updatedAt: string;
  status: ReportStatus;
  linkedProductIds: string[];
  markdownContent: string;
  items: ReportItem[];
  chatHistory: ChatMessage[];
}
