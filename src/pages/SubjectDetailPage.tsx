import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Settings2,
  AlertOctagon,
  Pencil,
  BookOpen,
  Eye,
  EyeOff,
} from 'lucide-react';
import CollapsibleModule from '../components/ui/CollapsibleModule';

/* ============================================================
   1. 类型 & Mock 数据
   ============================================================ */
type VisitStatus = 'completed' | 'scheduled' | 'pending';

interface VisitStage {
  code: string;
  name: string;
  status: VisitStatus;
  planDate: string;
  actualDate?: string;
}

interface SubjectInfo {
  initials: string;
  subjectNo: string;
  randomNo: string;
  source: string;
  center: string;
  enrollmentDate: string;
  nextVisit: string;
}

interface SectionField {
  id: string;
  type: 'text' | 'date' | 'radio' | 'table' | 'textarea';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  tableCols?: string[];
  tableRows?: string[];
}

const MOCK_SUBJECT: SubjectInfo = {
  initials: 'CQ',
  subjectNo: 'S-P001-007',
  randomNo: 'R191',
  source: '转诊',
  center: '温州医科大学附属眼视光医院',
  enrollmentDate: '2025-10-24',
  nextVisit: '--',
};

const MOCK_VISITS: VisitStage[] = [
  { code: 'V0', name: 'V0 基线期', status: 'completed', planDate: '2026-03-01', actualDate: '2026-03-01' },
  { code: 'V1', name: 'V1 3M', status: 'completed', planDate: '2026-06-01', actualDate: '2026-06-03' },
  { code: 'V2', name: 'V2 6M', status: 'scheduled', planDate: '2026-09-01' },
  { code: 'V3', name: 'V3 9M', status: 'pending', planDate: '2026-12-01' },
  { code: 'V4', name: 'V4 12M', status: 'pending', planDate: '2027-03-01' },
];

const MOCK_SECTIONS: Array<{
  id: string;
  title: string;
  itemCount: number;
  fields: SectionField[];
}> = [
  {
    id: 's1',
    title: '记录信息',
    itemCount: 2,
    fields: [
      { id: 's1-1', type: 'date', label: '检查日期', required: true, placeholder: '年 / 月 / 日' },
      { id: 's1-2', type: 'text', label: '研究者', required: true, placeholder: '请输入研究者姓名' },
    ],
  },
  {
    id: 's2',
    title: '受试者基本信息',
    itemCount: 3,
    fields: [
      { id: 's2-1', type: 'text', label: '姓名缩写', required: true, placeholder: '如：ZSM' },
      {
        id: 's2-2',
        type: 'radio',
        label: '性别',
        required: true,
        options: [
          { label: '男', value: 'M' },
          { label: '女', value: 'F' },
        ],
      },
      { id: 's2-3', type: 'text', label: '身高 (cm)', placeholder: '请输入身高' },
    ],
  },
  {
    id: 's3',
    title: '视力检查',
    itemCount: 1,
    fields: [
      {
        id: 's3-1',
        type: 'table',
        label: '视力检查结果',
        tableCols: ['检查项目', 'OD', 'OS'],
        tableRows: ['裸眼视力', '矫正视力', '针孔视力'],
      },
    ],
  },
  {
    id: 's4',
    title: '用药情况',
    itemCount: 1,
    fields: [
      {
        id: 's4-1',
        type: 'textarea',
        label: '近 30 天用药史',
        placeholder: '按药品名 / 剂量 / 使用频率填写，无需则填“无”',
      },
    ],
  },
  {
    id: 's5',
    title: '对比敏感度',
    itemCount: 1,
    fields: [
      {
        id: 's5-1',
        type: 'table',
        label: 'CSV-1000 对比敏感度',
        tableCols: ['空间频率', 'OD', 'OS', '正常范围'],
        tableRows: ['3 cpd', '6 cpd', '12 cpd', '18 cpd'],
      },
    ],
  },
];

/* ============================================================
   2. 辅助组件
   ============================================================ */
const statusColor = (s: VisitStatus): string => {
  switch (s) {
    case 'completed':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    case 'scheduled':
      return 'bg-blue-50 text-blue-600 border border-blue-100';
    default:
      return 'bg-slate-50 text-slate-500 border border-slate-200';
  }
};
const statusLabel = (s: VisitStatus): string =>
  s === 'completed' ? '已完成' : s === 'scheduled' ? '已预约' : '未开始';

