import React, { useMemo, useState } from 'react';
import {
  Bell,
  Settings2,
  Search,
  Layers,
  Plus,
  Pencil,
  Trash2,
  Download,
} from 'lucide-react';
import Drawer from '../components/ui/Drawer';
import CollapsibleModule from '../components/ui/CollapsibleModule';

/* ============================================================
   1. 类型 & Mock 数据
   ============================================================ */
type TemplateStatus = '启用中' | '草稿' | '停用中';

interface FormTemplate {
  id: string;
  name: string;
  desc: string;
  status: TemplateStatus;
  moduleCount: number;
  lastUpdated: string;
  owner: string;
  visitType: string;
  version: string;
}

const MOCK_TEMPLATES: FormTemplate[] = [
  {
    id: 't01',
    name: '基线期采集表',
    desc: '用于基线访视采集受试者基本信息、视力与屈光结果。',
    status: '启用中',
    moduleCount: 5,
    lastUpdated: '2026-08-18',
    owner: '张敏',
    visitType: '基线访视',
    version: 'v1.0.0',
  },
  {
    id: 't02',
    name: '3M 随访表',
    desc: '用于随访访视记录焦佩戴镜情况、视力检查与异常说明。',
    status: '启用中',
    moduleCount: 4,
    lastUpdated: '2026-08-15',
    owner: '王磊',
    visitType: '3M 访视',
    version: 'v1.2.0',
  },
  {
    id: 't03',
    name: '异常事件记录表',
    desc: '用于记录 AE/SAE、器械缺陷与方案偏离等安全性信息。',
    status: '草稿',
    moduleCount: 6,
    lastUpdated: '2026-08-20',
    owner: '李娜',
    visitType: '触发式',
    version: 'v0.2.0',
  },
  {
    id: 't04',
    name: '筛选期信息表',
    desc: '筛选阶段基础信息、入排标准与检查计划记录。',
    status: '启用中',
    moduleCount: 4,
    lastUpdated: '2026-08-10',
    owner: '陈默',
    visitType: '筛选访视',
    version: 'v2.1.0',
  },
  {
    id: 't05',
    name: '用药依从性记录表',
    desc: '记录受试者用药依从性、漏服原因与用药调整。',
    status: '启用中',
    moduleCount: 3,
    lastUpdated: '2026-08-05',
    owner: '张伟',
    visitType: '每次访视',
    version: 'v1.0.3',
  },
  {
    id: 't06',
    name: '实验室检查结果表',
    desc: '采集血常规、生化与尿检等实验室检查结果。',
    status: '草稿',
    moduleCount: 5,
    lastUpdated: '2026-07-28',
    owner: '刘洋',
    visitType: '访视内表',
    version: 'v0.5.0',
  },
  {
    id: 't07',
    name: '影像检查记录表',
    desc: '用于记录 OCT、眼底照相 等影像检查结果与判读。',
    status: '草稿',
    moduleCount: 3,
    lastUpdated: '2026-07-20',
    owner: '赵雪',
    visitType: '访视内表',
    version: 'v0.4.0',
  },
  {
    id: 't08',
    name: '随访电话记录表',
    desc: '随访电话联系记录、提醒事项与问题反馈收集。',
    status: '启用中',
    moduleCount: 2,
    lastUpdated: '2026-06-30',
    owner: '王磊',
    visitType: '电话访视',
    version: 'v1.1.0',
  },
  {
    id: 't09',
    name: '知情同意核对表',
    desc: '核对 ICF 签署完整性、版本与关键告知项。',
    status: '启用中',
    moduleCount: 3,
    lastUpdated: '2026-06-22',
    owner: '李娜',
    visitType: '筛选访视',
    version: 'v1.0.0',
  },
  {
    id: 't10',
    name: '器械发放登记表',
    desc: '记录器械/耗材发放、回收与序列号追踪。',
    status: '启用中',
    moduleCount: 4,
    lastUpdated: '2026-06-15',
    owner: '陈默',
    visitType: '每次访视',
    version: 'v1.0.1',
  },
  {
    id: 't11',
    name: '6M 终点采集表',
    desc: '6 个月访视终点事件、视力终点与 OCT 结构终点。',
    status: '启用中',
    moduleCount: 5,
    lastUpdated: '2026-05-30',
    owner: '张敏',
    visitType: '6M 访视',
    version: 'v1.0.0',
  },
  {
    id: 't12',
    name: '研究结束汇总表',
    desc: '研究结束 / 提前终止 时的结局汇总、AE 汇总与原因。',
    status: '草稿',
    moduleCount: 4,
    lastUpdated: '2026-05-20',
    owner: '张伟',
    visitType: '末次访视',
    version: 'v0.3.0',
  },
];

