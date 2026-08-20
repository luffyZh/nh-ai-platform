import type { Idea } from '../types/idea';

export const INITIAL_IDEAS: Idea[] = [
  {
    id: 'ID-20260801-001',
    title: '车载疲劳监测 AI 摄像头模组',
    summary: '面向商用车车队，通过红外摄像头识别闭眼/打哈欠，1s 内声光预警',
    author: '张伟',
    dept: '算法一部',
    status: '孵化中',
    aiScore: 88,
    createdAt: '2026-08-01',
    positioning: '商用车车队专用的驾驶员疲劳与分心监测硬件模组，集成红外摄像头 + AI 本地算力芯片',
    targetUsers: '1) 物流车队车队长 2) 长途重卡司机 3) 商用车主机厂后装采购',
    painPoints: '1) 夜间/逆光下人眼识别率低，误报漏报多；2) 云端推理网络差时报警延迟 > 5s；3) 司机反感被录像，隐私投诉高',
    coreFeatures:
      '1) 双 IR 红外摄像头，夜间识别率 ≥ 98%  2) 本地 NPU 端侧推理，延迟 < 300ms  3) 面部特征匿名化，不上传原图',
    prdContent: '',
  },
  {
    id: 'ID-20260805-002',
    title: 'BOM 成本 AI 助手',
    summary: '输入硬件方案，自动比价历史 BOM + 推荐替代料，预计降本 8%',
    author: '李娜',
    dept: '硬件二部',
    status: '已提交',
    aiScore: 81,
    createdAt: '2026-08-05',
    positioning: '硬件 PM 专属的 BOM 智能降本助手，对接历史项目 BOM 和采购报价库',
    targetUsers: '硬件项目经理、采购工程师、NPI 工程师',
    painPoints: '1) 新项目查历史 BOM 报价靠人肉翻 Excel；2) 替代料推荐靠老工程师经验，新人上手慢；3) 芯片涨价时无法快速感知成本冲击',
    coreFeatures: '1) BOM 相似度检索（Top-5 历史项目） 2) 替代料智能推荐 + 风险等级 3) 料号涨价实时预警',
    prdContent: '',
  },
  {
    id: 'ID-20260810-003',
    title: '研发周报 AI 自动汇总',
    summary: '抓取飞书/Jira/GitLab 动态，周五 16:00 自动出结构化周报草稿',
    author: '王强',
    dept: '软件中心',
    status: '已提交',
    aiScore: 76,
    createdAt: '2026-08-10',
    positioning: '面向研发团队的周报自动生成机器人',
    targetUsers: '项目经理、部门负责人、一线工程师',
    painPoints: '1) 周五下午写周报占 1h+；2) 跨部门汇总口径不一，PMO 要二次整理；3) 重要风险被流水账淹没',
    coreFeatures: '1) 多源数据抓取（飞书任务 + Git commit + Jira） 2) 风险自动高亮 3) 一键分发干系人',
    prdContent: '',
  },
  {
    id: 'ID-20260815-004',
    title: 'AR 远程维修指导眼镜',
    summary: '售后工程师戴 AR 眼镜，远端专家实时标注现场画面 + 语音指导',
    author: '陈敏',
    dept: '测试中心',
    status: '草稿',
    aiScore: 0,
    createdAt: '2026-08-15',
    positioning: '',
    targetUsers: '',
    painPoints: '',
    coreFeatures: '',
    prdContent: '',
  },
];

