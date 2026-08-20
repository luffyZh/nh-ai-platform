export type WizardStepKey =
  | 'positioning'
  | 'targetUsers'
  | 'painPoints'
  | 'coreFeatures';

export type IdeaStatus = '草稿' | '已提交' | '孵化中' | '已立项' | '已驳回';

export interface Idea {
  id: string;
  title: string;
  summary: string;
  author: string;
  dept: string;
  status: IdeaStatus;
  aiScore: number;
  createdAt: string;
  positioning: string;
  targetUsers: string;
  painPoints: string;
  coreFeatures: string;
  prdContent: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export const WIZARD_STEPS: {
  key: WizardStepKey;
  title: string;
  subtitle: string;
  placeholder: string;
  field: keyof Idea;
}[] = [
  {
    key: 'positioning',
    title: '产品定位',
    subtitle: '一句话说清你想做什么',
    placeholder: '例如：面向车载场景的 AI 语音助手 V2，解决驾驶中双手解放的交互问题',
    field: 'positioning',
  },
  {
    key: 'targetUsers',
    title: '目标用户',
    subtitle: '谁最痛、谁最先用',
    placeholder: '例如：1) 智能座舱车主 25-45 岁；2) 车企 HMI 团队，需快速定制语音能力',
    field: 'targetUsers',
  },
  {
    key: 'painPoints',
    title: '痛点场景',
    subtitle: '越具体的场景越容易孵化成功',
    placeholder: '例如：1) 高速上切歌/导航要抬手按屏幕，不安全；2) 现有语音方言识别差，老人不会用',
    field: 'painPoints',
  },
  {
    key: 'coreFeatures',
    title: '核心功能 (MVP)',
    subtitle: '只列最关键的 3-5 项，多了就不叫 MVP',
    placeholder: '1) 声纹识别 + 免唤醒对话  2) 方言自学习模型  3) 场景化快捷指令',
    field: 'coreFeatures',
  },
];