/* ============================================================
   2. 预览用 Collapsible 内容（基线期采集表模块结构）
   ============================================================ */
interface PreviewSection {
  id: string;
  title: string;
  itemCount: number;
  fields: Array<{
    id: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    type: 'text' | 'date' | 'radio' | 'table' | 'textarea';
    options?: Array<{ label: string; value: string }>;
    tableCols?: string[];
    tableRows?: string[];
  }>;
}

const BASELINE_PREVIEW_SECTIONS: PreviewSection[] = [
  {
    id: 'p1',
    title: '记录信息',
    itemCount: 2,
    fields: [
      { id: 'p1-1', type: 'date', label: '检查日期', required: true, placeholder: '年 / 月 / 日' },
      { id: 'p1-2', type: 'text', label: '研究者', required: true, placeholder: '请输入研究者姓名' },
    ],
  },
  {
    id: 'p2',
    title: '受试者基本信息',
    itemCount: 3,
    fields: [
      { id: 'p2-1', type: 'text', label: '姓名缩写', required: true, placeholder: '如：ZSM' },
      {
        id: 'p2-2',
        type: 'radio',
        label: '性别',
        required: true,
        options: [
          { label: '男', value: 'M' },
          { label: '女', value: 'F' },
        ],
      },
      { id: 'p2-3', type: 'text', label: '身高 (cm)', placeholder: '请输入身高' },
    ],
  },
  {
    id: 'p3',
    title: '视力检查',
    itemCount: 1,
    fields: [
      {
        id: 'p3-1',
        type: 'table',
        label: '视力检查结果',
        tableCols: ['检查项目', 'OD', 'OS'],
        tableRows: ['裸眼视力', '矫正视力', '针孔视力'],
      },
    ],
  },
  {
    id: 'p4',
    title: '用药情况',
    itemCount: 1,
    fields: [
      {
        id: 'p4-1',
        type: 'textarea',
        label: '近 30 天用药史',
        placeholder: '按药品名 / 剂量 / 使用频率填写，无需则填“无”',
      },
    ],
  },
  {
    id: 'p5',
    title: '对比敏感度',
    itemCount: 1,
    fields: [
      {
        id: 'p5-1',
        type: 'table',
        label: 'CSV-1000 对比敏感度',
        tableCols: ['空间频率', 'OD', 'OS', '正常范围'],
        tableRows: ['3 cpd', '6 cpd', '12 cpd', '18 cpd'],
      },
    ],
  },
];

/* ============================================================
   3. 状态样式
   ============================================================ */
const STATUS_STYLE: Record<TemplateStatus, string> = {
  '启用中': 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  '草稿': 'bg-blue-50 text-blue-600 border border-blue-100',
  '停用中': 'bg-slate-50 text-slate-500 border border-slate-200',
};

/* ============================================================
   4. 主页面
   ============================================================ */