export const AI_ASK_BY_STEP: Record<string, string[]> = {
  positioning: [
    '您提到的产品方向，主要是做 2B 企业客户还是 2C 消费端呢？两者的商业模式差异挺大的～',
    '目前市面上有没有类似竞品？哪怕有一点像也算，帮我锚定一下差异化点。',
    '这个想法是你自己日常工作遇到的痛点，还是客户/同事提出来的？背后有没有具体场景？',
  ],
  targetUsers: [
    '这些目标用户里，谁会是第一个愿意为它买单的人？（种子用户画像）',
    '用户的典型一天工作流大概是什么样？我们会切入哪个环节？',
    '会不会有"使用者不买单，买单者不使用"的情况？需要打通哪些角色？',
  ],
  painPoints: [
    '这个痛点的发生频率大概是？（每天都有 / 每周几次 / 偶发）不同频率决定产品形态',
    '目前用户是怎么解决这个问题的？（workaround 是什么？替代方案越痛，机会越大）',
    '除了你提到的，有没有什么"隐性痛点"是用户自己都没说出来的？比如合规、隐私、跨部门协同？',
  ],
  coreFeatures: [
    '你列的功能里，如果只能留下 1 个，你留哪个？它就是我们的北极星功能。',
    '这些功能有没有强依赖硬件/数据/第三方授权？落地门槛高不高？',
    '第一个版本上线后，你打算用什么指标验证它真的解决了问题？（比如日活 / 节省时间 / 客户留存）',
  ],
};

export function pickAiAsk(step: string, round: number): string {
  const pool = AI_ASK_BY_STEP[step] || [];
  return pool[round % Math.max(pool.length, 1)] || '请继续补充更多细节，细节越丰富 AI 生成的 PRD 越精准～';
}

export function generatePrdContent(form: {
  positioning: string;
  targetUsers: string;
  painPoints: string;
  coreFeatures: string;
  title: string;
}): string {
  const { title, positioning, targetUsers, painPoints, coreFeatures } = form;
  return `# ${title || '产品需求文档（PRD 初稿）'}

> 版本：V0.1 AI 生成稿  ｜  生成时间：${new Date().toLocaleString('zh-CN')}  ｜  来源：NHY AI 创智平台

---

## 一、背景与目标

### 1.1 业务背景
${
  positioning
    ? positioning
    : '（请补充该想法产生的业务背景，包括公司战略方向、市场机会、内部资源等）'
}

基于一线业务调研与内部复盘，我们观察到当前产品流程中存在显著的效率与体验缺口，因此提出本提案。

### 1.2 产品目标（北极星）
- **短期 (3 个月)**：完成 MVP 上线，并在 2 个种子项目中完成验证
- **中期 (6 个月)**：在研究院 3 个以上部门推广使用，覆盖 ≥ 80% 目标用户
- **长期 (12 个月)**：形成可复用的标准化能力，支持对外产品化输出

---

## 二、目标用户画像

${
  targetUsers
    ? targetUsers
        .split(/\n|；|;|\d\)/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((u, i) => `### ${i + 1}. ${u.slice(0, 18) || '用户'}\n- 描述：${u}`)
        .join('\n\n')
    : '> （建议提供至少 2-3 个核心用户画像，包含角色、诉求、约束）'
}

---

## 三、痛点与机会

### 3.1 痛点分析
${
  painPoints
    ? painPoints
        .split(/\n|；|;|\d\)/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((p, i) => `- **痛点 ${i + 1}**：${p}`)
        .join('\n')
    : '> （用"用户在什么场景下，因为什么原因，遇到了什么问题，导致什么后果"的五要素法拆解）'
}

### 3.2 竞品对标（当前方案对比）

| 方案 | 优点 | 缺点 | 我们的差异化 |
| --- | --- | --- | --- |
| 人肉 Excel / 线下流程 | 灵活、零开发 | 易遗漏、口径不一、汇总耗时 | AI 结构化 + 自动提醒 + 全局看板 |
| 市面上通用 PLM 工具 | 功能全面 | 重定制、难落地、不贴合 NHY 流程 | 深度贴合院内硬件 EVT/DVT 门径 |
| 自研旧系统 | 定制深 | 维护成本高、无 AI 能力 | 新一代 AI 原生架构 |

---

## 四、MVP 功能列表（V1.0）

### 4.1 功能总览
${
  coreFeatures
    ? coreFeatures
        .split(/\n|；|;|\d\)/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((f, i) => {
          const priorities = ['P0', 'P0', 'P1', 'P1', 'P2'];
          return `- **${priorities[i] || 'P2'} · 功能 ${i + 1}**：${f}`;
        })
        .join('\n')
    : '> （请按 P0/P1/P2 标注优先级，P0 为 MVP 必做）'
}

