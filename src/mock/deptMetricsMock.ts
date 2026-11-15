import type { HealthStatus } from './productMock';

/** 预警级别：项目健康度预警优先于指标缺口 */
export type BottleneckLevel = '延期' | '风险' | '指标缺口';

/** 预警归属范围 */
export type BottleneckScope = '项目' | '部门';

/** 部门效能雷达图的单个维度 */
export interface DeptMetricDimension {
  /** 指标名称，如"打样直通率" */
  subject: string;
  /** 实际达成值（0-100） */
  actual: number;
  /** 目标值（0-100） */
  target: number;
}

/** 部门在单个参战项目上的核心考核指标 */
export interface DeptProjectMetric {
  productId: string;
  /** 该项目下考核该部门的核心指标名 */
  metricName: string;
  target: number;
  actual: number;
  /** 指标责任人 */
  owner: string;
  /** 瓶颈说明与调配建议，无瓶颈时为空串 */
  note: string;
}

/** 单个部门的效能画像 */
export interface DeptMetricProfile {
  dept: string;
  /** 部门核心能力雷达（5 个维度） */
  radar: DeptMetricDimension[];
  /** 该部门在各参战项目上的指标达成情况 */
  projects: DeptProjectMetric[];
}

/** 部门效能指标库：按部门维护专属的北极星指标 */
export const DEPT_METRIC_PROFILES: DeptMetricProfile[] = [
  {
    dept: '硬件一部',
    radar: [
      { subject: '打样直通率', actual: 88, target: 95 },
      { subject: 'BOM 成本控制率', actual: 91, target: 90 },
      { subject: '交付及时率', actual: 90, target: 92 },
      { subject: '文档合规率', actual: 87, target: 90 },
      { subject: '试制周期达标率', actual: 85, target: 88 },
    ],
    projects: [
      {
        productId: 'P-2026003',
        metricName: '打样直通率',
        target: 95,
        actual: 88,
        owner: '王强',
        note: '线圈贴合工序良率波动明显，建议引入 AOI 机器视觉替代人工全检，并将直通率纳入每日站会同步。',
      },
    ],
  },
  {
    dept: '硬件二部',
    radar: [
      { subject: '打样直通率', actual: 93, target: 95 },
      { subject: 'BOM 成本控制率', actual: 86, target: 90 },
      { subject: '交付及时率', actual: 88, target: 92 },
      { subject: '文档合规率', actual: 92, target: 90 },
      { subject: '试制周期达标率', actual: 89, target: 88 },
    ],
    projects: [
      {
        productId: 'P-2026004',
        metricName: '打样直通率',
        target: 95,
        actual: 93,
        owner: '周德友',
        note: '感算一体化 PCB 叠层方案调整中，直通率短期承压，预计叠层定版后回升至目标值。',
      },
      {
        productId: 'P-2026002',
        metricName: 'BOM 成本偏差率',
        target: 90,
        actual: 78,
        owner: '周德友',
        note: '车规级 CIS 芯片涨价 18%，国产替代料导入滞后，已触发成本预警，建议启动二供验证并重新核算 DVT 成本基线。',
      },
    ],
  },
  {
    dept: '算法一部',
    radar: [
      { subject: '模型交付周期达标率', actual: 94, target: 92 },
      { subject: '准确率达成率', actual: 96, target: 95 },
      { subject: '交付及时率', actual: 93, target: 92 },
      { subject: '文档合规率', actual: 90, target: 90 },
      { subject: '需求响应速度', actual: 91, target: 90 },
    ],
    projects: [
      {
        productId: 'P-2026004',
        metricName: '端侧识别准确率',
        target: 95,
        actual: 96,
        owner: '刘洋',
        note: '',
      },
      {
        productId: 'P-2026001',
        metricName: '语音识别准确率',
        target: 96,
        actual: 95,
        owner: '刘洋',
        note: '方言识别场景仍存在 1pt 缺口，方言自适应模型正在训练，预计下个迭代补齐。',
      },
    ],
  },
  {
    dept: '算法二部',
    radar: [
      { subject: '模型交付周期达标率', actual: 82, target: 90 },
      { subject: '准确率达成率', actual: 85, target: 92 },
      { subject: '交付及时率', actual: 80, target: 90 },
      { subject: '文档合规率', actual: 88, target: 90 },
      { subject: '需求响应速度', actual: 84, target: 88 },
    ],
    projects: [
      {
        productId: 'P-2026002',
        metricName: '模型准确率达标率',
        target: 92,
        actual: 85,
        owner: '李娜',
        note: '夜间低照度场景 mAP 未达标（85% / 92%），已从算法一部调配 2 名工程师支援，预计 2 周内收敛。',
      },
    ],
  },
  {
    dept: '软件中心',
    radar: [
      { subject: '交付及时率', actual: 95, target: 92 },
      { subject: '需求变更率控制', actual: 90, target: 88 },
      { subject: '文档合规率', actual: 93, target: 90 },
      { subject: '缺陷逃逸率控制', actual: 91, target: 92 },
      { subject: '需求响应速度', actual: 94, target: 90 },
    ],
    projects: [
      {
        productId: 'P-2026004',
        metricName: '软件版本交付及时率',
        target: 92,
        actual: 95,
        owner: '王强',
        note: '',
      },
      {
        productId: 'P-2026001',
        metricName: '需求变更率控制',
        target: 88,
        actual: 90,
        owner: '王强',
        note: '',
      },
    ],
  },
  {
    dept: '测试中心',
    radar: [
      { subject: '测试用例执行率', actual: 96, target: 95 },
      { subject: '缺陷发现率', actual: 89, target: 92 },
      { subject: '交付及时率', actual: 91, target: 92 },
      { subject: '文档合规率', actual: 94, target: 90 },
      { subject: '报告一次通过率', actual: 87, target: 90 },
    ],
    projects: [
      {
        productId: 'P-2026004',
        metricName: '可靠性测试用例执行率',
        target: 95,
        actual: 96,
        owner: '潘超',
        note: '',
      },
      {
        productId: 'P-2026003',
        metricName: '测试报告一次通过率',
        target: 90,
        actual: 87,
        owner: '潘超',
        note: 'EMC 项出现两次复测，建议测试中心提前介入设计评审，将 EMC 预测试前移至原型期。',
      },
    ],
  },
];