const FieldRenderer: React.FC<{ node: SectionField }> = ({ node }) => {
  if (node.type === 'radio' && node.options) {
    return (
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-2">
          {node.label}
          {node.required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
        <div className="flex gap-2">
          {node.options.map((o) => (
            <button
              key={o.value}
              type="button"
              className="inline-flex items-center justify-center min-w-[3.5rem] px-4 h-10 rounded-xl bg-white border-2 border-slate-200 text-[12px] font-bold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all"
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (node.type === 'date') {
    return (
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-2">
          {node.label}
          {node.required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
        <input
          type="date"
          className="w-full h-11 px-4 rounded-xl bg-slate-50/80 border border-slate-200 text-[13px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
        />
      </div>
    );
  }
  if (node.type === 'textarea') {
    return (
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-2">
          {node.label}
          {node.required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
        <textarea
          rows={3}
          placeholder={node.placeholder}
          className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-[13px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none leading-relaxed placeholder:text-slate-400"
        />
      </div>
    );
  }
  if (node.type === 'table' && node.tableCols && node.tableRows) {
    return (
      <div>
        <label className="block text-[13px] font-bold text-slate-700 mb-2.5">{node.label}</label>
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-[12.5px] text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400">
                {node.tableCols.map((c, i) => (
                  <th
                    key={c}
                    className={`px-4 py-3 font-black ${i === 0 ? 'w-36 text-slate-500' : ''}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {node.tableRows.map((r) => (
                <tr key={r}>
                  <td className="px-4 py-3 font-bold text-slate-600 bg-slate-50/40">{r}</td>
                  {node.tableCols!.slice(1).map((c, i) => (
                    <td key={`${r}-${c}-${i}`} className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full h-9 px-3 rounded-lg bg-slate-50/70 border border-slate-200 text-[12.5px] text-slate-700 outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div>
      <label className="block text-[13px] font-bold text-slate-700 mb-2">
        {node.label}
        {node.required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <input
        type="text"
        placeholder={node.placeholder}
        className="w-full h-11 px-4 rounded-xl bg-slate-50/80 border border-slate-200 text-[13px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400"
      />
    </div>
  );
};

/* ============================================================
   3. 主页面
   ============================================================ */
const SubjectDetailPage: React.FC = () => {
  const [currentVisitCode] = useState<string>('V2');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('s1');

  const currentVisit = MOCK_VISITS.find((v) => v.code === currentVisitCode)!;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
      {/* ====== 顶部页头 ====== */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              返回受试者列表
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-black text-slate-800 leading-none">受试者详情</h1>
                <span className="inline-flex h-6 px-2.5 items-center rounded-md bg-blue-50 text-[11px] font-black text-blue-600 border border-blue-100">
                  开发者账户
                </span>
                <span className="inline-flex h-6 px-2.5 items-center rounded-md bg-purple-50 text-[11px] font-black text-purple-600 border border-purple-100">
                  超级管理员
                </span>
              </div>
              <p className="text-[12px] text-slate-400 mt-1.5 font-mono">{MOCK_SUBJECT.subjectNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <button className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings2 className="w-4.5 h-4.5" />
            </button>
            <div className="h-5 w-px bg-slate-200 mx-1" />
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-bold text-slate-500">WelaiHealthcare</span>
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-[12px] font-black">
                AD
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== 三栏主体 ====== */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">
        {/* 左栏：受试者卡 + 访视阶段 */}
        <aside className="w-[340px] flex-shrink-0 flex flex-col gap-4 min-h-0">
          {/* 蓝色受试者卡 */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-[0_6px_20px_-10px_rgba(37,99,235,0.7)]">
            <div className="text-[11px] text-blue-100 font-bold uppercase tracking-wider mb-3">
              当前受试者
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur">
                <span className="text-[26px] font-black tracking-tight leading-none">
                  {MOCK_SUBJECT.initials}
                </span>
              </div>
              <div>
                <div className="text-[16px] font-black leading-none mb-1">{MOCK_SUBJECT.initials}</div>
                <div className="text-[12px] text-blue-100 font-mono mt-1.5">
                  {MOCK_SUBJECT.subjectNo}
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-y-3 text-[12.5px]">
              {[
                ['随机号', MOCK_SUBJECT.randomNo],
                ['来源', MOCK_SUBJECT.source],
                ['中心', MOCK_SUBJECT.center],
                ['入组日期', MOCK_SUBJECT.enrollmentDate],
                ['下次访视', MOCK_SUBJECT.nextVisit],
              ].map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt className="text-blue-200 font-bold col-span-1">{k}</dt>
                  <dd className="text-white/95 font-bold col-span-1 text-right">{v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>

          {/* 访视阶段（Timeline） */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[14px] font-black text-slate-800">访视阶段</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
              {MOCK_VISITS.map((v, i) => {
                const active = v.code === currentVisitCode;
                return (
                  <div
                    key={v.code}
                    className={`relative pl-8 py-3.5 rounded-xl transition-all ${
                      active ? 'bg-blue-50/70 ring-1 ring-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* 时间轴点 */}
                    <div
                      className={`absolute left-[7px] top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        v.status === 'completed'
                          ? 'bg-white border-emerald-500'
                          : active
                          ? 'bg-blue-600 border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.12)]'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {v.status === 'completed' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    {/* 轴竖线 */}
                    {i < MOCK_VISITS.length - 1 && (
                      <div
                        className={`absolute left-[14px] top-9 w-px h-[calc(100%-22px)] ${
                          v.status === 'completed' ? 'bg-emerald-300/70' : 'bg-slate-200'
                        }`}
                      />
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div
                          className={`text-[13.5px] font-black leading-tight ${
                            active ? 'text-blue-700' : 'text-slate-700'
                          }`}
                        >
                          {v.name}
                        </div>
                        <div className="mt-1.5 text-[11px] text-slate-400 space-y-0.5">
                          <div>计划日期：{v.planDate}</div>
                          <div>实际日期：{v.actualDate ?? '--'}</div>
                        </div>
                      </div>
                      <span
                        className={`flex-shrink-0 inline-flex items-center h-6 px-2.5 rounded-full text-[10.5px] font-black ${statusColor(
                          v.status
                        )}`}
                      >
                        {statusLabel(v.status)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* 中栏：数据采集表 */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* 表单 Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-7 py-5 mb-4 flex items-center justify-between">
            <h2 className="text-[20px] font-black text-slate-800 tracking-tight">
              {currentVisit.code} {currentVisit.name.slice(3)} 数据采集表
            </h2>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-slate-200 bg-white text-[12.5px] font-bold text-slate-600 hover:border-slate-300 transition-all">
                <BookOpen className="w-4 h-4" />
                只读模式
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-amber-200 bg-amber-50 text-[12.5px] font-bold text-amber-600 hover:bg-amber-100 transition-all">
                <AlertOctagon className="w-4 h-4" />
                提出质疑
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[12.5px] font-black shadow-sm hover:brightness-110 transition-all">
                <Pencil className="w-4 h-4" />
                编辑表单
              </button>
            </div>
          </div>

          {/* 表单滚动区 */}
          <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-7 space-y-4 min-h-0">
            {MOCK_SECTIONS.map((sec, idx) => {
              const selected = sec.id === selectedSectionId;
              return (
                <div key={sec.id} onClick={() => setSelectedSectionId(sec.id)}>
                  <CollapsibleModule
                    index={idx + 1}
                    title={sec.title}
                    itemCount={sec.itemCount}
                    selected={selected}
                  >
                    <div
                      className="space-y-5 max-w-[92%] ml-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {sec.fields.map((f) => (
                        <FieldRenderer key={f.id} node={f} />
                      ))}
                    </div>
                  </CollapsibleModule>
                </div>
              );
            })}
          </div>
        </main>

        {/* 右栏：目录锚点 */}
        <aside className="w-[260px] flex-shrink-0 min-h-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-[14px] font-black text-slate-800">目录</h2>
            </div>
            <div className="px-2 py-2">
              {MOCK_SECTIONS.map((sec, i) => {
                const active = sec.id === selectedSectionId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                      active
                        ? 'bg-blue-50 text-blue-700 font-black'
                        : 'text-slate-600 font-bold hover:bg-slate-50'
                    }`}
                  >
                    <span className={`tabular-nums ${active ? 'text-blue-500' : 'text-slate-400'}`}>
                      {i + 1}.
                    </span>
                    <span className="flex-1 truncate text-[13px]">{sec.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* 快捷：眼睛图标提示 */}
          <div className="mt-4 px-3 py-3 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
            <Eye className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-[11.5px] leading-relaxed text-blue-700/90">
              <div className="font-black mb-0.5">提示：</div>
              每节 Chevron 已移至模块最右，折叠状态点击 <EyeOff className="w-3 h-3 inline -mt-0.5" />{' '}
              仍在最右，不在标题旁边。
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SubjectDetailPage;