### 4.2 不在本期范围（Out of Scope）
- 复杂的硬件 EVT/DVT 阶段强卡点流转
- 对外宣传材料的复杂审批流（V1 仅限内部查阅）
- 移动端原生 App（V1 支持企微 H5 查看即可）

---

## 五、核心指标

| 指标类型 | 指标名称 | 当前基线 | MVP 目标 |
| --- | --- | --- | --- |
| 业务 | 创意孵化成功率 | - | ≥ 30% |
| 效能 | PRD 撰写耗时 | 4h/份 | ≤ 30min/份（AI 初稿 + 人工润色） |
| 体验 | 用户满意度 (NPS) | - | ≥ 40 |
| 技术 | AI 生成内容采纳率 | - | ≥ 60% |

---

## 六、里程碑与资源

| 阶段 | 时间 | 交付物 | 负责人 |
| --- | --- | --- | --- |
| M1 立项评审 | W0 | 本 PRD v1.0 + 立项评审通过 | PM |
| M2 原型评审 | W1-W2 | Figma 高保真 + 交互走查 | 产品 + 设计 |
| M3 MVP 开发 | W3-W5 | 核心功能联调完毕 | 前后端 + 算法 |
| M4 种子验证 | W6-W8 | 2 个种子部门跑通，收集改造点 | PMO |
| M5 全量推广 | W9+ | 全院推广 + 数据看板上线 | 运营 |

---

