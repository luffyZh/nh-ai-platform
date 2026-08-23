export type ProductPhase = '概念期' | '原型期' | 'EVT' | 'DVT' | 'MP';

export type HealthStatus = '正常' | '风险' | '延期';

export type MemberRole = 'PM' | 'PMO' | 'QA' | '硬件' | '算法' | '软件' | '测试' | '结构' | '工业设计';

export type FeedTag = '进展' | '风险' | '问题' | '里程碑';

export type AssetCategory = '文档' | '图片' | '视频' | '手册' | '营销素材';

export interface TeamMember {
  id: string;
  name: string;
  role: MemberRole;
  dept: string;
  avatarColor: string;
  phone?: string;
  email?: string;
}

export interface PhaseDocRequirement {
  name: string;
  required: boolean;
  uploaded: boolean;
  uploader?: string;
  uploadTime?: string;
}

export interface PhaseDetail {
  phase: ProductPhase;
  startDate: string;
  endDate: string;
  target: string;
  entryConditions: string[];
  exitConditions: string[];
  docs: PhaseDocRequirement[];
  reviewStatus: '未开始' | '进行中' | '已通过' | '未通过';
}

export interface FeedItem {
  id: string;
  author: string;
  role: MemberRole;
  avatarColor: string;
  time: string;
  tag: FeedTag;
  content: string;
}

export interface WeeklyReport {
  id: string;
  week: string;
  generateTime: string;
  progress: string[];
  risks: string[];
  nextPlan: string[];
}

export interface AssetItem {
  id: string;
  name: string;
  category: AssetCategory;
  subCategory?: string;
  thumbnail?: string;
  uploader: string;
  uploadTime: string;
  size?: string;
  fileType?: string;
  tags?: string[];
}

export interface AISceneTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
}

export interface Product {
  id: string;
  name: string;
  shortName?: string;
  oneLiner: string;
  pm: string;
  pmo: string;
  qa: string;
  depts: string[];
  phase: ProductPhase;
  health: HealthStatus;
  date: string;
  coverImage?: string;
  keyMetrics: {
    phaseProgress: number;
    docCompletionRate: number;
    riskCount: number;
    lastReportTime: string;
  };
  team: TeamMember[];
  phases: PhaseDetail[];
  feeds: FeedItem[];
  reports: WeeklyReport[];
  assets: AssetItem[];
  aiScenes: AISceneTemplate[];
}