const FormTemplateListPage: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TemplateStatus | '全部'>('全部');
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = useMemo<FormTemplate[]>(() => {
    return MOCK_TEMPLATES.filter((t) => {
      const matchKeyword =
        !keyword ||
        t.name.includes(keyword) ||
        t.desc.includes(keyword) ||
        t.owner.includes(keyword);
      const matchStatus = statusFilter === '全部' || t.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [keyword, statusFilter]);

  const previewTemplate = previewId
    ? MOCK_TEMPLATES.find((t) => t.id === previewId) ?? null
    : null;

  const stats = useMemo(() => {
    const total = MOCK_TEMPLATES.length;
    const enabled = MOCK_TEMPLATES.filter((t) => t.status === '启用中').length;
    return { total, enabled };
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
      {/* ====== 顶部页头 ====== */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-black text-slate-800 leading-none">
                EDC 表单样板间
              </h1>
              <span className="inline-flex h-6 px-2.5 items-center rounded-md bg-blue-50 text-[11px] font-black text-blue-600 border border-blue-100">
                开发者账户
              </span>
              <span className="inline-flex h-6 px-2.5 items-center rounded-md bg-purple-50 text-[11px] font-black text-purple-600 border border-purple-100">
                超级管理员
              </span>
            </div>
            <p className="text-[12px] text-slate-400 mt-1.5">
              预设和管理系统级的标准 eCRF 表单模板
            </p>
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

      {/* ====== 主体 ====== */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* KPI 卡 */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-7 py-5 flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-slate-400 mb-1.5">
                总模板数 (可复用配置)
              </div>
              <div className="text-[32px] font-black text-slate-800 tabular-nums leading-none">
                {stats.total}
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-7 py-5 flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-slate-400 mb-1.5">
                启用中模板数 (可绑定项目)
              </div>
              <div className="text-[32px] font-black text-slate-800 tabular-nums leading-none">
                {stats.enabled}
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Download className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* 搜索 + 筛选 + 操作 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索模板名称 / 描述 / 负责人"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-80 h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/70 text-[13px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TemplateStatus | '全部')}
              className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/70 text-[13px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
            >
              <option value="全部">全部状态</option>
              <option value="启用中">启用中</option>
              <option value="草稿">草稿</option>
              <option value="停用中">停用中</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:border-slate-300 transition-all inline-flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              导出配置
            </button>
            <button className="h-11 px-5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[13px] font-black shadow-sm hover:brightness-110 transition-all inline-flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              新建模板
            </button>
          </div>
        </div>

        {/* 模板表格 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="px-7 py-4 font-black">模板名称</th>
                <th className="px-7 py-4 font-black">模板描述</th>
                <th className="px-7 py-4 font-black">访视类型</th>
                <th className="px-7 py-4 font-black">版本</th>
                <th className="px-7 py-4 font-black">负责人</th>
                <th className="px-7 py-4 font-black">最近更新</th>
                <th className="px-7 py-4 font-black">模板状态</th>
                <th className="px-7 py-4 font-black text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-7 py-4.5 font-black text-slate-800">{t.name}</td>
                  <td className="px-7 py-4.5 text-slate-500 max-w-md truncate">{t.desc}</td>
                  <td className="px-7 py-4.5 text-slate-600">{t.visitType}</td>
                  <td className="px-7 py-4.5 text-slate-600 font-mono tabular-nums">{t.version}</td>
                  <td className="px-7 py-4.5 text-slate-700 font-bold">{t.owner}</td>
                  <td className="px-7 py-4.5 text-slate-500 tabular-nums">{t.lastUpdated}</td>
                  <td className="px-7 py-4.5">
                    <span
                      className={`inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-black ${STATUS_STYLE[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-7 py-4.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setPreviewId(t.id)}
                        className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[12px] font-bold text-slate-500 transition-all"
                      >
                        预览
                      </button>
                      <button className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[12px] font-bold text-slate-500 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                        编辑
                      </button>
                      <button className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-[12px] font-bold text-slate-500 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 分页条 */}
          <div className="px-7 py-4 border-t border-slate-100 flex items-center justify-between text-[12px] text-slate-400">
            <span>
              显示第 1-{filtered.length} 条，共 {MOCK_TEMPLATES.length} 条
            </span>
            <div className="flex items-center gap-1">
              {['上一页', '1', '2', '下一页'].map((p, i) => (
                <button
                  key={`${p}-${i}`}
                  className={`h-8 min-w-[2.5rem] px-2.5 rounded-lg text-[12px] font-bold transition-all ${
                    p === '1'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== 预览 Drawer：核心 3 的 折叠模块也用 CollapsibleModule，Chevron 最右 ====== */}
      <Drawer
        isOpen={!!previewTemplate}
        onClose={() => setPreviewId(null)}
        title={
          previewTemplate ? `预览：${previewTemplate.name}` : ''
        }
      >
        {previewTemplate && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
            {/* 预览头：描述 + 元信息 */}
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-[12.5px] text-slate-600 leading-relaxed">
              {previewTemplate.desc}
              <div className="mt-3 pt-3 border-t border-slate-200/70 grid grid-cols-3 gap-x-4 gap-y-1.5 font-bold text-[12px]">
                <div>
                  <span className="text-slate-400 font-bold mr-1.5">基线访视 · </span>
                  <span className="text-slate-600">{previewTemplate.visitType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold mr-1.5">版本 · </span>
                  <span className="font-mono tabular-nums text-slate-700">
                    {previewTemplate.version}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold mr-1.5">启用中 · </span>
                  <span className="text-slate-700">{previewTemplate.owner}</span>
                </div>
              </div>
            </div>

            {/* 折叠模块（用 CollapsibleModule → Chevron 保证最右） */}
            <div className="space-y-4">
              {BASELINE_PREVIEW_SECTIONS.map((sec, idx) => (
                <CollapsibleModule
                  key={sec.id}
                  index={idx + 1}
                  title={sec.title}
                  itemCount={sec.itemCount}
                  defaultOpen={idx < 3}
                >
                  <div className="space-y-5 max-w-[95%] ml-1">
                    {sec.fields.map((f) => {
                      if (f.type === 'radio' && f.options) {
                        return (
                          <div key={f.id}>
                            <label className="block text-[12.5px] font-bold text-slate-700 mb-2">
                              {f.label}
                              {f.required && <span className="ml-0.5 text-rose-500">*</span>}
                            </label>
                            <div className="flex gap-2">
                              {f.options.map((o) => (
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
                      if (f.type === 'date') {
                        return (
                          <div key={f.id}>
                            <label className="block text-[12.5px] font-bold text-slate-700 mb-2">
                              {f.label}
                              {f.required && <span className="ml-0.5 text-rose-500">*</span>}
                            </label>
                            <input
                              type="date"
                              className="w-full h-11 px-4 rounded-xl bg-slate-50/70 border border-slate-200 text-[12.5px] text-slate-700 outline-none"
                            />
                          </div>
                        );
                      }
                      if (f.type === 'textarea') {
                        return (
                          <div key={f.id}>
                            <label className="block text-[12.5px] font-bold text-slate-700 mb-2">
                              {f.label}
                            </label>
                            <textarea
                              rows={3}
                              placeholder={f.placeholder}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-[12.5px] text-slate-700 outline-none resize-none leading-relaxed"
                            />
                          </div>
                        );
                      }
                      if (f.type === 'table' && f.tableCols && f.tableRows) {
                        return (
                          <div key={f.id}>
                            <label className="block text-[12.5px] font-bold text-slate-700 mb-2.5">
                              {f.label}
                            </label>
                            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                              <table className="w-full text-[11.5px] text-left">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-400">
                                    {f.tableCols.map((c, i) => (
                                      <th
                                        key={c}
                                        className={`px-3 py-2.5 font-black ${
                                          i === 0 ? 'w-28 text-slate-500' : ''
                                        }`}
                                      >
                                        {c}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {f.tableRows.map((r) => (
                                    <tr key={r}>
                                      <td className="px-3 py-2 font-bold text-slate-600 bg-slate-50/40">
                                        {r}
                                      </td>
                                      {f.tableCols!.slice(1).map((c, i) => (
                                        <td key={`${r}-${c}-${i}`} className="px-2 py-1.5">
                                          <input
                                            type="text"
                                            className="w-full h-8 px-2.5 rounded-lg bg-slate-50/70 border border-slate-200 text-[11.5px] text-slate-700 outline-none placeholder:text-slate-400"
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
                        <div key={f.id}>
                          <label className="block text-[12.5px] font-bold text-slate-700 mb-2">
                            {f.label}
                            {f.required && <span className="ml-0.5 text-rose-500">*</span>}
                          </label>
                          <input
                            type="text"
                            placeholder={f.placeholder}
                            className="w-full h-11 px-4 rounded-xl bg-slate-50/70 border border-slate-200 text-[12.5px] text-slate-700 outline-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleModule>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default FormTemplateListPage;