> 提示：点击右侧每个章节标题旁的"局部重绘"按钮，或在 AI 对话框里直接说指令（如：把第三部分痛点写得更具体，加 2 个真实案例），即可让 AI 针对性优化。
`;
}

export function generateChatReply(userMessage: string, currentPrd: string): {
  reply: string;
  updatedPrd: string;
} {
  const msg = userMessage.trim();

  const replaceSection = (
    prd: string,
    heading: string,
    newBody: string
  ): string => {
    const re = new RegExp(`(## ${heading}[\\s\\S]*?)(?=\\n## |$)`);
    const match = prd.match(re);
    if (!match) return prd;
    const prefix = match[1].split('\n').slice(0, 1).join('\n');
    return prd.replace(re, `${prefix}\n\n${newBody}\n\n`);
  };

  let reply = '好的，已为你调整 PRD 内容，请查看左侧预览 ✅';
  let updated = currentPrd;

  if (/竞品|竞争|对比/.test(msg)) {
    updated = replaceSection(
      currentPrd,
      '三、痛点与机会',
      `### 3.1 痛点分析\n- 现有竞品在**长尾小语种方言**支持上普遍较弱，是我们的切入机会\n- 端侧推理延迟普遍在 1.2s 以上，用户体感明显，我们目标 < 300ms\n- 数据隐私合规：竞品上传原图到云端已被 2 家头部客户拒绝，端侧匿名化为刚需\n\n### 3.2 竞品对标\n\n| 方案 | 优点 | 缺点 | 我们的差异化 |\n| --- | --- | --- | --- |\n| 友商 A（头部） | 生态全、渠道深 | 硬件授权贵 + 小语种弱 | 端侧 NPU + 方言自学习 |\n| 友商 B（海外） | 算法精准 | 本地化差 + 不支持定制 | 本地私有化部署 + 可定制模型 |\n| 人肉流程 | 零成本 | 漏报率高 + 无追溯 | AI + 匿名化 + 留痕审计 |\n`
    );
    reply = '已重写「竞品对标」部分，补充了 2 家具体友商对比和我们的差异化切入口。';
  } else if (/痛点|场景|案例/.test(msg)) {
    updated = replaceSection(
      currentPrd,
      '三、痛点与机会',
      `### 3.1 痛点分析（补充真实案例）\n- **案例 1 · 凌晨京港澳高速**：王师傅连续驾驶 4.5h，打哈欠 3 次，系统 1.2s 后识别并声光提醒 + 联动座椅震动，避免事故。事后复盘：现有方案要 5s+，错过黄金窗口。\n- **案例 2 · 车队周会**：车队长要求导出上周疲劳事件 Top10，IT 花了 4h 导出 Excel 手动筛选 → 目标：一键看板 30s 出。\n- **案例 3 · 隐私投诉**：司机抗议"被录像"，工会介入 → 改为面部特征哈希匿名化，原图不离开端侧设备，消弭风险。\n\n### 3.2 竞品对标（略）\n`
    );
    reply = '已在「痛点分析」中补充了 3 个真实业务场景案例，现在更有说服力了。';
  } else if (/指标|目标|北极星/.test(msg)) {
    updated = replaceSection(
      currentPrd,
      '五、核心指标',
      `### 5.1 指标拆解\n\n| 指标类型 | 指标名称 | 当前基线 | MVP 目标 | 采集方式 |\n| --- | --- | --- | --- | --- |\n| 业务 | 创意孵化成功率 | 18% | ≥ 30% | 立项评审数据 |\n| 效能 | PRD 撰写耗时 | 240 min/份 | ≤ 30 min/份 | 埋点 + 问卷 |\n| 效能 | PMO 周报汇总耗时 | 8h/周 | ≤ 1h/周 | PMO 填报 |\n| 体验 | 用户满意度 NPS | - | ≥ 40 | 季度问卷 |\n| 技术 | AI 内容采纳率 | - | ≥ 60% | 编辑日志 |\n| 技术 | 端侧识别延迟 | 1200ms | ≤ 300ms | 性能压测 |\n\n### 5.2 数据埋点清单\n1. 创意 Wizard 每步跳出率\n2. PRD 保存草稿 / 提交评审转化率\n3. AI 重绘指令类型分布\n`
    );
    reply = '「核心指标」章节已升级：新增采集方式列，和数据埋点清单，方便后续立项评审时被挑战。';
  } else if (/功能|MVP|范围/.test(msg)) {
    updated = replaceSection(
      currentPrd,
      '四、MVP 功能列表（V1.0）',
      `### 4.1 功能总览（按优先级排序）\n- **P0 · 功能 1**：创意 Wizard 分步表单 + AI 追问 + 双栏 PRD 预览\n- **P0 · 功能 2**：AI 对话框局部重绘，支持竞品/痛点/指标等指定章节重写\n- **P0 · 功能 3**：创意机会池（列表 + 认领 + 状态流转）\n- **P1 · 功能 4**：创意详情只读评审页\n- **P1 · 功能 5**：草稿自动保存 + 上次编辑恢复\n- **P2 · 功能 6**：飞书通知推送（认领/评审结果）\n\n### 4.2 不在本期范围（Out of Scope）\n- 硬件 EVT/DVT 强卡点流转门禁（V1 只做状态标色提醒）\n- 对外宣传材料多级审批流（V1 限内部查阅）\n- 原生 App（V1 企微 H5 适配即可）\n\n### 4.3 功能交互验收标准（UAT）\n1. 提交创意后 10s 内生成 PRD 初稿（含骨架与占位符）\n2. AI 追问平均 3 轮内可获取足够信息\n3. 局部重绘响应 ≤ 5s，内容直接替换对章节而非覆盖全稿\n`
    );
    reply = '已细化「MVP 功能」章节：明确 P0/P1/P2、新增 UAT 验收标准，研发同学看到这个就知道怎么排期了。';
  } else if (/里程碑|排期|资源/.test(msg)) {
    updated = replaceSection(
      currentPrd,
      '六、里程碑与资源',
      `### 6.1 关键里程碑（甘特摘要）\n\n| 阶段 | 时间 | 关键交付物 | 负责人 | 风险等级 |\n| --- | --- | --- | --- | --- |\n| M1 立项评审 | W0 (本周) | PRD v1.0 + 评审通过 | PM (张伟) | 🟢 |\n| M2 原型走查 | W1-W2 | Figma 高保真 + 交互稿 | 设计 (李敏) | 🟢 |\n| M3 前后端联调 | W3-W5 | P0 功能全部联调通过 | Tech Lead (刘工) | 🟡 算法资源紧张 |\n| M4 种子验证 | W6-W8 | 2 个部门灰度，≥ 10 人周活 | PMO | 🟡 种子配合度 |\n| M5 全院推广 | W9 | 培训材料 + 数据看板 | 运营 | 🟢 |\n\n### 6.2 资源需求\n- **研发**：前端 × 2、后端 × 2、算法 × 1、测试 × 1（共 6 人，1/3 人力投入）\n- **预算**：GPU 推理服务器 / 私有化大模型授权（若有） / 设计外包（若需）\n- **干系人**：研究院领导（决策）、硬件/算法/软件三部负责人（试点）\n\n### 6.3 风险与缓解\n1. **算法资源不足** → 缓解：先用通用大模型，算法只做提示词工程优化，M4 再介入定制\n2. **种子用户不配合** → 缓解：和部门负责人 KPI 绑定，每周一同步进度\n3. **数据隐私质疑** → 缓解：落地前先通过法务与安全评审，端侧匿名化为默认策略\n`
    );
    reply = '「里程碑」章节已大升级：新增风险等级、资源需求、风险与缓解策略，拿去立项评审直接可用。';
  } else if (/背景|目标|北极星/.test(msg)) {
    updated = replaceSection(
      currentPrd,
      '一、背景与目标',
      `### 1.1 业务背景（强化）\n当前研究院正处于产品化转型关键期，过去 12 个月累计收到 ≥ 40 个来自一线的产品想法，但：\n1. 仅 18% 能写出及格 PRD（由 PM 二次返工）→ 创意孵化慢\n2. 产品线阶段信息散落在飞书/Excel，PMO 周报汇总 8h+/周 → 管理成本高\n3. 对外汇报/宣传材料反复人肉整理，口径不一致 → 资产复用难\n\n因此本项目以「AI 辅助 PRD + 门径标准化 + 资产一键产出」为抓手，配合全院战略落地。\n\n### 1.2 北极星目标分解\n- **短期 (1 个季度)**：≥ 30 个创意上线系统，孵化成功率从 18% → ≥ 30%\n- **中期 (半年)**：3 个重点产品线全流程接入门径，PMO 周报汇总 < 1h/周\n- **长期 (全年)**：沉淀 ≥ 50 份标准产品资产，AI 一键生成 ≥ 3 类场景化汇报材料\n\n### 1.3 成功标志（Go/No-Go）\n✅ Go：M4 种子验证期 NPS ≥ 30 + 孵化率 ≥ 25%\n❌ No-Go：连续 2 个月日活 < 5 人 或 严重隐私合规事故 1 次以上\n`
    );
    reply = '已重写「背景与目标」：补充了数据化背景、Go/No-Go 决策点，高层汇报直接用。';
  } else if (/用户|画像|persona/.test(msg)) {
    updated = replaceSection(
      currentPrd,
      '二、目标用户画像',
      `### 2.1 核心用户 Persona（3 个）\n\n**Persona 1：张工程师 · 一线算法**\n- 32 岁，硕士，算法一部工作 5 年\n- 场景：日常跑实验有好想法，但不会写 PRD，每次要找 PM 约 2h 对齐\n- 诉求：降低表达门槛，AI 帮我把技术语言翻译成产品语言\n- 阻力：懒，超过 3 步就不想填 → Wizard 必须极简、有追问引导\n\n**Persona 2：李 PM · 产品线负责人**\n- 35 岁，PM 经验 7 年，同时推进 3 条产品线\n- 场景：每周催各部门交文档、催进度、汇总周报给领导\n- 诉求：门径标准化 + AI 自动出周报，把我从琐事里解放\n- 阻力：怕 AI 乱写导致评审翻车 → 必须有 100% 人工编辑 + 留痕\n\n**Persona 3：王院长 · 研究院决策层**\n- 45 岁，管理 300+ 人，关注战略资源分配\n- 场景：月度经营会需要看产品大盘与资源倾斜合理性\n- 诉求：一眼看清全院创意分布 / 孵化漏斗 / 效能瓶颈\n- 阻力：没时间细看明细 → 可视化看板 + 红黄绿灯预警必须一眼看懂\n\n### 2.2 非目标用户\n- 纯硬件产线工人（无本系统使用场景）\n- 外部客户合作伙伴（V1 内网部署，不对外开放）\n`
    );
    reply = '已重写「用户画像」：新增 3 个 Persona + 非目标用户边界，团队讨论范围不容易跑偏。';
  } else {
    const snippet = msg.length > 40 ? msg.slice(0, 40) + '…' : msg;
    updated =
      currentPrd +
      `\n\n---\n\n> 📝 人工补充（来自对话：「${snippet}」）\n> ${msg}\n`;
    reply = `我没识别到具体的章节关键词，所以把你的指令原文追加到了 PRD 末尾做"人工备注"。你可以明确说"重写第 X 章"或"在 XX 部分补充…"来让我精准替换。`;
  }

  return { reply, updatedPrd: updated };
}

