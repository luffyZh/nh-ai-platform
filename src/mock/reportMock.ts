import type { WeeklyReport, ReportItem, ReportItemCategory } from '../types/report';

const now = Date.now();
const DAY = 86400000;
const today = new Date(now);
const monday = new Date(today.getTime() - (today.getDay() - 1) * DAY);
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const fmt = (d: Date) => `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;

const WEEK_LABEL = `第 ${Math.ceil((monday.getDate() + new Date(monday.getFullYear(), monday.getMonth(), 1).getDay() - 1) / 7)} 周 (${fmt(monday)} - ${fmt(new Date(monday.getTime() + 4 * DAY))})`;
const WEEK_LABEL_32 = '第 32 周 (2026/08/11 - 2026/08/15)';
const WEEK_LABEL_31 = '第 31 周 (2026/08/04 - 2026/08/08)';

const uid = () => Math.random().toString(36).slice(2, 10);

export const BUILD_MY_LINKED_PRODUCTS = () => [
  { productId: 'P-2026004', productName: 'GuardX 电子哨兵', shortId: '004' },
  { productId: 'P-2026003', productName: '智能座舱 V2.0', shortId: '003' },
  { productId: 'P-2026002', productName: '视觉感知模组', shortId: '002' },
  { productId: 'P-2026001', productName: '无线充电面板', shortId: '001' },
];

export const REPORT_QUICK_PROMPTS = [
  { label: '补充量化数据', text: '给每条进展补充具体数据：工时（小时）、完成度（%）、代码行数或文档页数' },
  { label: '风险加缓解措施', text: '在每条风险问题后面追加可执行的缓解措施建议（含负责人与时间节点）' },
  { label: '改写 STAR 句式', text: '把每条核心进展改写为 STAR 句式：情境-任务-行动-结果，更利于复盘' },
  { label: '按项目重分组', text: '把所有条目按关联产品重新分组，每个项目下分 进展 / 风险 / 下周计划 三小节' },
  { label: '精简 500 字', text: '把整份周报压缩到 500 字以内，适合向上级快速汇报的精炼版' },
  { label: '扩展详细版', text: '把整份周报扩展为 1500 字详细复盘版，每条追加背景与决策依据' },
];

const ITEM_MARK_PREFIX: Record<ReportItemCategory, string> = {
  核心进展: '✅',
  风险问题: '⚠️',
  下周计划: '📌',
};

export function buildMarkdownFromReport(report: Pick<WeeklyReport, 'title' | 'author' | 'dept' | 'weekLabel' | 'items'>): string {
  const lines: string[] = [];
  lines.push(`# ${report.title}`);
  lines.push('');
  lines.push(`> 汇报人：**${report.author}** | 部门：**${report.dept}** | 周期：**${report.weekLabel}**`);
  lines.push('');

  const groups: Record<ReportItemCategory, ReportItem[]> = { 核心进展: [], 风险问题: [], 下周计划: [] };
  report.items.forEach((it) => groups[it.category].push(it));

  (Object.keys(groups) as ReportItemCategory[]).forEach((cat, idx) => {
    lines.push(`## ${idx + 1}、${cat}`);
    lines.push('');
    const arr = groups[cat];
    if (arr.length === 0) {
      lines.push('_暂无条目_');
    } else {
      arr.forEach((it) => {
        lines.push(`- ${ITEM_MARK_PREFIX[cat]} **[${it.productName}]** ${it.content}  \`P${it.productId.slice(-4)}\``);
      });
    }
    lines.push('');
  });
  return lines.join('\n');
}

