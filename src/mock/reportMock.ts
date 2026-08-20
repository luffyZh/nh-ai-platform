export interface WeeklyReport {
  id: string;
  title: string;
  product: string;
  author: string;
  dept: string;
  date: string;
  status: string;
}

export const MOCK_REPORTS: WeeklyReport[] = [
  { id: 'R-001', title: '智能座舱 V2.0 - 第32周进展汇报', product: '智能座舱 V2.0', author: '张伟', dept: '软件中心', date: '2026-08-14', status: '已发送' },
  { id: 'R-002', title: '视觉感知模组 - 算法迭代周报', product: '视觉感知模组', author: '李娜', dept: '算法二部', date: '2026-08-14', status: '待确认' },
  { id: 'R-003', title: '无线充电面板 - EVT打样总结', product: '无线充电面板', author: '王强', dept: '硬件一部', date: '2026-08-13', status: '已发送' },
];