// ========== Wizard 一键填充示例数据（3 套不同行业方案轮换，演示不枯燥） ==========
export interface WizardMockExample {
  label: string;
  positioning: string;
  targetUsers: string;
  painPoints: string;
  coreFeatures: string;
}

const MOCK_EXAMPLE_1: WizardMockExample = {
  label: '车载疲劳监测 AI 摄像头',
  positioning:
    '面向商用车车队管理的 DMS 驾驶员疲劳监测摄像头模组：通过 940nm 红外 + 端侧 NPU，实现闭眼/打哈欠/接打电话/吸烟 4 类行为识别，端到端响应 ≤ 300ms，识别准确率 ≥ 98%，目标单台售价 ≤ 180 元，2027 年院内部署 5000 台后降本 800 万。',
  targetUsers:
    '1) 车队安全员：每月查 200 车人工巡检记录，肉眼筛查疲劳事件漏报率 60%+；2) 商用车车机硬件团队：现有 DMS 供应商方案贵且不可定制，希望绑定自家 T-BOX；3) 保险公司 UBI 团队：需要真实驾驶行为数据做差异化保费定价；4) 一线司机本人：被"被录像"焦虑，需要端侧匿名化不存原图。',
  painPoints:
    '1) 现有商用车 DMS 方案 500+ 元/台，百万车队部署成本太高；2) 主流方案云端识别延迟 1.2s+，事故高发凌晨场景错过黄金提醒窗口；3) 司机对"全程被录像"抵触强烈，多个试点项目因工会介入终止；4) 夜间/逆光/戴墨镜场景下识别准确率骤降到 60% 以下，无法商用；5) 数据合规风险：个人面部特征上传云端违反最新《汽车数据安全管理若干规定》。',
  coreFeatures:
    '1) P0 端侧 940nm 红外 NPU 推理：≤ 300ms 出结果，不上传原图；2) P0 4 类危险行为识别 + 分级声光/座椅震动提醒；3) P1 车队看板：Top10 高风险司机、线路、时段热力图；4) P1 数据合规：特征哈希匿名化 + 本地加密存储 7 天自动清理；5) P2 UBI 保险数据接口：脱敏后事件摘要推送保险公司。',
};

