export interface RadarItem {
  subject: string;
  A: number;
  fullMark: number;
}

export interface BarItem {
  name: string;
  期望值: number;
  实际值: number;
}

export const RADAR_DATA: RadarItem[] = [
  { subject: '交付及时率', A: 92, fullMark: 100 },
  { subject: '打样直通率', A: 85, fullMark: 100 },
  { subject: '成本控制率', A: 88, fullMark: 100 },
  { subject: '需求变更率', A: 82, fullMark: 100 },
  { subject: '文档合规率', A: 95, fullMark: 100 },
];

export const BAR_DATA: BarItem[] = [
  { name: '智能座舱 V2.0', 期望值: 95, 实际值: 96 },
  { name: '视觉感知模组', 期望值: 90, 实际值: 82 },
  { name: '无线充电面板', 期望值: 98, 实际值: 98 },
  { name: '疲劳监测系统', 期望值: 95, 实际值: 94 },
];