/** 未在指标库中维护的部门（如新建产品带出的部门）使用的兜底雷达画像 */
export const DEFAULT_DEPT_RADAR: DeptMetricDimension[] = [
  { subject: '交付及时率', actual: 90, target: 92 },
  { subject: '质量达标率', actual: 91, target: 92 },
  { subject: '成本控制率', actual: 89, target: 90 },
  { subject: '文档合规率', actual: 90, target: 90 },
  { subject: '协同响应速度', actual: 89, target: 90 },
];

/** 兜底单项目达成率：由产品 ID 推导，保证同一产品每次渲染数值稳定 */
export function fallbackAchievement(productId: string): number {
  let hash = 0;
  for (let i = 0; i < productId.length; i += 1) {
    hash = (hash * 31 + productId.charCodeAt(i)) % 997;
  }
  return 88 + (hash % 9);
}

/** 效能瓶颈预警条目 */
export interface BottleneckItem {
  id: string;
  scope: BottleneckScope;
  level: BottleneckLevel;
  /** 项目级为产品名，部门级为空 */
  productName: string;
  metricName: string;
  target: number;
  actual: number;
  /** 缺口 = 目标 - 实际，恒为正数 */
  gap: number;
  owner: string;
  suggestion: string;
}

const LEVEL_WEIGHT: Record<BottleneckLevel, number> = {
  延期: 0,
  风险: 1,
  指标缺口: 2,
};

interface ProjectPerfInput {
  productId: string;
  productName: string;
  health: HealthStatus;
}

/**
 * 汇总某部门的效能瓶颈预警：
 * 1) 参战项目中健康度为「延期 / 风险」的，按项目健康度预警；
 * 2) 参战项目中指标未达标的，按指标缺口预警；
 * 3) 部门雷达画像中未达标的维度，作为部门级共性缺口预警。
 */
export function buildBottlenecks(
  profile: DeptMetricProfile,
  projectPerfs: ProjectPerfInput[]
): BottleneckItem[] {
  const items: BottleneckItem[] = [];

  projectPerfs.forEach((perf) => {
    const metric = profile.projects.find((p) => p.productId === perf.productId);
    if (!metric || metric.actual >= metric.target) return;
    const level: BottleneckLevel = perf.health === '延期' || perf.health === '风险' ? perf.health : '指标缺口';
    items.push({
      id: `proj-${perf.productId}`,
      scope: '项目',
      level,
      productName: perf.productName,
      metricName: metric.metricName,
      target: metric.target,
      actual: metric.actual,
      gap: metric.target - metric.actual,
      owner: metric.owner,
      suggestion: metric.note || '指标未达标，建议纳入下一次项目例会复盘。',
    });
  });

  profile.radar.forEach((dim) => {
    if (dim.actual >= dim.target) return;
    items.push({
      id: `dept-${dim.subject}`,
      scope: '部门',
      level: '指标缺口',
      productName: '',
      metricName: dim.subject,
      target: dim.target,
      actual: dim.actual,
      gap: dim.target - dim.actual,
      owner: '部门负责人',
      suggestion: '部门级共性短板，建议跨项目统一调配资源并制定专项提升计划。',
    });
  });

  return items.sort((a, b) => {
    const w = LEVEL_WEIGHT[a.level] - LEVEL_WEIGHT[b.level];
    return w !== 0 ? w : b.gap - a.gap;
  });
}