const MOCK_EXAMPLE_2: WizardMockExample = {
  label: '智能硬件 BOM 降本 AI 助手',
  positioning:
    '面向研究院硬件 PM/采购的 AI BOM 降本助手：接入过去 5 年 120+ 硬件项目的历史 BOM + 2000 万条元器件采购数据，自动识别 pin-to-pin 国产替代、跨项目复用机会、批量议价空间，目标单项目平均 BOM 成本下降 ≥ 8%，单个 PM 降本分析耗时从 3 天缩到 30 分钟。',
  targetUsers:
    '1) 硬件项目经理（PM）：立项前要给出成本预估，立项后每轮 BOM 迭代要写 20+ 页降本分析；2) 元器件采购工程师：2000+ 物料库分散在 Excel，国产替代要翻 6 份资料；3) 产品线财务 BP：每月 5 号前要汇总 10+ 项目成本偏差报表；4) 新入职硬件工程师：老员工经验在脑子里，选型踩同样坑。',
  painPoints:
    '1) 同型号阻容跨项目复用率不足 20%，大量重复选型和认证导致 NRE 成本虚高；2) EVT→DVT 阶段频繁换料没有知识沉淀，新项目 100% 踩同样的供应商交期坑；3) 国产替代库分散在不同工程师个人 Excel，新人搜不到只能用进口料，成本比同行高 15%；4) 降本分析报告全靠 PM 手工拉 3 份 VLOOKUP，一份报告 8h+；5) 采购议价时没有全院历史采购量做筹码，批量价拿不到。',
  coreFeatures:
    '1) P0 BOM 一键扫描：拖入 Excel BOM，5s 输出 Top10 降本候选清单按金额排序；2) P0 国产替代引擎：按封装/参数/价格/库存/ RoHS 认证匹配 pin-to-pin 替代；3) P1 跨项目复用看板：按元器件大类展示全院复用率，自动推送"和 XX 项目共用"建议；4) P1 国产替代知识图谱：按品类/等级/踩坑经验管理，新人 10 分钟上手；5) P2 议价数据驾驶舱：给采购展示该物料全院历史采购总量、最高价/最低价趋势。',
};

