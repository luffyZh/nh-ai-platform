import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductPhase, HealthStatus, TeamMember } from '../mock/productMock';
import { MOCK_PRODUCTS } from '../mock/productMock';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  getProductById: (id: string) => Product | undefined;
}

export function buildProductFromIdea(params: {
  ideaId: string;
  title: string;
  summary: string;
  pm: string;
  depts: string[];
  author: string;
}): Product {
  const { title, summary, pm, depts, author, ideaId } = params;
  const id = `P-${Date.now()}`;
  const today = new Date().toISOString().slice(0, 10);
  const shortName = title.length > 12 ? title.slice(0, 12) + '…' : title;

  const teamMembers: TeamMember[] = [
    { id: `${id}-pm`, name: pm, role: 'PM', dept: '产品部', avatarColor: 'blue' },
    { id: `${id}-pmo`, name: '杨婕', role: 'PMO', dept: '项目管理办公室', avatarColor: 'indigo' },
    { id: `${id}-qa`, name: '潘超', role: 'QA', dept: '质量部', avatarColor: 'emerald' },
  ];

  depts.forEach((d, idx) => {
    const roles: Record<string, TeamMember['role']> = {
      '硬件一部': '硬件',
      '硬件二部': '硬件',
      '算法一部': '算法',
      '算法二部': '算法',
      '软件中心': '软件',
      '测试中心': '测试',
      '工业设计部': '结构',
    };
    const colors = ['amber', 'orange', 'violet', 'purple', 'cyan', 'sky', 'rose', 'fuchsia'];
    teamMembers.push({
      id: `${id}-m${idx}`,
      name: author || '待定',
      role: roles[d] || '软件',
      dept: d,
      avatarColor: colors[idx % colors.length] as TeamMember['avatarColor'],
    });
  });

  const phase: ProductPhase = '原型期';
  const health: HealthStatus = '正常';

  const startDate = today;
  const endDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return {
    id,
    name: title,
    shortName,
    oneLiner: summary || '（来自创意机会池认领的原型期项目）',
    pm,
    pmo: '杨婕',
    qa: '潘超',
    depts,
    phase,
    health,
    date: today,
    keyMetrics: {
      phaseProgress: 5,
      docCompletionRate: 10,
      riskCount: 0,
      lastReportTime: new Date().toLocaleString('zh-CN', { hour12: false }),
    },
    team: teamMembers,
    phases: [
      {
        phase: '概念期',
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        target: `创意提案「${title}」评审通过，由 ${pm} 认领并推进立项`,
        entryConditions: ['创意提案通过评审', '产品立项审批通过', '核心团队组建完成'],
        exitConditions: [
          '产品定义文档 V1.0 发布（由创意 PRD 转化）',
          '技术可行性评估通过',
          '原型期开发资源确认',
        ],
        docs: [
          { name: '产品定义文档 V1.0', required: true, uploaded: true, uploader: pm, uploadTime: today },
          { name: '技术可行性评估报告', required: true, uploaded: false },
          { name: '创意提案 PRD 原文（ID：${ideaId}）', required: false, uploaded: true, uploader: author, uploadTime: today },
        ],
        reviewStatus: '已通过',
      },
      {
        phase: '原型期',
        startDate,
        endDate,
        target: `完成「${title}」原型机 / Demo 开发，验证核心指标达成`,
        entryConditions: ['概念期评审通过', '原型开发资源到位', '关键技术选型确认'],
        exitConditions: [
          '核心功能 Demo 可演示',
          '关键性能指标达成 MVP 目标',
          '原型期阶段评审通过',
        ],
        docs: [
          { name: '硬件总体设计方案', required: true, uploaded: false },
          { name: '算法需求规格说明书', required: true, uploaded: false },
          { name: '软件架构设计文档', required: true, uploaded: false },
          { name: 'BOM 表（原型版）', required: true, uploaded: false },
          { name: '测试计划（原型阶段）', required: true, uploaded: false },
        ],
        reviewStatus: '进行中',
      },
      {
        phase: 'EVT',
        startDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        target: '完成实验室验证样机，修复设计缺陷',
        entryConditions: ['原型期核心指标达成', 'BOM 锁定', '测试计划评审通过'],
        exitConditions: ['EVT 样机交付', '环境可靠性测试通过', '关键性能达标'],
        docs: [
          { name: 'BOM 表（量产准备版）', required: true, uploaded: false },
          { name: '测试报告（EVT）', required: true, uploaded: false },
          { name: '可靠性测试报告', required: true, uploaded: false },
        ],
        reviewStatus: '未开始',
      },
      {
        phase: 'DVT',
        startDate: new Date(Date.now() + 121 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        target: '完成设计验证，准备导入量产',
        entryConditions: ['EVT 评审通过', '量产供应商选定', '试产计划确定'],
        exitConditions: ['DVT 全项目测试通过', '生产工艺文件发布'],
        docs: [
          { name: '测试报告（DVT）', required: true, uploaded: false },
          { name: '生产工艺文件', required: true, uploaded: false },
          { name: '量产 BOM 表', required: true, uploaded: false },
        ],
        reviewStatus: '未开始',
      },
      {
        phase: 'MP',
        startDate: new Date(Date.now() + 201 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        target: '进入量产阶段，实现小批量标品化',
        entryConditions: ['DVT 评审通过', '质量标准达成一致', '售后服务体系建立'],
        exitConditions: ['首批量产交付', '标品外壳与 SOP 固化', '年产能规划落地'],
        docs: [
          { name: '量产测试报告', required: true, uploaded: false },
          { name: '售后运维手册', required: true, uploaded: false },
        ],
        reviewStatus: '未开始',
      },
    ],
    feeds: [
      {
        id: `${id}-feed-1`,
        author: pm,
        role: 'PM',
        avatarColor: 'blue',
        time: new Date().toLocaleString('zh-CN', { hour12: false }),
        tag: '里程碑',
        content: `创意提案「${title}」由 ${pm} 成功认领，正式进入产品线管理，阶段：原型期。创意 ID：${ideaId}`,
      },
    ],
    reports: [],
    assets: [],
    aiScenes: [
      {
        id: `${id}-s1`,
        name: '领导汇报版',
        description: '侧重产品进展、风险卡点、里程碑与下一步计划，适用于周会/月度汇报',
        icon: 'leader',
        prompt: '',
      },
      {
        id: `${id}-s2`,
        name: '售前沟通版',
        description: '侧重客户价值、差异化亮点、典型场景',
        icon: 'presale',
        prompt: '',
      },
      {
        id: `${id}-s3`,
        name: '自定义场景',
        description: '根据客户/项目具体需求，自由输入背景让 AI 生成定制化材料',
        icon: 'custom',
        prompt: '',
      },
    ],
  };
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,

      addProduct: (product) =>
        set((s) => ({
          products: [product, ...s.products],
        })),

      getProductById: (id) => get().products.find((p) => p.id === id),
    }),
    {
      name: 'nhy-product-store',
      partialize: (state) => ({ products: state.products }),
    }
  )
);