export function generateReportItems(linkedProducts: ReturnType<typeof BUILD_MY_LINKED_PRODUCTS>): ReportItem[] {
  const createdAt = new Date(now).toISOString();
  const items: ReportItem[] = [];
  const samples: Record<string, Record<ReportItemCategory, string[]>> = {
    P2026004: {
      核心进展: [
        '原型机 AOV/HVS 双路线均一次点亮：AOV 续航 18 天（目标 15）、HVS 探测距离 92m（目标 80），均超目标达成',
        '完成 Web 态势大屏 v0.3：事件列表 2s 内刷新、支持 4 分屏同时查看 16 路设备实时状态',
      ],
      风险问题: [
        '国产 CMOS 传感器良率本周掉到 76%，供应商反馈 9 月中旬才能恢复，备用料本周内未到位',
      ],
      下周计划: ['启动无锡外场试点部署：10 台 AOV + 4 台 HVS，完成首次 72 小时连续稳定性测试'],
    },
    P2026003: {
      核心进展: [
        '完成第 32 周架构设计评审：12 位评委通过（10 通过/2 有条件），遗留 5 项接口变更本周内关单',
        '与硬件部对齐 BOM v2.0：BOM 成本偏差率从 7.2% 降到 4.8%，进入 5% 以内安全区间',
      ],
      风险问题: ['3D 结构光模组交期再延 1 周（原 8/22→8/29），需从备选模组临时切换保证 EVT 节奏'],
      下周计划: ['PRD v2.1 发布并同步知识库；联合算法部完成 6 大场景的端侧算力预算评估'],
    },
    P2026002: {
      核心进展: [
        'BEV + Occupancy 联合模型训练完成 v3：nuScenes NDS 从 62.1 提升到 65.8，上车验证延迟 < 45ms',
        '完成雨雾/夜间场景数据增强：新增 1.2 万条难例，夜间召回率从 71% 提至 83%',
      ],
      风险问题: ['边缘端 TDA4 推理量化精度损失 3.2pt，下周需联合 TI FAE 做 INT8 混合精度调优'],
      下周计划: ['发布感知模型 v3.1，完成 EVT 路采实车 500km 无回放验证'],
    },
    P2026001: {
      核心进展: [
        'EVT 阶段第一次打样完成：20 套样品 100% 点亮，温升测试最高 41℃（限值 50），Qi2 认证通过率 98%',
        'PRD v2.0 输出，已同步知识库并抄送 7 位相关方评审',
      ],
      风险问题: ['定制金属线圈模具因台风延误 3 天，预计 8/26 才能到厂，影响 EVT2 打样'],
      下周计划: ['完成底层驱动联调；准备 EVT 第二次打样 BOM 与供应商产能确认'],
    },
  };

  linkedProducts.forEach((p) => {
    const key = `P${p.productId.slice(-7)}`;
    const data = samples[key] || {
      核心进展: [`${p.productName} 本周按计划推进，阶段性交付物正常`],
      风险问题: [],
      下周计划: [`${p.productName} 继续按里程碑推进`],
    };
    (Object.keys(data) as ReportItemCategory[]).forEach((cat) =>
      data[cat].forEach((content) =>
        items.push({
          id: uid(),
          productId: p.productId,
          productName: p.productName,
          category: cat,
          content,
          createdAt,
        })
      )
    );
  });
  return items;
}

export function generateReplyForReport(userText: string): { reply: string; patch?: Partial<Pick<WeeklyReport, 'markdownContent'>> } {
  const has精 = userText.includes('精简') || userText.includes('500');
  const has扩 = userText.includes('详细版') || userText.includes('扩展');
  const has量 = userText.includes('量化') || userText.includes('数据');
  if (has精) {
    return {
      reply:
        '已生成 500 字精简汇报版（建议直接复制到 IM 汇报）：\n\n' +
        '**本周整体：4 条产品线 20 项任务，19 项达预期，1 项延期（传感器良率）**\n\n' +
        '1️⃣ 电子哨兵：原型机双路线超目标（AOV+20%、HVS+15%），大屏 4 分屏可用；风险：国产 CMOS 良率掉 76%\n' +
        '2️⃣ 智能座舱：架构评审 10/12 通过，BOM 偏差降到 4.8%；风险：3D 结构光再延 1 周\n' +
        '3️⃣ 视觉模组：BEV NDS +3.7pt，夜间召回率 +12pt；风险：TDA4 量化精度损失 3.2pt\n' +
        '4️⃣ 无线充电：EVT 首打 100% 点亮，温升 41℃；风险：线圈台风延误 3 天\n\n' +
        '如需我直接把精简版**替换**到周报正文，回复「直接替换」即可。',
    };
  }
  if (has扩) {
    return {
      reply:
        '已为每条条目补充背景 + 决策依据的详细版说明。以下为每个项目的扩展摘要：\n\n' +
        '### P004 电子哨兵（详细摘要）\n' +
        '- 原型点亮背景：本季度 AOV 路线在新疆试点低温续航不达标，本次 v2 硬件新增 2 级电源门控策略；结果 AOV 实测多 3 天\n' +
        '- 大屏实现：与飞书低代码平台联调打通，事件直接推送到 PMO 周看板；避免单独开发 Web 后端\n\n' +
        '### P003 智能座舱（详细摘要）\n' +
        '- BOM 下降 2.4% 的关键动作：通过「座椅控制器 + 门控制器」合并为单域控，减少 2 颗 MCU 与 4 条高速线束\n\n' +
        '（共 12 条详细条目已准备好）直接把光标定位到要插入的位置，回复「插入详细版」即可写入正文。',
    };
  }
  if (has量) {
    return {
      reply:
        '已按「每条量化 3 维：工时 h / 完成度 % / 交付物页数或代码行数」生成量化版：\n\n' +
        '- P004 双路线原型点亮：投入 58 h·人 / 完成度 100% / 交付硬件原理图 14 页、测试报告 22 页\n' +
        '- P003 BOM 优化：投入 18 h·人 / 完成度 100% / BOM 条目 326→312，成本偏差 7.2%→4.8%\n' +
        '- P002 感知模型训练：投入 86 h·人 / GPU 1200 卡时 / 完成度 95% / 新增难例 1.2 万条\n' +
        '- P001 EVT 首次打样：投入 26 h·人 / 完成度 100% / 20 套样品 100% 点亮 / 测试报告 18 页\n\n' +
        '回复「插入量化」即可把量化版合并进正文。',
    };
  }
  return {
    reply:
      '收到指令 ✋。我已按「按项目重分组」的结构整理了当前周报的内容：\n\n' +
      '## P003 智能座舱\n' +
      '- 进展：架构评审 10/12 通过、BOM 偏差降到 4.8%\n' +
      '- 风险：3D 结构光再延 1 周\n' +
      '- 下周：PRD 2.1 + 6 场景算力评估\n\n' +
      '（共 4 个项目分组完成）需要我把当前正文直接「替换为按项目分组」的版本吗？',
  };
}