const MOCK_EXAMPLE_3: WizardMockExample = {
  label: '飞书 AI 周报自动生成器',
  positioning:
    '嵌入飞书多维表格的 AI 周报生成插件：抓取本周飞书任务完成率 + GitLab 提交记录 + 飞书文档评审记录 + 会议纪要关键词，按部门/个人/项目 3 个维度自动生成周报初稿，人工 5 分钟润色即可提交，目标全院周报撰写耗时从 4h/人·周降到 30min/人·周。',
  targetUsers:
    '1) 一线研发工程师：每周日晚花 2 小时回忆本周工作，写出来的周报 PM 还嫌"看不懂"；2) 项目经理 PM：每周花 6h 汇总 10 人周报 + 粘贴到部门看板，纯体力劳动；3) 部门总监：每月经营会要数据，但周报内容不结构化，搜不到趋势；4) HRBP：年底绩效盘点要手动翻 52 周周报 Excel 汇总贡献点。',
  painPoints:
    '1) 研发同学"只会干活不会写"，周报 3 行字 PM 看不到重点，写详细了又要 2h+；2) PM 每周汇总团队周报要复制粘贴 10 份飞书文档，格式不统一；3) 数据不结构化：总监搜"过去半年某模块延期"要翻 24 周周报全文；4) 周报内容重复：上周写的本周还要重新编；5) 年底绩效盘点没有客观依据，变成"写得好 = 干得好"。',
  coreFeatures:
    '1) P0 多源数据自动抓取：飞书任务 + 飞书文档评审 + 会议纪要 + GitLab 提交 4 个维度聚合；2) P0 周报初稿模板化：按"本周完成/下周计划/风险卡点/协作需求"4 段式生成；3) P1 项目维度视图：同一任务跨团队自动合并成项目周报；4) P1 风险预警：识别连续 2 周未完成任务 + 超期未评审文档，推送给 PM；5) P2 绩效盘点助手：年底一键导出某员工全年 Top10 贡献，附原始数据链接。',
};

export const MOCK_FILL_EXAMPLES: WizardMockExample[] = [
  MOCK_EXAMPLE_1,
  MOCK_EXAMPLE_2,
  MOCK_EXAMPLE_3,
];

// 根据 step key 取示例里的对应字段，加 3 套轮换防每次都一样
export function pickMockByStep(
  _stepKey: 'positioning' | 'targetUsers' | 'painPoints' | 'coreFeatures',
  seed: number = 0
): WizardMockExample {
  const idx = Math.abs(seed) % MOCK_FILL_EXAMPLES.length;
  return MOCK_FILL_EXAMPLES[idx];
}

