export interface Department {
  id: string;
  name: string;
  parent: string;
  manager: string;
  count: number;
}

export const MOCK_DEPTS: Department[] = [
  { id: 'D-001', name: '软件中心', parent: '研究院', manager: '刘总', count: 45 },
  { id: 'D-002', name: '算法二部', parent: '算法中心', manager: '赵总', count: 28 },
  { id: 'D-003', name: '硬件一部', parent: '硬件中心', manager: '王强', count: 32 },
];