const INITIAL_ITEM_SET_001 = (() => {
  const ps = BUILD_MY_LINKED_PRODUCTS().slice(1, 2);
  return generateReportItems(ps).slice(0, 5);
})();

const INITIAL_ITEM_SET_002 = (() => {
  const ps = BUILD_MY_LINKED_PRODUCTS().slice(2, 3);
  return generateReportItems(ps).slice(0, 4);
})();

const INITIAL_ITEM_SET_003 = (() => {
  const ps = BUILD_MY_LINKED_PRODUCTS().slice(3, 4);
  return generateReportItems(ps).slice(0, 4);
})();

export const INITIAL_REPORTS: WeeklyReport[] = [
  {
    id: 'R-20260814-001',
    title: '智能座舱 V2.0 - 第32周进展汇报',
    author: '张伟',
    dept: '软件中心',
    weekLabel: WEEK_LABEL_32,
    createdAt: toISO(new Date(now - 11 * DAY)),
    updatedAt: toISO(new Date(now - 11 * DAY)),
    status: '已发送',
    linkedProductIds: ['P-2026003'],
    items: INITIAL_ITEM_SET_001,
    markdownContent: '',
    chatHistory: [],
  },
  {
    id: 'R-20260814-002',
    title: '视觉感知模组 - 算法迭代周报',
    author: '李娜',
    dept: '算法二部',
    weekLabel: WEEK_LABEL_32,
    createdAt: toISO(new Date(now - 11 * DAY)),
    updatedAt: toISO(new Date(now - 10 * DAY)),
    status: '待确认',
    linkedProductIds: ['P-2026002'],
    items: INITIAL_ITEM_SET_002,
    markdownContent: '',
    chatHistory: [],
  },
  {
    id: 'R-20260813-003',
    title: '无线充电面板 - EVT打样总结',
    author: '王强',
    dept: '硬件一部',
    weekLabel: WEEK_LABEL_31,
    createdAt: toISO(new Date(now - 12 * DAY)),
    updatedAt: toISO(new Date(now - 12 * DAY)),
    status: '已发送',
    linkedProductIds: ['P-2026001'],
    items: INITIAL_ITEM_SET_003,
    markdownContent: '',
    chatHistory: [],
  },
  {
    id: 'R-20260825-004',
    title: `吴经理 - 本周工作周报（${WEEK_LABEL}）`,
    author: '吴经理',
    dept: '软件中心',
    weekLabel: WEEK_LABEL,
    createdAt: toISO(today),
    updatedAt: toISO(today),
    status: '草稿',
    linkedProductIds: BUILD_MY_LINKED_PRODUCTS().map((p) => p.productId),
    items: [],
    markdownContent: '',
    chatHistory: [],
  },
];

INITIAL_REPORTS.forEach((r) => {
  if (!r.markdownContent) r.markdownContent = buildMarkdownFromReport(r);
});

export { WEEK_LABEL };