const GUARDX_IMG_BASE = '/src/assets/products/guardx';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'P-2026004',
    name: '基于 AIoT 的感算一体化电子哨兵',
    shortName: 'GuardX 电子哨兵',
    oneLiner:
      'AIoT 分布式无人值守侦察/警戒装备：零布线快速部署、低功耗长航时、端侧事件驱动智能识别，支撑告警→核查→处置→复盘闭环。',
    pm: '周德友',
    pmo: '杨婕',
    qa: '潘超',
    depts: ['硬件二部', '算法一部', '软件中心', '测试中心'],
    phase: '原型期',
    health: '正常',
    date: '2026-06-15',
    coverImage: `${GUARDX_IMG_BASE}/GuardX-01.jpg`,
    keyMetrics: {
      phaseProgress: 45,
      docCompletionRate: 60,
      riskCount: 2,
      lastReportTime: '2026-08-22 16:00',
    },
    team: [
      { id: 'm1', name: '陈建国', role: 'PM', dept: '产品部', avatarColor: 'blue', phone: '138-0000-0001', email: 'chenjg@nhy.com' },
      { id: 'm2', name: '刘志强', role: 'PMO', dept: '项目管理办公室', avatarColor: 'indigo', phone: '138-0000-0002', email: 'liuzq@nhy.com' },
      { id: 'm3', name: '赵晓峰', role: 'QA', dept: '质量部', avatarColor: 'emerald', phone: '138-0000-0003', email: 'zhaoxf@nhy.com' },
      { id: 'm4', name: '孙浩然', role: '硬件', dept: '硬件二部', avatarColor: 'amber', phone: '138-0000-0004' },
      { id: 'm5', name: '周文博', role: '硬件', dept: '硬件二部', avatarColor: 'orange', phone: '138-0000-0005' },
      { id: 'm6', name: '吴思远', role: '算法', dept: '算法一部', avatarColor: 'violet', phone: '138-0000-0006' },
      { id: 'm7', name: '郑海涛', role: '算法', dept: '算法一部', avatarColor: 'purple', phone: '138-0000-0007' },
      { id: 'm8', name: '黄俊杰', role: '软件', dept: '软件中心', avatarColor: 'cyan', phone: '138-0000-0008' },
      { id: 'm9', name: '林婉清', role: '软件', dept: '软件中心', avatarColor: 'sky', phone: '138-0000-0009' },
      { id: 'm10', name: '徐明辉', role: '测试', dept: '测试中心', avatarColor: 'rose', phone: '138-0000-0010' },
      { id: 'm11', name: '马超群', role: '结构', dept: '工业设计部', avatarColor: 'fuchsia', phone: '138-0000-0011' },
      { id: 'm12', name: '郭雅婷', role: '工业设计', dept: '工业设计部', avatarColor: 'pink', phone: '138-0000-0012' },
    ],
    phases: [
      {
        phase: '概念期',
        startDate: '2026-06-15',
        endDate: '2026-07-15',
        target: '完成产品概念验证，明确两条平台路线（AOV/HVS）及指标口径',
        entryConditions: ['创意提案通过评审', '产品立项审批通过', '核心团队组建完成'],
        exitConditions: ['产品定义文档 V1.0 发布', '技术可行性评估通过', '平台路线决策完成'],
        docs: [
          { name: '产品定义文档 V1.0', required: true, uploaded: true, uploader: '陈建国', uploadTime: '2026-07-01' },
          { name: '技术可行性评估报告', required: true, uploaded: true, uploader: '孙浩然', uploadTime: '2026-07-08' },
          { name: '竞品分析报告', required: false, uploaded: true, uploader: '陈建国', uploadTime: '2026-07-10' },
          { name: '商业模式画布', required: false, uploaded: true, uploader: '陈建国', uploadTime: '2026-07-12' },
        ],
        reviewStatus: '已通过',
      },
      {
        phase: '原型期',
        startDate: '2026-07-16',
        endDate: '2026-09-30',
        target: '完成 2.0 AOV 与 3.0-S/HVS 双路线原型机开发，验证核心指标达成',
        entryConditions: ['概念期评审通过', '原型开发资源到位', '关键芯片/模组选型确认'],
        exitConditions: [
          'AOV 原型机点亮：续航≥15天、探测距离≥50m、夜视≥3Lux',
          'HVS 原型机点亮：DVS 功耗≤10mW、续航≥90天、探测距离≥80m',
          'Web 态势大屏基线版本可用',
        ],
        docs: [
          { name: '硬件总体设计方案', required: true, uploaded: true, uploader: '孙浩然', uploadTime: '2026-07-25' },
          { name: '算法需求规格说明书', required: true, uploaded: true, uploader: '吴思远', uploadTime: '2026-08-01' },
          { name: '软件架构设计文档', required: true, uploaded: true, uploader: '黄俊杰', uploadTime: '2026-08-05' },
          { name: 'BOM 表（原型版）', required: true, uploaded: false },
          { name: '结构设计图纸 V1', required: false, uploaded: true, uploader: '马超群', uploadTime: '2026-08-10' },
          { name: '工业设计效果图', required: false, uploaded: true, uploader: '郭雅婷', uploadTime: '2026-08-12' },
          { name: '测试计划（原型阶段）', required: true, uploaded: false },
        ],
        reviewStatus: '进行中',
      },
      {
        phase: 'EVT',
        startDate: '2026-10-01',
        endDate: '2026-12-15',
        target: '完成实验室验证样机，修复设计缺陷，输出无锡交付 10 套',
        entryConditions: ['原型期核心指标达成', 'BOM 锁定', '测试计划评审通过'],
        exitConditions: ['EVT 样机 10 套交付无锡', '环境可靠性测试通过', '告警准确率 ≥ 90%'],
        docs: [
          { name: 'BOM 表（量产准备版）', required: true, uploaded: false },
          { name: '测试报告（EVT）', required: true, uploaded: false },
          { name: '可靠性测试报告', required: true, uploaded: false },
          { name: 'EMC 测试报告', required: false, uploaded: false },
          { name: '用户操作手册 V1', required: false, uploaded: false },
        ],
        reviewStatus: '未开始',
      },
      {
        phase: 'DVT',
        startDate: '2026-12-16',
        endDate: '2027-03-31',
        target: '完成设计验证，准备导入量产，完成公安三所试点验收',
        entryConditions: ['EVT 评审通过', '量产供应商选定', '试产计划确定'],
        exitConditions: ['DVT 全项目测试通过', '公安三所试点验收通过', '生产工艺文件发布'],
        docs: [
          { name: '测试报告（DVT）', required: true, uploaded: false },
          { name: '生产工艺文件', required: true, uploaded: false },
          { name: '验收测试方案', required: true, uploaded: false },
          { name: '量产 BOM 表', required: true, uploaded: false },
          { name: '产品规格书（正式版）', required: false, uploaded: false },
        ],
        reviewStatus: '未开始',
      },
      {
        phase: 'MP',
        startDate: '2027-04-01',
        endDate: '2027-12-31',
        target: '进入量产阶段，实现小批量标品化与场景套件化',
        entryConditions: ['DVT 评审通过', '质量标准达成一致', '售后服务体系建立'],
        exitConditions: ['首批 100 套量产交付', '标品外壳与 SOP 固化', '年产能规划落地'],
        docs: [
          { name: '量产测试报告', required: true, uploaded: false },
          { name: '售后运维手册', required: true, uploaded: false },
          { name: 'FAQs 知识库 V1', required: false, uploaded: false },
        ],
        reviewStatus: '未开始',
      },
    ],
    feeds: [
      { id: 'f1', author: '孙浩然', role: '硬件', avatarColor: 'amber', time: '2026-08-22 18:30', tag: '进展', content: 'AOV 2.0 主板 PCB Layout 完成 V2，已送样打板，预计 8-28 回板贴片。' },
      { id: 'f2', author: '吴思远', role: '算法', avatarColor: 'violet', time: '2026-08-22 15:20', tag: '进展', content: '人/车检测模型在 RV1106 上完成部署，端侧推理 25fps，当前虚警率 8%，下周引入难例集进一步优化。' },
      { id: 'f3', author: '黄俊杰', role: '软件', avatarColor: 'cyan', time: '2026-08-22 11:05', tag: '里程碑', content: 'Web 态势大屏 V0.3 发布：新增设备批量导入、告警批量确认、历史告警导出 Excel。' },
      { id: 'f4', author: '陈建国', role: 'PM', avatarColor: 'blue', time: '2026-08-21 20:15', tag: '风险', content: '清微 5326 芯片样品排期延后 1 周（原 8-20 改为 8-27），影响 2.5 版本启动；已同步刘志强，预案优先保 2.0 交付。' },
      { id: 'f5', author: '马超群', role: '结构', avatarColor: 'fuchsia', time: '2026-08-21 14:00', tag: '进展', content: '伪装外壳（石头形态）3D 打印完成初样，郭雅婷确认外观效果，下周做野外伪装效果测试。' },
      { id: 'f6', author: '徐明辉', role: '测试', avatarColor: 'rose', time: '2026-08-20 16:40', tag: '问题', content: '实验室高温 60°C 测试中 DVS 模组偶发丢帧，问题已同步锐思科技 FA 团队，待分析。' },
      { id: 'f7', author: '林婉清', role: '软件', avatarColor: 'sky', time: '2026-08-20 10:00', tag: '进展', content: '平板端 App 原型完成：告警推送、证据查看、地图标注三大主流程可演示。' },
      { id: 'f8', author: '刘志强', role: 'PMO', avatarColor: 'indigo', time: '2026-08-19 17:30', tag: '里程碑', content: '单兵背包方案形态与指标口径评审通过：重量≤5kg、6-10 节点、几分钟部署。进入详细设计。' },
    ],
    reports: [
      {
        id: 'r1',
        week: '2026-W34',
        generateTime: '2026-08-22 16:00',
        progress: [
          'AOV 2.0 主板 V2 PCB 完成送样',
          'Web 态势大屏 V0.3 发布，告警批量处理可用',
          '人/车检测模型 RV1106 端侧部署完成',
          '伪装外壳石头形态 3D 打印初样完成',
        ],
        risks: [
          '清微 5326 芯片样品排期延后 1 周，2.5 启动受影响（已备案）',
          'DVS 模组高温 60°C 偶发丢帧，FA 中',
        ],
        nextPlan: [
          'AOV 主板 8-28 回板贴片，启动原型点亮',
          '算法虚警率压到 5% 以内',
          '伪装外壳野外伪装效果测试',
        ],
      },
      {
        id: 'r2',
        week: '2026-W33',
        generateTime: '2026-08-15 16:05',
        progress: [
          '单兵背包方案形态评审通过',
          'HVS 方案续航口径由锐思模组规格反推锁定 ≥90 天',
          '平板端 App 原型 V0.1 完成',
        ],
        risks: [],
        nextPlan: [
          '启动 PCB V2 Layout',
          '完成算法模型端侧部署',
          '输出测试计划初稿',
        ],
      },
      {
        id: 'r3',
        week: '2026-W32',
        generateTime: '2026-08-08 16:00',
        progress: [
          '产品定义文档 V1.0 正式发布',
          '两条平台路线（AOV/HVS）决策确认',
          '核心团队 12 人全员到位',
        ],
        risks: [],
        nextPlan: ['硬件总体方案设计', '启动概念期阶段评审准备'],
      },
    ],
    assets: [
      { id: 'a1', name: '产品定义文档 V1.0.md', category: '文档', subCategory: '产品文档', uploader: '陈建国', uploadTime: '2026-07-01', size: '48 KB', fileType: 'Markdown' },
      { id: 'a2', name: '技术可行性评估报告.pdf', category: '文档', subCategory: '技术文档', uploader: '孙浩然', uploadTime: '2026-07-08', size: '1.2 MB', fileType: 'PDF' },
      { id: 'a3', name: '硬件总体设计方案_V2.pdf', category: '文档', subCategory: '技术文档', uploader: '孙浩然', uploadTime: '2026-07-25', size: '3.4 MB', fileType: 'PDF' },
      { id: 'a4', name: '算法需求规格说明书.docx', category: '文档', subCategory: '技术文档', uploader: '吴思远', uploadTime: '2026-08-01', size: '820 KB', fileType: 'Word' },
      { id: 'a5', name: '软件架构设计文档.pdf', category: '文档', subCategory: '技术文档', uploader: '黄俊杰', uploadTime: '2026-08-05', size: '2.1 MB', fileType: 'PDF' },
      { id: 'a6', name: '结构设计图纸 V1.pdf', category: '文档', subCategory: '设计图', uploader: '马超群', uploadTime: '2026-08-10', size: '4.6 MB', fileType: 'PDF' },
      { id: 'a7', name: '电子哨兵-正面渲染图.jpg', category: '图片', subCategory: '渲染图', thumbnail: `${GUARDX_IMG_BASE}/GuardX-01.jpg`, uploader: '郭雅婷', uploadTime: '2026-08-12', size: '2.8 MB', fileType: 'JPG', tags: ['标品外壳'] },
      { id: 'a8', name: '电子哨兵-伪装形态-石头.jpg', category: '图片', subCategory: '渲染图', thumbnail: `${GUARDX_IMG_BASE}/GuardX-02.jpg`, uploader: '郭雅婷', uploadTime: '2026-08-12', size: '3.1 MB', fileType: 'JPG', tags: ['伪装外壳'] },
      { id: 'a9', name: '电子哨兵-部署场景-野外.jpg', category: '图片', subCategory: '场景图', thumbnail: `${GUARDX_IMG_BASE}/GuardX-03.jpg`, uploader: '郭雅婷', uploadTime: '2026-08-12', size: '2.6 MB', fileType: 'JPG', tags: ['场景展示'] },
      { id: 'a10', name: '单兵背包方案-平板端界面.jpg', category: '图片', subCategory: '界面截图', thumbnail: `${GUARDX_IMG_BASE}/GuardX-04.jpg`, uploader: '林婉清', uploadTime: '2026-08-20', size: '1.8 MB', fileType: 'JPG', tags: ['App 界面'] },
      { id: 'a11', name: 'Web 态势大屏-V0.3.jpg', category: '图片', subCategory: '界面截图', thumbnail: `${GUARDX_IMG_BASE}/GuardX-05.jpg`, uploader: '黄俊杰', uploadTime: '2026-08-22', size: '2.2 MB', fileType: 'JPG', tags: ['态势大屏'] },
      { id: 'a12', name: '产品 Logo-方形.png', category: '图片', subCategory: 'Logo', uploader: '郭雅婷', uploadTime: '2026-08-01', size: '180 KB', fileType: 'PNG', tags: ['Logo'] },
      { id: 'a13', name: '产品 Demo-3min 介绍.mp4', category: '视频', uploader: '陈建国', uploadTime: '2026-08-18', size: '58 MB', fileType: 'MP4', tags: ['领导汇报'] },
      { id: 'a14', name: '电子哨兵产品宣传手册.pdf', category: '手册', uploader: '陈建国', uploadTime: '2026-08-20', size: '8.2 MB', fileType: 'PDF', tags: ['对外宣传'] },
      { id: 'a15', name: '产品卖点海报-KV 主视觉.jpg', category: '营销素材', subCategory: '海报', uploader: '郭雅婷', uploadTime: '2026-08-15', size: '5.6 MB', fileType: 'JPG', tags: ['展会版'] },
      { id: 'a16', name: '领导汇报版-核心进展 1 页纸.pptx', category: '营销素材', subCategory: '汇报材料', uploader: '陈建国', uploadTime: '2026-08-22', size: '4.8 MB', fileType: 'PPTX', tags: ['领导版'] },
    ],
    aiScenes: [
      {
        id: 's1',
        name: '领导汇报版',
        description: '侧重产品进展、风险卡点、里程碑与下一步计划，适用于周会/月度汇报',
        icon: 'leader',
        prompt:
          '请基于电子哨兵产品知识库，生成一份面向公司高层领导的周报汇报材料，要求：1）用"产品底座→样板场景→商务推进"三层结构总结进展；2）明确列出当前阶段的风险项（如有）及缓解措施；3）给出下月里程碑与关键交付承诺。字数控制在 800 字以内，突出数据与结论。',
      },
      {
        id: 's2',
        name: '售前沟通版',
        description: '侧重客户价值、差异化亮点、典型场景与验收口径，适配客户拜访',
        icon: 'presale',
        prompt:
          '请基于电子哨兵产品知识库，生成一份售前沟通材料。目标客户为【公安三所】，场景为边境侦察单兵背包套件。要求：1）用客户语言输出 5 条核心产品亮点；2）对比传统监控/野外相机，输出差异化对比表；3）给出验收口径建议；4）结尾附上 3 个引导客户进一步合作的问题。',
      },
      {
        id: 's3',
        name: '外部宣传版',
        description: '通俗化文案，适合展会介绍 / 官网上线 / 公众号推文',
        icon: 'public',
        prompt:
          '请基于电子哨兵产品知识库，生成一份适合外部宣传的通俗介绍稿。要求：1）开篇用一个 100 字以内的故事化场景引入；2）用 3 条大白话描述"它能解决什么问题"；3）突出"不是普通监控，而是事件驱动的侦察装备"差异化定位；4）字数 600-800 字，通俗易懂。',
      },
      {
        id: 's4',
        name: '展会介绍脚本',
        description: '3 分钟展台讲解脚本，适合市场/销售在展会上对客户口述',
        icon: 'expo',
        prompt:
          '请生成一份电子哨兵的 3 分钟展台介绍脚本。结构：1）0-30s 开场破冰 + 一句话定位；2）30s-2min 两条核心故事线：A. 零布线分钟级部署（单兵背包）B. 低功耗长航时 + 事件告警闭环；3）2min-2min40s 与市场标品差异化；4）2min40s-3min Call for Action（引导深入沟通/留联系方式）。口语化，适合演讲，不要书面语。',
      },
      {
        id: 's5',
        name: '无锡项目交付汇报',
        description: '面向无锡科技客户，聚焦 2.0 AOV 10 套交付进展',
        icon: 'project',
        prompt:
          '请生成面向无锡科技客户的电子哨兵 2.0 AOV 交付进度汇报。要求：1）当前交付进展百分比 + 已完成事项清单；2）交付时间表（剩余里程碑）；3）需客户配合事项（如有）；4）风险与预案；5）下一步计划。用表格 + 要点形式，专业严谨。',
      },
      {
        id: 's6',
        name: '自定义场景',
        description: '根据客户/项目具体需求，自由输入背景让 AI 生成定制化材料',
        icon: 'custom',
        prompt: '',
      },
    ],
  },
  {
    id: 'P-2026001',
    name: 'NHY 智能座舱语音助手 V2.0',
    shortName: '座舱语音助手',
    oneLiner: '多轮对话 + 场景化语音指令的智能座舱语音交互方案，覆盖导航/音乐/车控/闲聊四大领域，支持离线可用。',
    pm: '张伟',
    pmo: '王敏',
    qa: '孙丽',
    depts: ['算法一部', '软件中心'],
    phase: 'EVT',
    health: '正常',
    date: '2026-08-01',
    keyMetrics: { phaseProgress: 78, docCompletionRate: 85, riskCount: 1, lastReportTime: '2026-08-22 16:00' },
    team: [
      { id: 'p1', name: '张伟', role: 'PM', dept: '产品部', avatarColor: 'blue', phone: '139-0000-0001' },
      { id: 'p2', name: '王敏', role: 'PMO', dept: '项目管理办公室', avatarColor: 'indigo', phone: '139-0000-0002' },
      { id: 'p3', name: '孙丽', role: 'QA', dept: '质量部', avatarColor: 'emerald' },
      { id: 'p4', name: '钱程', role: '算法', dept: '算法一部', avatarColor: 'violet' },
      { id: 'p5', name: '朱琳', role: '软件', dept: '软件中心', avatarColor: 'cyan' },
      { id: 'p6', name: '许航', role: '测试', dept: '测试中心', avatarColor: 'rose' },
    ],
    phases: [
      { phase: '概念期', startDate: '2026-04-01', endDate: '2026-05-15', target: '完成 V2.0 需求定义与技术路线选型', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '已通过' },
      { phase: '原型期', startDate: '2026-05-16', endDate: '2026-07-20', target: '完成原型 Demo，验证多轮对话核心能力', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '已通过' },
      { phase: 'EVT', startDate: '2026-07-21', endDate: '2026-09-30', target: '完成实验室样机，实车验证通过', entryConditions: [], exitConditions: [], docs: [
        { name: 'BOM 表', required: true, uploaded: true },
        { name: '算法模型规格书', required: true, uploaded: true },
        { name: '车机适配文档', required: true, uploaded: true },
        { name: '测试报告（EVT）', required: true, uploaded: false },
      ], reviewStatus: '进行中' },
      { phase: 'DVT', startDate: '2026-10-01', endDate: '2026-12-31', target: '设计验证，准备量产', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '未开始' },
      { phase: 'MP', startDate: '2027-01-01', endDate: '2027-06-30', target: '量产交付 5 万台套', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '未开始' },
    ],
    feeds: [
      { id: 'pf1', author: '钱程', role: '算法', avatarColor: 'violet', time: '2026-08-21 10:00', tag: '进展', content: '离线语音识别字错率降到 3.2%，V2.0 目标达成。' },
      { id: 'pf2', author: '朱琳', role: '软件', avatarColor: 'cyan', time: '2026-08-20 16:30', tag: '进展', content: '车机端 SDK 适配完成：QCOM 8155 / 芯驰 X9U 双平台通过。' },
      { id: 'pf3', author: '孙丽', role: 'QA', avatarColor: 'emerald', time: '2026-08-19 09:15', tag: '风险', content: '高温 85°C 工况下偶发语音唤醒延迟，已转算法定位。' },
    ],
    reports: [
      { id: 'pr1', week: '2026-W34', generateTime: '2026-08-22 16:00', progress: ['离线字错率 3.2% 达标', '双平台 SDK 适配通过'], risks: ['高温唤醒延迟待定位'], nextPlan: ['启动 EVT 整车测试'] },
    ],
    assets: [
      { id: 'pa1', name: 'PRD V2.0.pdf', category: '文档', subCategory: '产品文档', uploader: '张伟', uploadTime: '2026-05-10', size: '960 KB', fileType: 'PDF' },
      { id: 'pa2', name: '架构设计图.pdf', category: '文档', subCategory: '技术文档', uploader: '朱琳', uploadTime: '2026-06-15', size: '1.6 MB', fileType: 'PDF' },
      { id: 'pa3', name: 'Logo-主视觉.png', category: '图片', subCategory: 'Logo', uploader: '设计部', uploadTime: '2026-06-01', size: '320 KB', fileType: 'PNG' },
      { id: 'pa4', name: '宣传手册.pdf', category: '手册', uploader: '张伟', uploadTime: '2026-08-01', size: '4.2 MB', fileType: 'PDF' },
    ],
    aiScenes: [
      { id: 'ps1', name: '领导汇报版', description: '月度汇报用', icon: 'leader', prompt: '' },
      { id: 'ps2', name: '售前沟通版', description: '主机厂客户拜访', icon: 'presale', prompt: '' },
      { id: 'ps3', name: '自定义场景', description: '自由输入', icon: 'custom', prompt: '' },
    ],
  },
  {
    id: 'P-2026002',
    name: '高精度自动驾驶视觉感知模组',
    shortName: '视觉感知模组',
    oneLiner: '800 万像素环视 + 前视视觉感知方案，支持车道线/车辆/行人/交通标识 4 大类 40+ 小目标检测，ASIL-B 安全等级。',
    pm: '李娜',
    pmo: '黄磊',
    qa: '周静',
    depts: ['硬件二部', '算法二部'],
    phase: '原型期',
    health: '风险',
    date: '2026-08-10',
    keyMetrics: { phaseProgress: 30, docCompletionRate: 40, riskCount: 3, lastReportTime: '2026-08-22 16:00' },
    team: [
      { id: 'v1', name: '李娜', role: 'PM', dept: '产品部', avatarColor: 'blue' },
      { id: 'v2', name: '黄磊', role: 'PMO', dept: '项目管理办公室', avatarColor: 'indigo' },
      { id: 'v3', name: '周静', role: 'QA', dept: '质量部', avatarColor: 'emerald' },
      { id: 'v4', name: '吴刚', role: '硬件', dept: '硬件二部', avatarColor: 'amber' },
      { id: 'v5', name: '郑昊', role: '算法', dept: '算法二部', avatarColor: 'violet' },
      { id: 'v6', name: '冯雪', role: '测试', dept: '测试中心', avatarColor: 'rose' },
    ],
    phases: [
      { phase: '概念期', startDate: '2026-05-01', endDate: '2026-07-10', target: '需求定义与传感器选型', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '已通过' },
      { phase: '原型期', startDate: '2026-07-11', endDate: '2026-10-20', target: '完成原型机开发，目标检测精度 ≥ 95%', entryConditions: [], exitConditions: [], docs: [
        { name: 'BOM 表（原型版）', required: true, uploaded: false },
        { name: '传感器评估报告', required: true, uploaded: true },
        { name: '模型训练方案', required: true, uploaded: false },
        { name: '测试计划', required: true, uploaded: false },
      ], reviewStatus: '进行中' },
      { phase: 'EVT', startDate: '2026-10-21', endDate: '2027-01-15', target: '实验室样机', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '未开始' },
      { phase: 'DVT', startDate: '2027-01-16', endDate: '2027-04-30', target: '设计验证', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '未开始' },
      { phase: 'MP', startDate: '2027-05-01', endDate: '2027-12-31', target: '量产', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '未开始' },
    ],
    feeds: [
      { id: 'vf1', author: '吴刚', role: '硬件', avatarColor: 'amber', time: '2026-08-20 14:00', tag: '风险', content: '800 万像素 Sony 传感器样品供货紧张，原 9 月初推迟到 9 月底，影响原型机时间 3 周。' },
      { id: 'vf2', author: '郑昊', role: '算法', avatarColor: 'violet', time: '2026-08-18 11:20', tag: '问题', content: '雨夜场景车道线检测准确率当前 82%，距离目标 92% 有差距，需补充雨雾数据集。' },
      { id: 'vf3', author: '李娜', role: 'PM', avatarColor: 'blue', time: '2026-08-15 09:00', tag: '里程碑', content: '与主机厂 X 项目预研合同签署，锁定感知需求规格。' },
    ],
    reports: [
      { id: 'vr1', week: '2026-W34', generateTime: '2026-08-22 16:00', progress: ['传感器评估报告发布', '与主机厂 X 项目预研合同签署'], risks: ['Sony 传感器样品延期 3 周', '雨夜车道线准确率缺口 10%'], nextPlan: ['启动备选传感器评估', '扩充雨雾数据集'] },
    ],
    assets: [
      { id: 'va1', name: '需求规格书 V1.0.pdf', category: '文档', subCategory: '产品文档', uploader: '李娜', uploadTime: '2026-07-10', size: '720 KB', fileType: 'PDF' },
      { id: 'va2', name: '传感器评估报告.pdf', category: '文档', subCategory: '技术文档', uploader: '吴刚', uploadTime: '2026-08-10', size: '2.3 MB', fileType: 'PDF' },
    ],
    aiScenes: [
      { id: 'vs1', name: '领导汇报版', description: '汇报进展与风险', icon: 'leader', prompt: '' },
      { id: 'vs2', name: '自定义场景', description: '自由输入', icon: 'custom', prompt: '' },
    ],
  },
  {
    id: 'P-2026003',
    name: '新一代车载无线充电面板',
    shortName: '车载无线充面板',
    oneLiner: '50W 大功率车载无线充电方案，支持多协议兼容 + 异物检测 + NVH 优化，适配主流新能源中控布局。',
    pm: '王强',
    pmo: '刘涛',
    qa: '吴芳',
    depts: ['硬件一部', '测试中心'],
    phase: 'DVT',
    health: '正常',
    date: '2026-07-15',
    keyMetrics: { phaseProgress: 88, docCompletionRate: 90, riskCount: 0, lastReportTime: '2026-08-22 16:00' },
    team: [
      { id: 'w1', name: '王强', role: 'PM', dept: '产品部', avatarColor: 'blue' },
      { id: 'w2', name: '刘涛', role: 'PMO', dept: '项目管理办公室', avatarColor: 'indigo' },
      { id: 'w3', name: '吴芳', role: 'QA', dept: '质量部', avatarColor: 'emerald' },
      { id: 'w4', name: '郑勇', role: '硬件', dept: '硬件一部', avatarColor: 'amber' },
      { id: 'w5', name: '陈晨', role: '结构', dept: '工业设计部', avatarColor: 'fuchsia' },
      { id: 'w6', name: '徐明辉', role: '测试', dept: '测试中心', avatarColor: 'rose' },
    ],
    phases: [
      { phase: '概念期', startDate: '2026-02-01', endDate: '2026-03-15', target: '需求定义', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '已通过' },
      { phase: '原型期', startDate: '2026-03-16', endDate: '2026-05-20', target: '原型开发', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '已通过' },
      { phase: 'EVT', startDate: '2026-05-21', endDate: '2026-07-20', target: '实验室验证', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '已通过' },
      { phase: 'DVT', startDate: '2026-07-21', endDate: '2026-09-30', target: '设计验证，准备量产', entryConditions: [], exitConditions: [], docs: [
        { name: 'BOM 表（量产版）', required: true, uploaded: true },
        { name: '测试报告（DVT）', required: true, uploaded: true },
        { name: '生产工艺文件', required: true, uploaded: true },
        { name: 'EMC 测试报告', required: true, uploaded: false },
      ], reviewStatus: '进行中' },
      { phase: 'MP', startDate: '2026-10-01', endDate: '2027-03-31', target: '量产 10 万台套', entryConditions: [], exitConditions: [], docs: [], reviewStatus: '未开始' },
    ],
    feeds: [
      { id: 'wf1', author: '陈晨', role: '结构', avatarColor: 'fuchsia', time: '2026-08-21 15:30', tag: '进展', content: '散热结构优化完成，温升测试 48°C → 42°C，达标。' },
      { id: 'wf2', author: '郑勇', role: '硬件', avatarColor: 'amber', time: '2026-08-19 10:00', tag: '里程碑', content: 'DVT 阶段 50W 充电效率峰值 86%，量产目标达成。' },
    ],
    reports: [
      { id: 'wr1', week: '2026-W34', generateTime: '2026-08-22 16:00', progress: ['DVT 50W 效率 86% 达标', '散热结构优化完成，温升 42°C'], risks: [], nextPlan: ['EMC 测试最终版', '供应商 SOP 确认'] },
    ],
    assets: [
      { id: 'wa1', name: '产品规格书 V1.2.pdf', category: '文档', subCategory: '产品文档', uploader: '王强', uploadTime: '2026-07-20', size: '680 KB', fileType: 'PDF' },
      { id: 'wa2', name: 'BOM 量产版.xlsx', category: '文档', subCategory: 'BOM', uploader: '郑勇', uploadTime: '2026-08-05', size: '120 KB', fileType: 'Excel' },
      { id: 'wa3', name: 'DVT 测试报告.pdf', category: '文档', subCategory: '测试报告', uploader: '徐明辉', uploadTime: '2026-08-15', size: '5.8 MB', fileType: 'PDF' },
    ],
    aiScenes: [
      { id: 'ws1', name: '领导汇报版', description: '量产准备汇报', icon: 'leader', prompt: '' },
      { id: 'ws2', name: '售前沟通版', description: '客户介绍材料', icon: 'presale', prompt: '' },
      { id: 'ws3', name: '自定义场景', description: '自由输入', icon: 'custom', prompt: '' },
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}