// ========== 四步填完后 AI 综合分析整份表单（优势 + 追问 + 下一步动作） ==========
export function generateOverallFeedback(form: {
  positioning: string;
  targetUsers: string;
  painPoints: string;
  coreFeatures: string;
}): string {
  const { positioning, targetUsers, painPoints, coreFeatures } = form;
  const strengths: string[] = [];
  const asks: string[] = [];

  // 优势识别
  if (positioning.length >= 30) {
    strengths.push('✅ 产品定位写得很清晰：包含了场景、用户、核心能力、目标指标（≥ 8% 降本这类），立项评审第一关基本可以过');
  } else {
    asks.push('🔎 定位里能否补充一个"量化目标"？例如：3 个月覆盖多少用户、降本/提效百分之几？');
  }
  if (targetUsers.includes('1)') || targetUsers.split(/\n|；/).filter(Boolean).length >= 2) {
    strengths.push('✅ 用户画像分了 ≥ 2 类角色，方便后续讨论"谁买单谁使用谁受益"的三角关系');
  } else {
    asks.push('🔎 目标用户能否拆成 2-3 个不同角色？区分一下"使用产品的人 / 给产品买单的人 / 受产品结果影响的人"');
  }
  if (painPoints.length >= 60 && (painPoints.includes('1)') || /\d/.test(painPoints))) {
    strengths.push('✅ 痛点分了 3 条以上，每条对应了"场景→原因→后果"五要素，不是空泛喊"体验差"');
  } else {
    asks.push('🔎 痛点能否每个都按"用户在什么场景下，因为什么原因，遇到什么问题，导致什么后果"写？越具体越容易被领导拍板');
  }
  if (coreFeatures.includes('P0') || coreFeatures.split(/\n|；/).filter(Boolean).length >= 3) {
    strengths.push('✅ MVP 功能 ≥ 3 条且有优先级标注（P0/P1），研发拿到就能直接拆任务');
  } else {
    asks.push('🔎 功能列表能否加 P0/P1/P2 标注？P0=MVP 上线必须做，P1=1 个月内，P2=以后再说。别超过 5 个 P0');
  }
  if (positioning.includes('元') || positioning.includes('%') || positioning.includes('ms')) {
    strengths.push('✅ 定位里有量化数字（元 / % / ms），这个是评审会最加分的，继续保持');
  }
  if (painPoints.includes('合规') || painPoints.includes('工会') || painPoints.includes('投诉') || painPoints.includes('法律')) {
    asks.push('💡 你提到了合规/风险类痛点，能否再加一条"应对策略"？比如匿名化、本地加密、审计留痕，领导很看重这个');
  }
  if (!coreFeatures.includes('看板') && !coreFeatures.includes('报表') && !coreFeatures.includes('数据')) {
    asks.push('💡 建议补一个"数据看板/报表"类 P1 功能，产品上线后没有数据闭环，下一版迭代就拍脑袋了');
  }
  if (targetUsers.includes('PM') || targetUsers.includes('经理') || targetUsers.includes('总监')) {
    asks.push('💡 你把"管理层"作为用户，能否明确一个他们最关心的指标？比如"一个看板一眼看清 Top10 风险项目"，这种是最容易拿到战略资源的');
  }

  // 兜底
  if (strengths.length === 0) strengths.push('✅ 表单四步基本完成，信息骨架已经有了');
  while (asks.length < 3) {
    asks.push('💡 建议补一个最关键的"北极星指标"：MVP 上线后 3 个月，你最希望哪个数字变好？');
    if (asks.length >= 3) break;
    asks.push('💡 能否简单说一下：目前院内有没有类似做法/竞品？我们和他们的本质差异是什么？');
    if (asks.length >= 3) break;
    asks.push('💡 能否加一个 Go/No-Go 标准：MVP 上线后，达到什么条件就继续投入，达不到就止损？');
    if (asks.length >= 3) break;
  }

  const finalAsks = asks.slice(0, 4);

  return [
    '🎯 好消息：我把你 4 步表单一起通读了一遍，整体非常扎实，分享我的判断：',
    '',
    '### 一、做得特别好的地方（立项评审加分项）',
    ...strengths,
    '',
    '### 二、建议再补充/追问（评审大概率会被挑战的点）',
    ...finalAsks.map((a, i) => `${i + 1}. ${a}`),
    '',
    '### 三、下一步建议',
    `1. 我已经把以上"追问点"同步放进了右侧快捷 chip，你可以直接点它们一键补充～`,
    `2. 如果内容差不多了，就点左下方的「✨ 生成 PRD 初稿」，我会帮你把 4 步内容自动组装成 6 大章节的 Markdown PRD（竞品对标/核心指标/里程碑甘特我会按最佳实践帮你自动补全骨架）`,
    `3. 到 PRD 预览页之后，还可以继续按章节局部重绘、或复制 Markdown 粘贴到飞书文档给领导看！`,
  ].join('\n');
}
