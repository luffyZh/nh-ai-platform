export interface SystemUser {
  id: string;
  name: string;
  account: string;
  dept: string;
  role: string;
  status: string;
}

export const MOCK_USERS: SystemUser[] = [
  { id: 'U-1001', name: '张伟', account: 'zhangwei', dept: '软件中心', role: '产品经理', status: '正常' },
  { id: 'U-1002', name: '李娜', account: 'lina', dept: '算法二部', role: '项目经理', status: '正常' },
  { id: 'U-1003', name: '王强', account: 'wangqiang', dept: '硬件一部', role: '部门负责人', status: '正常' },
];
