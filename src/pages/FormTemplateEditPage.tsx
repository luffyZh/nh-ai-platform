import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  ArrowLeftRight,
  Bell,
  Settings2,
  Square,
  Type,
  Hash,
  CalendarDays,
  ChevronDown,
  CircleDot,
  AlignJustify,
  Eye,
  LayoutGrid,
  ListOrdered,
  Layers,
} from 'lucide-react';
import CollapsibleModule from '../components/ui/CollapsibleModule';

/* ============================================================
   类型定义
   ============================================================ */
type FieldType =
  | 'section'
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'radio'
  | 'textarea'
  | 'left_right'
  | 'matrix'
  | 'dynamic_list';

interface FormFieldNode {
  id: string;
  type: FieldType;
  key: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  collapsed?: boolean;
  children?: FormFieldNode[];
  sectionTitle?: string;
}

interface ComponentLibItem {
  type: FieldType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/* ============================================================
   Mock：组件库 + 节点树 + 属性配置
   ============================================================ */
const COMPONENT_LIB: ComponentLibItem[] = [
  { type: 'section', label: '模块容器', icon: Square },
  { type: 'text', label: '单行文本', icon: Type },
  { type: 'number', label: '数字输入', icon: Hash },
  { type: 'date', label: '日期', icon: CalendarDays },
  { type: 'select', label: '下拉选择', icon: ChevronDown },
  { type: 'radio', label: '单选', icon: CircleDot },
  { type: 'textarea', label: '多行文本', icon: AlignJustify },
  { type: 'left_right', label: '左右眼表格', icon: Eye },
  { type: 'matrix', label: '矩阵表格', icon: LayoutGrid },
  { type: 'dynamic_list', label: '动态列表', icon: ListOrdered },
];

const INITIAL_NODES: FormFieldNode[] = [
  {
    id: 'f1',
    type: 'section',
    key: 'section_record',
    label: '1. 记录信息',
    sectionTitle: '1. 记录信息',
    collapsed: false,
    children: [
      {
        id: 'f1-1',
        type: 'date',
        key: 'check_date',
        label: '检查日期',
        required: true,
        placeholder: '年 / 月 / 日',
      },
      {
        id: 'f1-2',
        type: 'text',
        key: 'researcher',
        label: '研究者',
        required: true,
        placeholder: '请输入研究者姓名',
      },
    ],
  },
  {
    id: 'f2',
    type: 'section',
    key: 'section_subject',
    label: '2. 受试者基本信息',
    sectionTitle: '2. 受试者基本信息',
    collapsed: false,
    children: [
      {
        id: 'f2-1',
        type: 'text',
        key: 'subject_initial',
        label: '姓名缩写',
        required: true,
        placeholder: '如：ZSM',
      },
      {
        id: 'f2-2',
        type: 'radio',
        key: 'gender',
        label: '性别',
        required: true,
        options: [
          { label: '男', value: 'M' },
          { label: '女', value: 'F' },
        ],
      },
      {
        id: 'f2-3',
        type: 'date',
        key: 'birthday',
        label: '出生日期',
        required: true,
        placeholder: '年 / 月 / 日',
      },
    ],
  },
  {
    id: 'f3',
    type: 'section',
    key: 'section_inclusion',
    label: '3. 入排标准判定',
    sectionTitle: '3. 入排标准判定',
    collapsed: false,
    children: [
      {
        id: 'f3-1',
        type: 'radio',
        key: 'inclusion_age',
        label: '1) 年龄 18 ~ 75 岁',
        required: true,
        options: [
          { label: '符合', value: 'Y' },
          { label: '不符合', value: 'N' },
        ],
      },
    ],
  },
];

/* ============================================================
   字段渲染器（根据节点 type 渲染预览控件）
   ============================================================ */
interface NodeRendererProps {
  node: FormFieldNode;
}

const FieldRenderer: React.FC<NodeRendererProps> = ({ node }) => {
  if (node.type === 'radio' && node.options) {
    return (
      <div className="w-full">
        <label className="block text-[14px] font-bold text-slate-700 mb-2.5">
          {node.label}
          {node.required && <span className="ml-1 text-rose-500">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {node.options.map((o) => (
            <button
              key={o.value}
              type="button"
              className="inline-flex items-center justify-center min-w-[3rem] px-4 h-11 rounded-xl bg-slate-50 border-2 border-slate-200 text-[13px] font-bold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all"
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
      <div className="w-full">
        <label className="block text-[14px] font-bold text-slate-700 mb-2.5">
          {node.label}
          {node.required && <span className="ml-1 text-rose-500">*</span>}
        </label>
        <input
          type="date"
          placeholder={node.placeholder}
          className="w-full h-12 px-5 rounded-2xl bg-slate-50/70 border-2 border-slate-200 text-[14px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-[14px] font-bold text-slate-700 mb-2.5">
        {node.label}
        {node.required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <input
        type="text"
        placeholder={node.placeholder}
        className="w-full h-12 px-5 rounded-2xl bg-slate-50/70 border-2 border-slate-200 text-[14px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400"
      />
    </div>
  );
};

/* ============================================================
   主页面：编辑表单样板（三栏布局）
   ============================================================ */
const FormTemplateEditPage: React.FC = () => {
  const [nodes] = useState<FormFieldNode[]>(INITIAL_NODES);
  const [selectedId, setSelectedId] = useState<string>('f1');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [libTab, setLibTab] = useState<'basic' | 'custom'>('basic');

  const selectedNode = useMemo<FormFieldNode | undefined>(() => {
    for (const sec of nodes) {
      if (sec.id === selectedId) return sec;
      for (const f of sec.children ?? []) if (f.id === selectedId) return f;
    }
    return undefined;
  }, [nodes, selectedId]);

  const selectedJsonString = useMemo<string>(() => {
    if (!selectedNode) return '// 未选中节点';
    return JSON.stringify(
      {
        id: selectedNode.id,
        type: selectedNode.type,
        label: selectedNode.label,
        key: selectedNode.key,
        sectionTitle: selectedNode.sectionTitle,
        collapsed: selectedNode.collapsed,
      },
      null,
      2
    );
  }, [selectedNode]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
      {/* 1. 顶部：面包屑 / 返回 / 权限角色 / 切换只读 / 保存草稿 */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回模板中心
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-black text-slate-800 leading-none">编辑表单样板</h1>
                <span className="inline-flex h-6 px-2.5 items-center rounded-md bg-blue-50 text-[11px] font-black text-blue-600 border border-blue-100">
                  开发者账户
                </span>
                <span className="inline-flex h-6 px-2.5 items-center rounded-md bg-purple-50 text-[11px] font-black text-purple-600 border border-purple-100">
                  超级管理员
                </span>
              </div>
              <p className="text-[12px] text-slate-400 mt-1.5">通过拖拽组件快速构建 eCRF 表单模板</p>
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
            <button className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-[13px] font-bold text-slate-600 hover:border-slate-300 transition-all">
              切换只读
            </button>
            <button className="h-9 px-5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[13px] font-black shadow-sm hover:brightness-110 transition-all inline-flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              保存草稿
            </button>
          </div>
        </div>
      </div>

      {/* 2. 三栏主体 */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">
        {/* ============== 左栏：组件库 ============== */}
        <aside className="w-[340px] flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-black text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              组件库
            </h2>
          </div>

          <div className="px-5 pb-3">
            <div className="h-10 p-1 rounded-xl bg-slate-100 flex">
              {[
                { key: 'basic', label: '基础组件' },
                { key: 'custom', label: '自定义区块' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setLibTab(t.key as typeof libTab)}
                  className={`flex-1 h-8 rounded-lg text-[12px] font-bold transition-all ${
                    libTab === t.key
                      ? 'bg-white text-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <div className="grid grid-cols-2 gap-2.5">
              {COMPONENT_LIB.map((c) => (
                <button
                  key={c.type}
                  type="button"
                  className="group flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-slate-50/70 border-2 border-transparent hover:bg-white hover:border-blue-200 hover:shadow-[0_4px_12px_-8px_rgba(59,130,246,0.4)] transition-all"
                >
                  <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-slate-200 text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-all shadow-sm">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-500 group-hover:text-slate-700">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ============== 中栏：动态画布 ============== */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* 画布顶部信息卡（模板名称 + 版本 + 状态） */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-7 py-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-7">
              <div>
                <div className="text-[12px] text-slate-400 mb-1 font-medium">模板名称</div>
                <div className="text-[18px] font-black text-slate-800 tracking-tight">新建基线表</div>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div>
                <div className="text-[12px] text-slate-400 mb-1 font-medium">版本号</div>
                <div className="text-[18px] font-black text-slate-800 tabular-nums tracking-tight">v0.1.0</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 px-4 items-center rounded-xl bg-slate-100 text-[12px] font-black text-slate-500 border border-slate-200/70">
                基线访视
              </span>
              <span className="inline-flex h-9 px-4 items-center rounded-xl bg-blue-50 text-[12px] font-black text-blue-600 border border-blue-100">
                草稿
              </span>
            </div>
          </div>

          {/* 画布本体 */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-0">
            <div className="px-7 py-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-baseline gap-3">
                <h2 className="text-[16px] font-black text-slate-800">动态画布</h2>
                <span className="text-[12px] text-slate-400">
                  （画布里显示的内容就是实际页面呈现的内容）
                </span>
              </div>
              <div className="inline-flex h-10 p-1 rounded-2xl bg-slate-100 border border-slate-200/70">
                {[
                  { k: 'desktop' as const, ic: Monitor, lb: 'PC' },
                  { k: 'mobile' as const, ic: Smartphone, lb: '手机' },
                ].map((d) => (
                  <button
                    key={d.k}
                    onClick={() => setDevice(d.k)}
                    className={`flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-[11px] font-black transition-all ${
                      device === d.k
                        ? 'bg-white text-slate-700 shadow-sm border border-slate-200/70'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <d.ic className="w-4 h-4" />
                    {d.lb}
                  </button>
                ))}
                <div className="w-px bg-slate-200 mx-0.5 my-2" />
                <button className="flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-[11px] font-black text-slate-400 hover:text-slate-600 transition-all">
                  <ArrowLeftRight className="w-4 h-4" />
                  切布局
                </button>
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto p-7 bg-slate-50/50 space-y-4 ${device === 'mobile' ? 'max-w-[440px] mx-auto' : ''}`}>
              {nodes.map((section, idx) => {
                const isSelected = selectedId === section.id;
                const count = section.children?.length ?? 0;
                return (
                  <div key={section.id} onClick={() => setSelectedId(section.id)}>
                    <CollapsibleModule
                      index={idx + 1}
                      title={section.sectionTitle ?? section.label.replace(/^\d+\.\s*/, '')}
                      itemCount={count}
                      selected={isSelected}
                      defaultOpen={!section.collapsed}
                    >
                      <div
                        className="space-y-5 max-w-[88%] ml-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {section.children?.map((child) => (
                          <div
                            key={child.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(child.id);
                            }}
                            className={`p-2 -m-2 rounded-xl transition-all ${
                              selectedId === child.id ? 'ring-2 ring-blue-500/40 bg-blue-50/20' : ''
                            }`}
                          >
                            <FieldRenderer node={child} />
                          </div>
                        ))}
                      </div>
                    </CollapsibleModule>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* ============== 右栏：属性配置 + 节点 JSON ============== */}
        <aside className="w-[380px] flex-shrink-0 flex flex-col gap-4 min-h-0">
          {/* 属性配置 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[15px] font-black text-slate-800">属性配置</h2>
              <span className="text-[11px] text-slate-400 font-bold">NODE · {selectedNode?.id ?? '—'}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              <div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3">
                  字段基础属性
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-2">字段名称</label>
                    <input
                      type="text"
                      defaultValue={selectedNode?.label ?? ''}
                      className="w-full h-10 px-4 rounded-xl bg-slate-50/70 border border-slate-200 text-[13px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-2">字段 Key</label>
                    <input
                      type="text"
                      defaultValue={selectedNode?.key ?? ''}
                      className="w-full h-10 px-4 rounded-xl bg-slate-50/70 border border-slate-200 text-[13px] font-mono text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-2">区块标题</label>
                    <input
                      type="text"
                      defaultValue={selectedNode?.sectionTitle ?? selectedNode?.label ?? ''}
                      className="w-full h-10 px-4 rounded-xl bg-slate-50/70 border border-slate-200 text-[13px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 节点 JSON 预览 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0 flex-1">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[15px] font-black text-slate-800">节点 JSON</h2>
              <button className="text-[11px] font-black text-slate-400 hover:text-blue-500 transition-colors px-2 py-1 rounded-md hover:bg-slate-50">
                复制
              </button>
            </div>
            <div className="flex-1 overflow-hidden m-4 rounded-xl bg-slate-900">
              <pre className="h-full overflow-auto p-4 text-[12px] leading-relaxed font-mono text-emerald-300/90">
{selectedJsonString}
              </pre>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FormTemplateEditPage;
