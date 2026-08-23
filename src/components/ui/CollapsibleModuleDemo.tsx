import React, { useState } from 'react';
import { Monitor, Smartphone, ArrowLeftRight } from 'lucide-react';
import CollapsibleModule from './CollapsibleModule';

type PreviewDevice = 'desktop' | 'mobile';

interface FormFieldProps {
  label: string;
  required?: boolean;
  placeholder: string;
  type?: 'text' | 'date';
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  placeholder,
  type = 'text',
}) => (
  <div className="w-full">
    <label className="block text-[15px] font-bold text-slate-700 mb-3">
      {label}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
    {type === 'date' ? (
      <input
        type="date"
        placeholder={placeholder}
        className="w-full h-12 px-5 rounded-2xl bg-slate-50/70 border-2 border-slate-200 text-[15px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
      />
    ) : (
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-12 px-5 rounded-2xl bg-slate-50/70 border-2 border-slate-200 text-[15px] text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
      />
    )}
  </div>
);

const CollapsibleModuleDemo: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<number>(0);
  const [device, setDevice] = useState<PreviewDevice>('desktop');

  const modules: Array<{
    key: number;
    index: number;
    title: string;
    itemCount: number;
    fields: Array<{ label: string; required?: boolean; placeholder: string; type?: 'text' | 'date' }>;
  }> = [
    {
      key: 0,
      index: 1,
      title: '记录信息',
      itemCount: 2,
      fields: [
        { label: '检查日期', required: true, placeholder: '年 /月/日', type: 'date' },
        { label: '研究者', required: true, placeholder: '请输入研究者姓名' },
      ],
    },
    {
      key: 1,
      index: 2,
      title: '受试者基本信息',
      itemCount: 3,
      fields: [
        { label: '受试者编号', required: true, placeholder: '例如：S001 / 001-2025' },
        { label: '性别', required: true, placeholder: '请选择：男 / 女' },
        { label: '出生日期', required: true, placeholder: '年 / 月 / 日', type: 'date' },
      ],
    },
    {
      key: 2,
      index: 3,
      title: '入排标准判定',
      itemCount: 5,
      fields: [
        { label: '年龄范围', required: true, placeholder: '18 ~ 75 岁（含边界）' },
        { label: 'BMI 区间', required: true, placeholder: '18.5 ≤ BMI ≤ 30' },
        { label: '签署知情同意', required: true, placeholder: '请选择：是 / 否' },
      ],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 space-y-6 animate-in fade-in duration-300">
      {/* 顶部：模板名称 + 版本 + 状态（复刻截图头） */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <div className="text-[13px] font-medium text-slate-400 mb-1">模板名称</div>
            <div className="text-[22px] font-black text-slate-800 tracking-tight">新建基线表</div>
          </div>
          <div className="w-px h-10 bg-slate-100" />
          <div>
            <div className="text-[13px] font-medium text-slate-400 mb-1">版本号</div>
            <div className="text-[22px] font-black text-slate-800 tabular-nums">v0.1.0</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center h-9 px-4 rounded-xl bg-slate-100 text-[13px] font-bold text-slate-500 border border-slate-200/70">
            基线访视
          </span>
          <span className="inline-flex items-center h-9 px-4 rounded-xl bg-blue-50 text-[13px] font-bold text-blue-600 border border-blue-100">
            草稿
          </span>
        </div>
      </div>

      {/* 画布容器：带标题栏 + 右上角设备切换 + 画布区 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* 画布标题栏 */}
        <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-baseline gap-3">
            <h2 className="text-[20px] font-black text-slate-800">动态画布</h2>
            <span className="text-[13px] text-slate-400">
              （画布里显示的内容就是实际页面呈现的内容）
            </span>
          </div>
          {/* 设备切换器（PC / 手机 / 左右并排） */}
          <div className="inline-flex h-11 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
            {[
              { key: 'desktop' as const, icon: Monitor, label: 'PC' },
              { key: 'mobile' as const, icon: Smartphone, label: '手机' },
            ].map((d) => (
              <button
                key={d.key}
                onClick={() => setDevice(d.key)}
                className={`
                  flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[12px] font-bold transition-all
                  ${device === d.key
                    ? 'bg-white text-slate-700 shadow-sm border border-slate-200/70'
                    : 'text-slate-400 hover:text-slate-600'
                  }
                `}
              >
                <d.icon className="w-4 h-4" />
                {d.label}
              </button>
            ))}
            <div className="w-px bg-slate-200 mx-0.5 my-2" />
            <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[12px] font-bold text-slate-400 hover:text-slate-600 transition-all">
              <ArrowLeftRight className="w-4 h-4" />
              切左右布局
            </button>
          </div>
        </div>

        {/* 画布内容区：带响应式 padding */}
        <div
          className={`
            bg-slate-50/60 p-8 space-y-4
            ${device === 'mobile' ? 'max-w-[420px] mx-auto' : ''}
          `}
        >
          {modules.map((m) => (
            <div key={m.key} onClick={() => setSelectedKey(m.key)}>
              <CollapsibleModule
                index={m.index}
                title={m.title}
                itemCount={m.itemCount}
                selected={selectedKey === m.key}
                defaultOpen={selectedKey === m.key}
              >
                <div
                  className={`space-y-6 ${device === 'mobile' ? '' : 'max-w-[88%]'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {m.fields.map((f, i) => (
                    <FormField
                      key={`${m.key}-${i}`}
                      label={f.label}
                      required={f.required}
                      placeholder={f.placeholder}
                      type={f.type}
                    />
                  ))}
                </div>
              </CollapsibleModule>
            </div>
          ))}

          {/* 空模块占位（演示折叠状态 Chevron 仍在最右） */}
          <CollapsibleModule
            index={4}
            title="体格检查（折叠状态）"
            itemCount={4}
            defaultOpen={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CollapsibleModuleDemo;
