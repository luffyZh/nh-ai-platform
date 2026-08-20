export interface Product {
  id: string;
  name: string;
  pm: string;
  depts: string[];
  phase: string;
  health: string;
  date: string;
}

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P-2026001', name: 'NHY 智能座舱语音助手 V2.0', pm: '张伟', depts: ['算法一部', '软件中心'], phase: 'EVT', health: '正常', date: '2026-08-01' },
  { id: 'P-2026002', name: '高精度自动驾驶视觉感知模组', pm: '李娜', depts: ['硬件二部', '算法二部'], phase: '原型期', health: '风险', date: '2026-08-10' },
  { id: 'P-2026003', name: '新一代车载无线充电面板', pm: '王强', depts: ['硬件一部', '测试中心'], phase: 'DVT', health: '正常', date: '2026-07-15' },
];
