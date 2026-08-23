/* eslint-disable react-hooks/purity */
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  Package2,
  Bot,
  ChevronLeft,
  ChevronRight,
  Edit,
  Download,
  Plus,
  Send,
  MoreHorizontal,
  Calendar,
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Image,
  Video,
  BookOpen,
  Megaphone,
  Sparkles,
  Copy,
  RefreshCw,
  Save,
  Paperclip,
  Check,
  FolderKanban,
} from 'lucide-react';
import type { Product, AssetCategory, FeedTag, MemberRole, WeeklyReport, TeamMember } from '../mock/productMock';
import { getProductById } from '../mock/productMock';
import CollapsibleModule from '../components/ui/CollapsibleModule';
import Tag from '../components/ui/Tag';
import StatusDot from '../components/ui/StatusDot';

type TabKey = 'overview' | 'phase' | 'weekly' | 'team' | 'asset' | 'ai';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: '概览', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'phase', label: '阶段', icon: <GitBranch className="w-5 h-5" /> },
  { key: 'weekly', label: '周报', icon: <CalendarCheck className="w-5 h-5" /> },
  { key: 'team', label: '团队', icon: <Users className="w-5 h-5" /> },
  { key: 'asset', label: '资产', icon: <Package2 className="w-5 h-5" /> },
  { key: 'ai', label: 'AI助手', icon: <Bot className="w-5 h-5" /> },
];

const PHASES: Product['phase'][] = ['概念期', '原型期', 'EVT', 'DVT', 'MP'];

const PHASE_TAG_COLOR: Record<
  Product['phase'],
  'phase-concept' | 'phase-prototype' | 'phase-evt' | 'phase-dvt' | 'phase-mp'
> = {
  概念期: 'phase-concept',
  原型期: 'phase-prototype',
  EVT: 'phase-evt',
  DVT: 'phase-dvt',
  MP: 'phase-mp',
};

const PHASE_DOT_META: Record<
  Product['phase'],
  { dot: string; ring: string; bar: string; dotCurrent: string; borderCurrent: string; label: string }
> = {
  概念期: {
    dot: 'bg-slate-600 text-white',
    ring: 'ring-slate-200',
    bar: 'bg-slate-500',
    dotCurrent: 'bg-white text-slate-700',
    borderCurrent: 'border-slate-500 ring-slate-100',
    label: 'text-slate-700',
  },
  原型期: {
    dot: 'bg-blue-600 text-white',
    ring: 'ring-blue-200',
    bar: 'bg-blue-600',
    dotCurrent: 'bg-white text-blue-700',
    borderCurrent: 'border-blue-600 ring-blue-100',
    label: 'text-blue-700',
  },
  EVT: {
    dot: 'bg-violet-600 text-white',
    ring: 'ring-violet-200',
    bar: 'bg-violet-600',
    dotCurrent: 'bg-white text-violet-700',
    borderCurrent: 'border-violet-600 ring-violet-100',
    label: 'text-violet-700',
  },
  DVT: {
    dot: 'bg-amber-600 text-white',
    ring: 'ring-amber-200',
    bar: 'bg-amber-500',
    dotCurrent: 'bg-white text-amber-700',
    borderCurrent: 'border-amber-600 ring-amber-100',
    label: 'text-amber-700',
  },
  MP: {
    dot: 'bg-emerald-600 text-white',
    ring: 'ring-emerald-200',
    bar: 'bg-emerald-600',
    dotCurrent: 'bg-white text-emerald-700',
    borderCurrent: 'border-emerald-600 ring-emerald-100',
    label: 'text-emerald-700',
  },
};

const FEED_TAG_COLOR: Record<FeedTag, string> = {
  进展: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  风险: 'bg-amber-50 text-amber-600 border-amber-200',
  问题: 'bg-red-50 text-red-600 border-red-200',
  里程碑: 'bg-blue-50 text-blue-600 border-blue-200',
};

const AVATAR_BG: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  orange: 'bg-orange-100 text-orange-600',
  violet: 'bg-violet-100 text-violet-600',
  purple: 'bg-purple-100 text-purple-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  sky: 'bg-sky-100 text-sky-600',
  rose: 'bg-rose-100 text-rose-600',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-600',
  pink: 'bg-pink-100 text-pink-600',
};

const ROLE_LABEL: Record<MemberRole, string> = {
  PM: '产品经理',
  PMO: '项目经理',
  QA: '质量负责人',
  硬件: '硬件工程师',
  算法: '算法工程师',
  软件: '软件工程师',
  测试: '测试工程师',
  结构: '结构工程师',
  工业设计: '工业设计师',
};

const ASSET_CATEGORY_META: Record<AssetCategory, { label: string; icon: React.ReactNode; color: string }> = {
  文档: { label: '产品文档', icon: <FileText className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  图片: { label: '产品图片', icon: <Image className="w-4 h-4" />, color: 'bg-violet-50 text-violet-600 border-violet-200' },
  视频: { label: '视频物料', icon: <Video className="w-4 h-4" />, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  手册: { label: '宣传手册', icon: <BookOpen className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  营销素材: { label: '营销素材', icon: <Megaphone className="w-4 h-4" />, color: 'bg-amber-50 text-amber-600 border-amber-200' },
};

const PHASE_TARGET_GRADIENT: Record<
  Product['phase'],
  { wrap: string; title: string; sub: string }
> = {
  概念期: { wrap: 'bg-gradient-to-br from-slate-700 to-slate-800', title: 'text-slate-100', sub: 'text-slate-300' },
  原型期: { wrap: 'bg-gradient-to-br from-blue-600 to-blue-700', title: 'text-blue-100', sub: 'text-blue-100' },
  EVT: { wrap: 'bg-gradient-to-br from-violet-600 to-violet-700', title: 'text-violet-100', sub: 'text-violet-100' },
  DVT: { wrap: 'bg-gradient-to-br from-amber-500 to-amber-600', title: 'text-amber-100', sub: 'text-amber-100' },
  MP: { wrap: 'bg-gradient-to-br from-emerald-600 to-emerald-700', title: 'text-emerald-100', sub: 'text-emerald-100' },
};

/* =========================================================
 * 概览 Tab
 * =======================================================*/
const OverviewTab: React.FC<{ product: Product }> = ({ product }) => {
  const phaseIndex = PHASES.indexOf(product.phase);
  const latestReport = product.reports[0];
  const targetGradient = PHASE_TARGET_GRADIENT[product.phase] ?? PHASE_TARGET_GRADIENT['原型期'];

  return (
    <div className="space-y-6">
      {/* 核心指标卡 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="阶段进度"
          value={`${product.keyMetrics.phaseProgress}%`}
          hint={`${product.phase} · 剩余 ${Math.ceil((100 - product.keyMetrics.phaseProgress) / 10)} 天`}
          icon={<TrendingUp className="w-4 h-4" />}
          accent="blue"
          progress={product.keyMetrics.phaseProgress}
        />
        <MetricCard
          label="文档完成率"
          value={`${product.keyMetrics.docCompletionRate}%`}
          hint="阶段必填文档"
          icon={<FileText className="w-4 h-4" />}
          accent="emerald"
          progress={product.keyMetrics.docCompletionRate}
        />
        <MetricCard
          label="风险项"
          value={product.keyMetrics.riskCount.toString()}
          hint={product.keyMetrics.riskCount > 0 ? '需关注缓解' : '当前无风险'}
          icon={<AlertTriangle className="w-4 h-4" />}
          accent={product.keyMetrics.riskCount > 0 ? 'amber' : 'slate'}
          progress={Math.min(product.keyMetrics.riskCount * 20, 100)}
        />
        <MetricCard
          label="最近周报"
          value={latestReport?.week ?? '--'}
          hint={product.keyMetrics.lastReportTime}
          icon={<Calendar className="w-4 h-4" />}
          accent="violet"
        />
      </div>

      {/* 最近动态 + 快捷入口 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最近动态 */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">最近动态</span>
              <span className="inline-flex items-center justify-center min-w-[2rem] px-2 h-5 rounded-md bg-slate-100 text-[11px] font-bold text-slate-500">
                {product.feeds.length}
              </span>
            </div>
            <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-600 transition-colors">
              <Plus className="w-3.5 h-3.5" /> 发布动态
            </button>
          </div>
          <div className="p-6 space-y-5 max-h-[420px] overflow-y-auto">
            {product.feeds.slice(0, 6).map((feed) => (
              <div key={feed.id} className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                    AVATAR_BG[feed.avatarColor] ?? 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {feed.author[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">{feed.author}</span>
                    <Tag color="slate">{ROLE_LABEL[feed.role]}</Tag>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${FEED_TAG_COLOR[feed.tag]}`}>
                      {feed.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-auto">{feed.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{feed.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧快捷卡 */}
        <div className="space-y-4">
          <div className={`${targetGradient.wrap} rounded-2xl p-5 text-white shadow-sm`}>
            <div className={`text-xs font-bold ${targetGradient.title} mb-1`}>当前阶段目标</div>
            <div className="text-base font-black leading-snug mb-3">
              {product.phases[phaseIndex]?.target ?? '--'}
            </div>
            <div className={`flex items-center gap-2 text-xs ${targetGradient.sub}`}>
              <Calendar className="w-3.5 h-3.5" />
              {product.phases[phaseIndex]?.startDate} ~ {product.phases[phaseIndex]?.endDate}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">快捷操作</div>
            {[
              { icon: <Plus className="w-4 h-4" />, label: '发布动态', color: 'hover:bg-blue-50 hover:text-blue-600' },
              { icon: <FileText className="w-4 h-4" />, label: '上传文档', color: 'hover:bg-emerald-50 hover:text-emerald-600' },
              { icon: <Sparkles className="w-4 h-4" />, label: '生成周报', color: 'hover:bg-violet-50 hover:text-violet-600' },
              { icon: <Bot className="w-4 h-4" />, label: 'AI 生成材料', color: 'hover:bg-amber-50 hover:text-amber-600' },
            ].map((action) => (
              <button
                key={action.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 transition-colors ${action.color}`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>

          {latestReport && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800">{latestReport.week} 周报</span>
                <span className="text-[11px] text-slate-400">{latestReport.generateTime}</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-emerald-600">● 进展 </span>
                  {latestReport.progress[0]}
                  {latestReport.progress.length > 1 && (
                    <span className="text-slate-400"> 等{latestReport.progress.length}项</span>
                  )}
                </div>
                {latestReport.risks.length > 0 && (
                  <div>
                    <span className="font-bold text-amber-600">● 风险 </span>
                    {latestReport.risks[0]}
                    {latestReport.risks.length > 1 && (
                      <span className="text-slate-400"> 等{latestReport.risks.length}项</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
 * 阶段 Tab
 * =======================================================*/
const PhaseTab: React.FC<{ product: Product }> = ({ product }) => {
  const phaseIndex = PHASES.indexOf(product.phase);
  const [expandedPhase, setExpandedPhase] = useState<number>(phaseIndex);
  const currentPhaseMeta = PHASE_DOT_META[product.phase];

  return (
    <div className="space-y-6">
      {/* 顶部：生命周期 5 阶段时间轴大卡 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">产品生命周期</span>
            <span className="text-xs text-slate-400">共 5 个阶段 · 当前 {product.phase}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-200">
            <GitBranch className="w-3.5 h-3.5 text-slate-500" />
            阶段文档完成度
            <b className="text-slate-800 ml-0.5">
              {product.phases
                .reduce(
                  (acc, ph) => {
                    const req = ph.docs.filter((d) => d.required).length;
                    const up = ph.docs.filter((d) => d.required && d.uploaded).length;
                    return { up: acc.up + up, req: acc.req + req };
                  },
                  { up: 0, req: 0 },
                )
                .up}
              /
              {product.phases.reduce(
                (acc, ph) => acc + ph.docs.filter((d) => d.required).length,
                0,
              )}
            </b>
          </div>
        </div>
        <div className="relative">
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200" />
          <div
            className={`absolute top-6 left-0 h-0.5 ${currentPhaseMeta.bar} transition-all duration-500`}
            style={{ width: `calc(${(phaseIndex + 0.5) * (100 / PHASES.length)}% )` }}
          />
          <div className="relative grid grid-cols-5 gap-2">
            {PHASES.map((phase, idx) => {
              const done = idx < phaseIndex;
              const current = idx === phaseIndex;
              const meta = PHASE_DOT_META[phase];
              const docs = product.phases[idx]?.docs ?? [];
              const reqTotal = docs.filter((d) => d.required).length;
              const reqDone = docs.filter((d) => d.required && d.uploaded).length;
              return (
                <div
                  key={phase}
                  className="flex flex-col items-center text-center"
                  onClick={() => setExpandedPhase(idx)}
                >
                  <div
                    className={`
                      relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all cursor-pointer
                      ${done ? meta.dot : ''}
                      ${current ? `bg-white ${meta.dotCurrent} ring-4 ${meta.borderCurrent} border-2` : ''}
                      ${!done && !current ? 'bg-white text-slate-400 border-2 border-slate-200 hover:border-slate-300' : ''}
                    `}
                  >
                    {done ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-xs font-black">{idx + 1}</span>
                    )}
                  </div>
                  <div
                    className={`
                      text-sm font-bold mb-0.5
                      ${done || current ? meta.label : 'text-slate-400'}
                      ${current ? 'animate-pulse' : ''}
                    `}
                  >
                    {phase}
                  </div>
                  <div className="text-[11px] text-slate-400 mb-1">
                    {product.phases[idx]?.startDate ?? '--'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    文档 <b className="text-slate-700">{reqDone}</b>/{reqTotal}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {product.phases.map((phase, idx) => {
        const done = idx < phaseIndex;
        const current = idx === phaseIndex;
        const pending = idx > phaseIndex;
        const docs = phase.docs;
        const meta = PHASE_DOT_META[phase.phase];
        const requiredUploaded = docs.filter((d) => d.required && d.uploaded).length;
        const requiredTotal = docs.filter((d) => d.required).length;
        const docRate = requiredTotal > 0 ? Math.round((requiredUploaded / requiredTotal) * 100) : 0;
        const isOpen = expandedPhase === idx;

        return (
          <div
            key={phase.phase}
            className={`
              bg-white rounded-2xl shadow-sm border transition-all overflow-hidden
              ${current ? `border-slate-200 ring-2 ${meta.ring}` : 'border-slate-100'}
              ${pending ? 'opacity-60' : ''}
            `}
          >
            <div
              className="flex items-center gap-4 px-6 py-4 cursor-pointer select-none"
              onClick={() => setExpandedPhase(isOpen ? -1 : idx)}
            >
              {/* 状态圆点 */}
              <div
                className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  ${done ? meta.dot : ''}
                  ${current ? `bg-white ${meta.dotCurrent} border-2` : ''}
                  ${pending ? 'bg-white text-slate-400 border-2 border-slate-200' : ''}
                `}
              >
                {done ? <Check className="w-5 h-5" /> : <span className="text-xs font-black">{idx + 1}</span>}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-base font-black ${done || current ? meta.label : 'text-slate-600'}`}>
                    {phase.phase}
                  </span>
                  {current && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                        phase.phase === '概念期'
                          ? 'bg-slate-50 text-slate-700 border-slate-300'
                          : phase.phase === '原型期'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : phase.phase === 'EVT'
                          ? 'bg-violet-50 text-violet-700 border-violet-300'
                          : phase.phase === 'DVT'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          phase.phase === '概念期'
                            ? 'bg-slate-600'
                            : phase.phase === '原型期'
                            ? 'bg-blue-600'
                            : phase.phase === 'EVT'
                            ? 'bg-violet-600'
                            : phase.phase === 'DVT'
                            ? 'bg-amber-600'
                            : 'bg-emerald-600'
                        }`}
                      />
                      当前阶段
                    </span>
                  )}
                  {done && phase.reviewStatus === '已通过' && <Tag color="emerald">评审通过</Tag>}
                </div>
                <div className="text-xs text-slate-400">
                  {phase.startDate} ~ {phase.endDate} · 目标完成度 {done ? 100 : current ? product.keyMetrics.phaseProgress : 0}%
                </div>
              </div>

              {/* 文档进度条 */}
              <div className="hidden md:flex flex-col items-end gap-1 w-56 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">必填文档</span>
                  <span className="text-xs font-bold text-slate-800">
                    {requiredUploaded}/{requiredTotal}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      docRate === 100 ? 'bg-emerald-500' : docRate > 50 ? meta.bar : 'bg-amber-500'
                    }`}
                    style={{ width: `${docRate}%` }}
                  />
                </div>
              </div>

              {/* 操作区 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {current && (
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className={`px-3 py-1.5 rounded-lg hover:opacity-90 text-white text-xs font-bold shadow-sm ${meta.bar}`}
                  >
                    发起阶段评审
                  </button>
                )}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="border-t border-slate-100 bg-slate-50/30 px-6 py-6 space-y-5 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <InfoBlock title="阶段目标" icon={<TrendingUp className="w-4 h-4" />}>
                    <p className="text-sm text-slate-600 leading-relaxed">{phase.target}</p>
                  </InfoBlock>
                  <InfoBlock title="入口条件" icon={<CheckCircle2 className="w-4 h-4" />}>
                    {phase.entryConditions.length > 0 ? (
                      <ul className="space-y-1">
                        {phase.entryConditions.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-slate-400">--</span>
                    )}
                  </InfoBlock>
                  <InfoBlock title="出口条件" icon={<AlertTriangle className="w-4 h-4" />}>
                    {phase.exitConditions.length > 0 ? (
                      <ul className="space-y-1">
                        {phase.exitConditions.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded border border-slate-300" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-slate-400">--</span>
                    )}
                  </InfoBlock>
                </div>

                <CollapsibleModule
                  title="阶段文档清单"
                  itemCount={docs.length}
                  draggable={false}
                  defaultOpen
                >
                  <div className="space-y-2">
                    {docs.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div
                          className={`
                            flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
                            ${doc.uploaded ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}
                          `}
                        >
                          {doc.uploaded && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800">{doc.name}</span>
                            {doc.required && <Tag color="red">必填</Tag>}
                          </div>
                          {doc.uploaded && (
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {doc.uploader} 上传于 {doc.uploadTime}
                            </div>
                          )}
                        </div>
                        {doc.uploaded ? (
                          <button className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 border border-slate-200">
                            预览 / 下载
                          </button>
                        ) : (
                          <button className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-600 border border-blue-200">
                            <Plus className="w-3.5 h-3.5 inline mr-1" />上传
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleModule>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================
 * 周报 Tab（汇总优先）
 * =======================================================*/
const WeeklyTab: React.FC<{ product: Product }> = ({ product }) => {
  const reports = product.reports;
  const [selIdx, setSelIdx] = useState(0);
  const cur = reports[selIdx];

  const memberHighlights = useMemo(() => {
    if (!cur) return [];
    return product.team.map((m) => ({
      member: m,
      highlights: pickMemberHighlights(cur, m, 'progress'),
      risks: pickMemberHighlights(cur, m, 'risks'),
      next: pickMemberHighlights(cur, m, 'nextPlan'),
    }));
  }, [cur, product.team]);

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
        <CalendarCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" strokeWidth={1.3} />
        <div className="text-lg font-black text-slate-500 mb-1">暂无可读的周报</div>
        <div className="text-sm text-slate-400">AI 会在每周一 09:00 自动汇总上周项目进展生成周报</div>
      </div>
    );
  }

  const riskCount = (cur?.risks ?? []).length;
  const progressCount = (cur?.progress ?? []).length;
  const nextCount = (cur?.nextPlan ?? []).length;

  return (
    <div className="space-y-6">
      {/* 顶部：周切换工具条 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500">选择周次</span>
          {reports.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setSelIdx(i)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                i === selIdx
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {r.week}
              {i === 0 && <span className="ml-1.5 text-[10px] opacity-80">最新</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500">
            生成时间 <b className="text-slate-700">{cur?.generateTime}</b>
          </span>
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            重新生成
          </button>
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-sm">
            <Download className="w-3.5 h-3.5" />
            导出 PDF
          </button>
        </div>
      </div>

      {/* 主卡：全组周报请阅读 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-800">
                {cur?.week} 全组周报请阅读
              </div>
              <div className="text-xs text-slate-500">
                AI 基于 团队动态 + 阶段文档上传记录 + 已完成任务 自动汇总生成
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              进展 {progressCount}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${
              riskCount > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              风险 {riskCount}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
              下周 {nextCount}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-slate-100">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">本周进展</span>
            </div>
            <ul className="space-y-2.5">
              {cur?.progress.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-black text-amber-700 uppercase tracking-wider">风险 & 阻塞</span>
            </div>
            {(cur?.risks ?? []).length === 0 ? (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-slate-50 text-slate-500 text-sm">
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                本周无风险项，项目整体健康推进。
              </div>
            ) : (
              <ul className="space-y-2.5">
                {cur?.risks.map((r, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-black text-blue-700 uppercase tracking-wider">下周计划</span>
            </div>
            <ul className="space-y-2.5">
              {cur?.nextPlan.map((n, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 辅网格：成员各自的本周亮点 / 风险 / 下周计划小卡 */}
      <CollapsibleModule
        title={`${cur?.week} · 成员周报概览`}
        itemCount={memberHighlights.length}
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {memberHighlights.map(({ member, highlights, risks, next }) => (
            <div
              key={member.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/40 overflow-hidden hover:border-slate-200 transition-colors"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white">
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black ${
                    AVATAR_BG[member.avatarColor] ?? 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {member.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-slate-800 truncate">{member.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <Tag color="slate">{member.role}</Tag>
                    <span>{member.dept}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-[11px] font-black text-emerald-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 本周亮点
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {highlights.length > 0
                      ? highlights.map((h, i) => <div key={i} className="mb-0.5">· {h}</div>)
                      : <span className="text-slate-400">AI 未抽取到该成员独立亮点条目</span>}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-black text-amber-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> 风险项
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {risks.length > 0
                      ? risks.map((r, i) => <div key={i} className="mb-0.5">· {r}</div>)
                      : <span className="text-slate-400">本周无风险上报</span>}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-black text-blue-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 下周计划
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {next.length > 0
                      ? next.map((n, i) => <div key={i} className="mb-0.5">· {n}</div>)
                      : <span className="text-slate-400">暂无独立计划条目，待周会对齐</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleModule>
    </div>
  );
};

function pickMemberHighlights(
  report: WeeklyReport | undefined,
  member: TeamMember,
  bucket: 'progress' | 'risks' | 'nextPlan',
): string[] {
  if (!report) return [];
  const pool = report[bucket] ?? [];
  const keys = [member.name, member.dept, member.role];
  // 包含成员姓名/部门/角色的条目优先归属给该成员；不够 1 条时按 hash 轮询分配避免为空
  const matched = pool.filter((s) => keys.some((k) => k && s.includes(k)));
  if (matched.length > 0) return matched;
  // 按成员 id hash 轮询分配
  const idx =
    Math.abs([...member.id].reduce((acc, c) => acc + c.charCodeAt(0), 0)) % Math.max(pool.length, 1);
  // 成员间去重：每个桶给当前成员 1 条
  if (pool.length === 0) return [];
  const pick: string[] = [];
  pick.push(pool[(idx + bucket.length + member.id.length) % pool.length]);
  return pick;
}

/* =========================================================
 * 团队 Tab
 * =======================================================*/
const TeamTab: React.FC<{ product: Product }> = ({ product }) => {
  const grouped = useMemo(() => {
    const map = new Map<string, Product['team']>();
    for (const m of product.team) {
      if (!map.has(m.dept)) map.set(m.dept, []);
      map.get(m.dept)!.push(m);
    }
    return Array.from(map.entries());
  }, [product.team]);

  const coreRoles = [
    { key: 'PM' as MemberRole, name: product.pm, title: '产品经理' },
    { key: 'PMO' as MemberRole, name: product.pmo, title: '项目经理 / PMO' },
    { key: 'QA' as MemberRole, name: product.qa, title: '质量负责人' },
  ];
  const coreMembers = coreRoles
    .map((cr) => product.team.find((m) => m.role === cr.key && m.name === cr.name) ?? product.team.find((m) => m.role === cr.key))
    .filter((m): m is NonNullable<typeof m> => !!m);

  return (
    <div className="space-y-6">
      {/* 核心角色卡 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coreMembers.map((m, i) => (
          <div
            key={m.id}
            className={`
              relative bg-white rounded-2xl shadow-sm border p-6 overflow-hidden
              ${i === 0 ? 'border-blue-200' : i === 1 ? 'border-indigo-200' : 'border-emerald-200'}
            `}
          >
            <div
              className={`
                absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10
                ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-indigo-600' : 'bg-emerald-600'}
              `}
            />
            <div className="relative flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black ${
                  AVATAR_BG[m.avatarColor] ?? 'bg-slate-100 text-slate-600'
                }`}
              >
                {m.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-lg font-black text-slate-800">{m.name}</span>
                </div>
                <div className="text-xs font-bold text-slate-500 mb-3">{ROLE_LABEL[m.role]} · {m.dept}</div>
                <div className="space-y-1 text-xs text-slate-500">
                  {m.phone && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">📱</span>
                      <span>{m.phone}</span>
                    </div>
                  )}
                  {m.email && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">✉️</span>
                      <span className="truncate">{m.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 参战部门分组 */}
      <div className="space-y-4">
        {grouped.map(([dept, members]) => (
          <CollapsibleModule
            key={dept}
            title={dept}
            itemCount={members.length}
            draggable={false}
            defaultOpen
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="group relative rounded-xl border border-slate-100 p-4 bg-white hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${
                        AVATAR_BG[m.avatarColor] ?? 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-800 truncate">{m.name}</div>
                      <div className="text-[11px] text-slate-400">{ROLE_LABEL[m.role]}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    {m.phone ? (
                      <>
                        <span>📱</span>
                        <span className="truncate">{m.phone}</span>
                      </>
                    ) : (
                      <span>--</span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleModule>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 border border-slate-200 shadow-sm">
          <Download className="w-4 h-4" /> 导出团队通讯录
        </button>
      </div>
    </div>
  );
};

/* =========================================================
 * 资产 Tab
 * =======================================================*/
const AssetTab: React.FC<{ product: Product }> = ({ product }) => {
  const categories: AssetCategory[] = ['文档', '图片', '视频', '手册', '营销素材'];
  const [activeCategory, setActiveCategory] = useState<AssetCategory | 'all'>('all');

  const filtered = useMemo(
    () => (activeCategory === 'all' ? product.assets : product.assets.filter((a) => a.category === activeCategory)),
    [product.assets, activeCategory]
  );

  return (
    <div className="space-y-4">
      {/* 筛选工具栏 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryChip
            label="全部"
            count={product.assets.length}
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {categories.map((c) => {
            const count = product.assets.filter((a) => a.category === c).length;
            return (
              <CategoryChip
                key={c}
                label={ASSET_CATEGORY_META[c].label}
                icon={ASSET_CATEGORY_META[c].icon}
                count={count}
                active={activeCategory === c}
                onClick={() => setActiveCategory(c)}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              placeholder="搜索文件名..."
              className="w-56 h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button className="h-9 px-4 rounded-xl bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 border border-slate-200">
            筛选
          </button>
          <button className="h-9 inline-flex items-center gap-1.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm">
            <Plus className="w-4 h-4" /> 批量上传
          </button>
        </div>
      </div>

      {(['图片', '视频', '手册', '营销素材'].includes(activeCategory) || activeCategory === 'all') &&
        filtered.some((a) => a.thumbnail || a.category === '图片' || a.category === '视频' || a.category === '手册' || a.category === '营销素材') && (
          <CollapsibleModule title="视觉物料展示墙" itemCount={filtered.filter((a) => a.thumbnail).length} draggable={false} defaultOpen>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered
                .filter((a) => a.category === '图片' || a.category === '视频' || a.category === '手册' || a.category === '营销素材')
                .map((asset) => (
                  <div
                    key={asset.id}
                    className="group relative rounded-xl overflow-hidden border border-slate-100 bg-white hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                      {asset.thumbnail ? (
                        <img
                          src={asset.thumbnail}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : asset.category === '视频' ? (
                        <div className="w-full h-full bg-gradient-to-br from-rose-100 to-rose-200 flex flex-col items-center justify-center text-rose-500">
                          <Video className="w-10 h-10 mb-1" />
                          <span className="text-xs font-bold">{asset.fileType ?? 'MP4'}</span>
                          {asset.size && <span className="text-[10px] mt-0.5 opacity-70">{asset.size}</span>}
                        </div>
                      ) : asset.category === '手册' ? (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex flex-col items-center justify-center text-emerald-600">
                          <BookOpen className="w-10 h-10 mb-1" />
                          <span className="text-xs font-bold">PDF 手册</span>
                          {asset.size && <span className="text-[10px] mt-0.5 opacity-70">{asset.size}</span>}
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex flex-col items-center justify-center text-amber-600">
                          <Megaphone className="w-10 h-10 mb-1" />
                          <span className="text-xs font-bold">{asset.subCategory ?? '营销素材'}</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-md bg-black/40 backdrop-blur text-[10px] font-bold text-white">
                        {ASSET_CATEGORY_META[asset.category].label}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <button className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-sm">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-bold text-slate-800 truncate mb-1">{asset.name}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{asset.uploader}</span>
                        <span>{asset.uploadTime.slice(5)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CollapsibleModule>
        )}

      {/* 文件列表 */}
      <CollapsibleModule title="文件列表" itemCount={filtered.length} draggable={false} defaultOpen>
        <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">文件名</th>
                <th className="px-4 py-3 font-semibold">分类</th>
                <th className="px-4 py-3 font-semibold">类型</th>
                <th className="px-4 py-3 font-semibold">大小</th>
                <th className="px-4 py-3 font-semibold">上传人</th>
                <th className="px-4 py-3 font-semibold">时间</th>
                <th className="px-4 py-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((asset) => {
                const meta = ASSET_CATEGORY_META[asset.category];
                return (
                  <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center border ${meta.color}`}>
                          {meta.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-800 truncate">{asset.name}</div>
                          {asset.subCategory && <div className="text-[11px] text-slate-400">{asset.subCategory}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{asset.fileType ?? '--'}</td>
                    <td className="px-4 py-3 text-slate-600">{asset.size ?? '--'}</td>
                    <td className="px-4 py-3 text-slate-600">{asset.uploader}</td>
                    <td className="px-4 py-3 text-slate-400">{asset.uploadTime}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button className="px-2.5 py-1.5 rounded-md bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600">
                          预览
                        </button>
                        <button className="px-2.5 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-600">
                          下载
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                    当前分类暂无资产文件
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CollapsibleModule>
    </div>
  );
};

/* =========================================================
 * AI 助手 Tab
 * =======================================================*/
interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  scene?: string;
}

const AIChatTab: React.FC<{ product: Product }> = ({ product }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: `您好！我是 **${product.shortName ?? product.name}** 的 AI 助手。我已读取该产品的知识库（共 ${product.assets.length} 份资产 + ${product.reports.length} 份周报 + 团队动态）。\n\n您可以：\n- 从左侧选择场景模板，一键生成标准化材料\n- 或直接在下方输入任意需求，我会基于产品知识库为您定制输出`,
    },
  ]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleSceneClick = (sceneName: string, promptTemplate: string): void => {
    const prompt = promptTemplate || `请基于【${product.shortName ?? product.name}】的产品知识库，生成一份【${sceneName}】材料。`;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: prompt,
      scene: sceneName,
    };
    setMessages((prev) => [...prev, userMsg]);
    runGenerate(prompt, sceneName);
  };

  const handleSend = (): void => {
    if (!input.trim() || generating) return;
    const text = input.trim();
    setInput('');
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    runGenerate(text);
  };

  const runGenerate = (_prompt: string, scene?: string): void => {
    setGenerating(true);
    setTimeout(() => {
      const demoContent = buildDemoContent(product, scene);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'ai', content: demoContent, scene },
      ]);
      setGenerating(false);
    }, 1200);
  };

  return (
    <div className="h-full w-full grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
      {/* 左侧场景 */}
      <div className="lg:col-span-1 h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">AI 材料生成</div>
          <div className="text-sm font-black text-slate-800">场景模板库</div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          <div className="space-y-2">
            {product.aiScenes.map((scene) => {
              const isCustom = scene.id === 's6';
              return (
                <button
                  key={scene.id}
                  onClick={() => handleSceneClick(scene.name, scene.prompt)}
                  className={`
                    w-full text-left rounded-xl border p-4 transition-all group
                    ${isCustom
                      ? 'border-dashed border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300'
                      : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                        ${isCustom ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}
                      `}
                    >
                      {isCustom ? <Sparkles className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-slate-800 mb-0.5">{scene.name}</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">{scene.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="text-[11px] font-bold text-slate-500 mb-1.5">知识库来源</div>
          <div className="flex flex-wrap gap-1">
            {[
              { label: '文档', count: product.assets.filter((a) => a.category === '文档').length },
              { label: '图片', count: product.assets.filter((a) => a.category === '图片').length },
              { label: '周报', count: product.reports.length },
              { label: '动态', count: product.feeds.length },
            ].map((s) => (
              <span key={s.label} className="inline-flex items-center px-2 py-0.5 rounded-md bg-white text-[10px] font-bold text-slate-600 border border-slate-200">
                {s.label} · {s.count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧对话区：严格 h-full flex-col，中间消息区独立滚动，输入框永远底部可见 */}
      <div className="lg:col-span-3 h-full bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-800">{product.shortName ?? product.name} · 知识库 AI</div>
              <div className="text-[11px] text-slate-400">基于 {product.assets.length + product.reports.length} 份材料 · 回答仅供参考</div>
            </div>
          </div>
          <button className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* 消息区：独立 overflow-y-auto，不影响外部页面 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 bg-slate-50/30">
          {messages.map((m) => (
            <div key={m.id} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`
                  flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                  ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600'}
                `}
              >
                {m.role === 'user' ? <Users className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[75%] ${m.role === 'user' ? 'items-end' : ''}`}>
                {m.scene && (
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold mb-1.5 border ${
                    m.role === 'user'
                      ? 'bg-blue-50 text-blue-600 border-blue-200 ml-auto'
                      : 'bg-violet-50 text-violet-600 border-violet-200'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    场景：{m.scene}
                  </div>
                )}
                <div
                  className={`
                    rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
                    ${m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm shadow-sm'
                    }
                  `}
                >
                  {m.content}
                </div>
                {m.role === 'ai' && (
                  <div className="flex items-center gap-1 mt-2">
                    <button className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-500 border border-slate-200">
                      <Copy className="w-3 h-3" /> 复制
                    </button>
                    <button className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-500 border border-slate-200">
                      <RefreshCw className="w-3 h-3" /> 重新生成
                    </button>
                    <button className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-[11px] font-bold text-blue-600 border border-blue-200">
                      <Save className="w-3 h-3" /> 存入资产库
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {generating && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 text-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-100 shadow-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-slate-400 ml-2">AI 正在基于知识库生成材料...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 输入区：flex-shrink-0，永远贴在底部、可见 */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white flex-shrink-0">
          <div className="flex items-end gap-2">
            <button className="h-11 w-11 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                placeholder="输入您的需求... (Enter 发送 / Shift+Enter 换行)"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-12 text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || generating}
              className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold shadow-sm flex items-center gap-2 flex-shrink-0"
            >
              <Send className="w-4 h-4" /> 发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
 * 辅助子组件
 * =======================================================*/
const MetricCard: React.FC<{
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  accent: 'blue' | 'emerald' | 'amber' | 'violet' | 'slate';
  progress?: number;
}> = ({ label, value, hint, icon, accent, progress }) => {
  const accentMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600 text-blue-600',
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-600',
    amber: 'from-amber-500 to-amber-600 text-amber-600',
    violet: 'from-violet-500 to-violet-600 text-violet-600',
    slate: 'from-slate-400 to-slate-500 text-slate-600',
  };
  const [from, to, text] = accentMap[accent].split(' ');
  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 p-5 overflow-hidden">
      <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br ${from} ${to} opacity-10`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
          <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center ${text}`}>{icon}</div>
        </div>
        <div className="text-3xl font-black text-slate-800 tabular-nums mb-1">{value}</div>
        {hint && <div className="text-[11px] text-slate-400 mb-2">{hint}</div>}
        {progress !== undefined && (
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden mt-3">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${from} ${to} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const InfoBlock: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl border border-slate-100 p-4">
    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-50">
      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">{icon}</div>
      <span className="text-sm font-black text-slate-800">{title}</span>
    </div>
    {children}
  </div>
);

const CategoryChip: React.FC<{
  label: string;
  count: number;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}> = ({ label, count, active, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`
      inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold border transition-all
      ${active
        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
      }
    `}
  >
    {icon}
    {label}
    <span
      className={`
        inline-flex items-center justify-center min-w-[1.75rem] px-1.5 h-5 rounded-md text-[11px] font-bold
        ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}
      `}
    >
      {count}
    </span>
  </button>
);

const buildDemoContent = (product: Product, scene?: string): string => {
  const name = product.shortName ?? product.name;
  if (!scene) {
    return `已收到您的问题。基于【${name}】的最新资料，简要回答如下：\n\n1. 当前阶段：${product.phase}（进度 ${product.keyMetrics.phaseProgress}%）\n2. 产品经理：${product.pm}，团队共 ${product.team.length} 人\n3. 最新周报：${product.reports[0]?.week ?? '--'}，进展 ${product.reports[0]?.progress.length ?? 0} 项\n4. 知识库资产：${product.assets.length} 份文件\n\n如需更详细的内容，请选择左侧【场景模板】或进一步明确您的需求。`;
  }
  if (scene.includes('领导') || scene.includes('汇报')) {
    return `# ${name} · 向领导汇报材料\n**汇报周期**：${product.reports[0]?.week ?? '--'}  **汇报人**：${product.pm}\n\n---\n\n## 一、产品底座（通用能力，已具备/在推进）\n${product.reports[0]?.progress.slice(0, 3).map((p, i) => `${i + 1}. ✅ ${p}`).join('\n') ?? '（暂无）'}\n\n## 二、样板场景（${product.phase}）\n> **阶段目标**：${product.phases[PHASES.indexOf(product.phase)]?.target ?? '--'}\n\n当前文档完成率 **${product.keyMetrics.docCompletionRate}%**，阶段进度 **${product.keyMetrics.phaseProgress}%**，推进中。\n\n## 三、商务与客户推进\n- 核心推进：已对接 ${product.depts.length} 个参战部门协同\n- 里程碑：${product.feeds.filter((f) => f.tag === '里程碑').length} 项里程碑完成（本月）\n\n## 四、风险与缓解\n${product.keyMetrics.riskCount > 0 && product.reports[0]?.risks.length ? product.reports[0].risks.map((r, i) => `${i + 1}. ⚠️ ${r}`).join('\n') : '- 当前无重大风险'}\n\n## 五、下一阶段里程碑（30天）\n${product.reports[0]?.nextPlan.slice(0, 3).map((p, i) => `${i + 1}. 🎯 ${p}`).join('\n') ?? '（略）'}\n\n---\n_材料生成时间：${new Date().toLocaleString('zh-CN')}_`;
  }
  if (scene.includes('售前') || scene.includes('客户')) {
    return `# ${name} · 售前沟通材料\n\n## 🎯 一句话定位\n> ${product.oneLiner}\n\n## ✨ 核心产品亮点（5条）\n1. **零布线、分钟级部署**：显著降低部署门槛与时间成本\n2. **低功耗长航时值守**：降低现场维护频次\n3. **事件驱动告警**：输出"事件+证据"，而非持续视频流\n4. **端侧智能复核取证**：告警可核查、可追溯、可验收\n5. **可伪装形态可选**：适配野外/边境等高对抗场景\n\n## 🆚 与市场标品差异化\n\n| 维度 | 市场标品做法 | ${name} 主张 |\n|------|--------------|----------|\n| 核心输出 | 视频流/录像为核心 | **事件 + 证据 + 态势汇聚 + 处置闭环** |\n| 部署方式 | 固定安装/布线 | **零布线、分钟级布撒、单兵可部署** |\n| 功耗模型 | 持续采集，电耗高 | **事件驱动，低功耗值守** |\n\n## 🎬 典型场景\n- 边境防控 / 周界侦察（样板优先）\n- 要地 / 重点目标警戒\n- 重要设施保护（电站 / 通信 / 油气）\n\n## 🤝 建议下一步沟通议题\n1. 客户是否需要**演示样机**？可安排现场测试\n2. 场景中**验收口径**是否已有初步标准？\n3. 交付时间表与采购节奏（Q3/Q4）？\n\n_（若需补充客户名称/具体项目背景，我可进一步定制）_`;
  }
  if (scene.includes('外部宣传') || scene.includes('展会') || scene.includes('通俗')) {
    return `# ${name}\n## 不是普通监控，是**事件驱动的无人值守侦察装备**\n\n🌄 **一个真实场景**：\n在边境一处人迹罕至的山谷，战士背上 5kg 的单兵背包，10 分钟内快速布撒 8 个节点，然后撤离。\n\n连续 90 天，无需人工干预：有人靠近 → 端侧识别 → 平板实时告警 → 证据照片自动上传 → 指挥中心快速处置。\n\n✅ 解决了什么问题？\n1. **"看不见"**：传统监控布线难、部署慢，很多地方根本"装不上"\n2. **"看不过来"**：传统监控要人盯屏，事件驱动的告警直接告诉你"哪里出了什么事"\n3. **"维护不起"**：低功耗长航时，90 天以上才换一次电池\n\n💡 这就是 **${name}**：\n把"重部署、重布线、重盯屏"变成"单兵快速布撒 + 事件告警 + 平板态势汇聚"，让警戒真正到达每一个需要它的角落。\n\n_适用于官网首页 / 公众号推文 / 展会解说词_`;
  }
  // 默认
  return `# ${name} · ${scene}\n\n基于知识库已生成 ${scene} 相关材料示例（共 3 段，约 500 字）。\n\n如果需要更贴合具体项目/客户/时间的版本，请在下方补充：\n- 具体客户名称 & 行业\n- 关心的核心指标 / 验收口径\n- 篇幅与格式要求（几页？PPT/Word/文案？）\n\n我会进一步精修输出。`;
};

/* =========================================================
 * 主页面
 * =======================================================*/
const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const [tab, setTab] = useState<TabKey>('overview');

  // 顶部图片轮播
  const carouselImages = useMemo<string[]>(() => {
    if (!product) return [];
    const fromAssets = product.assets
      .filter((a) => a.category === '图片' && a.thumbnail)
      .map((a) => a.thumbnail as string);
    if (fromAssets.length > 0) return fromAssets;
    if (product.coverImage) return [product.coverImage];
    return [];
  }, [product]);
  const [carouselIdx, setCarouselIdx] = useState(0);

  if (!product) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex flex-col items-center">
          <FolderKanban className="w-16 h-16 text-slate-300 mb-4" />
          <div className="text-lg font-black text-slate-500 mb-2">产品不存在或已下线</div>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm"
          >
            返回产品大盘
          </button>
        </div>
      </div>
    );
  }

  const coreRoles = [
    { key: 'PM' as MemberRole, name: product.pm, title: '产品经理', accent: 'from-blue-500 to-blue-600', ring: 'ring-blue-100' },
    { key: 'PMO' as MemberRole, name: product.pmo, title: '项目经理 / PMO', accent: 'from-indigo-500 to-indigo-600', ring: 'ring-indigo-100' },
    { key: 'QA' as MemberRole, name: product.qa, title: '质量负责人 / QA', accent: 'from-emerald-500 to-emerald-600', ring: 'ring-emerald-100' },
  ];
  const coreMembers = coreRoles
    .map((cr) => {
      const member =
        product.team.find((m) => m.role === cr.key && m.name === cr.name) ??
        product.team.find((m) => m.role === cr.key);
      return member ? { ...cr, member } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* ============= 顶部产品卡（纯白背景 + 左轮播 右信息） ============= */}
      <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 flex gap-6 items-stretch">
          {/* 左：图片轮播 4:3 */}
          <div className="w-[42%] max-w-[400px] flex-shrink-0">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
              {carouselImages.length > 0 ? (
                <>
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      backgroundImage: `url(${carouselImages[carouselIdx]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  {carouselImages.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCarouselIdx((i) => (i - 1 + carouselImages.length) % carouselImages.length)
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-600 shadow-sm border border-slate-200 flex items-center justify-center transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCarouselIdx((i) => (i + 1) % carouselImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-600 shadow-sm border border-slate-200 flex items-center justify-center transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        {carouselImages.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCarouselIdx(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              i === carouselIdx ? 'w-5 bg-white shadow-sm' : 'bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute right-3 bottom-3 px-2 py-0.5 rounded-md bg-black/40 text-white text-[11px] font-bold">
                        {carouselIdx + 1} / {carouselImages.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Package2 className="w-14 h-14" strokeWidth={1.3} />
                  <span className="text-xs font-bold text-slate-500">暂无产品图片</span>
                </div>
              )}
            </div>
          </div>

          {/* 右：信息区 */}
          <div className="flex-1 min-w-0 flex flex-col relative">
            {/* 右上角 Action 横排 */}
            <div className='flex justify-between'>
              {/* 返回链接 */}
              <div className="mt-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 font-bold transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> 返回产品大盘
                </Link>
              </div>
              <div className="flex items-center justify-end gap-2 flex-shrink-0">
                <button className="h-9 w-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200 transition-colors" title="下载资料包">
                  <Download className="w-4 h-4" />
                </button>
                <button className="h-9 inline-flex items-center gap-1.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 border border-slate-200 shadow-sm transition-colors">
                  <Edit className="w-4 h-4" /> 编辑信息
                </button>
                <button className="h-9 inline-flex items-center gap-1.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors">
                  <Sparkles className="w-4 h-4" /> AI 生成材料
                </button>
              </div>
            </div>
            {/* 产品主标题 + 状态 */}
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl lg:text-[28px] font-black text-slate-800 leading-tight">
                {product.name}
              </h1>
              <Tag color={PHASE_TAG_COLOR[product.phase] ?? 'phase-prototype'}>{product.phase}</Tag>
              <span className="inline-flex items-center mt-1">
                <StatusDot status={product.health} />
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0 rounded-md bg-slate-50 text-[11px] font-bold text-slate-600 border border-slate-200">
                编号 {product.id}
              </span>
              <span className="inline-flex items-center px-2.5 py-0 rounded-md bg-slate-50 text-[11px] font-bold text-slate-600 border border-slate-200">
                <Calendar className="w-3 h-3 mr-1" />
                立项 {product.date}
              </span>
            </div>

            {/* 一句话描述 */}
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-4xl">
              {product.oneLiner}
            </p>

            {/* 三核心角色卡 */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {coreMembers.map(({ key, title, member, accent, ring }) => (
                <div
                  key={key}
                  className={`relative p-3 rounded-xl border border-slate-100 bg-slate-50/40 overflow-hidden`}
                >
                  <div className={`absolute -right-3 -top-3 w-14 h-14 rounded-full bg-gradient-to-br ${accent} opacity-10`} />
                  <div className="relative flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-base font-black ${
                        AVATAR_BG[member.avatarColor] ?? 'bg-slate-100 text-slate-600'
                      } ring-4 ${ring}`}
                    >
                      {member.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">{title}</div>
                      <div className="text-sm font-black text-slate-800 truncate">{member.name}</div>
                      {/* <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        {member.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {member.phone}
                          </span>
                        )}
                        {member.email && (
                          <span className="inline-flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </span>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 参战部门 Tag */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500">参战部门</span>
              {product.depts.map((d) => (
                <Tag key={d} color="slate">{d}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============= 左侧 Tabs + 右侧内容（撑满屏幕，供 AI Tab 内部做 h-full 约束） ============= */}
      <div className="flex gap-6 flex-col lg:flex-row items-stretch">
        {/* 左侧 Tabs */}
        <div className="w-full lg:w-56 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 p-3 lg:sticky lg:top-6 self-start">
          <div className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                  ${tab === t.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                  }
                `}
              >
                <div
                  className={`
                    w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                    ${tab === t.key ? 'bg-white/15' : 'bg-slate-100'}
                  `}
                >
                  {t.icon}
                </div>
                <div>
                  <div className="text-sm font-black">{t.label}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 px-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">核心数字</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">团队人数</span>
              <b className="text-slate-800 tabular-nums">{product.team.length}</b>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">资产文件</span>
              <b className="text-slate-800 tabular-nums">{product.assets.length}</b>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">动态数量</span>
              <b className="text-slate-800 tabular-nums">{product.feeds.length}</b>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">周报请阅读</span>
              <b className="text-slate-800 tabular-nums">{product.reports.length}</b>
            </div>
          </div>
        </div>

        {/* 右侧内容：AI Tab 时固定精确高度 + overflow-hidden，禁止页面级滚动；其他 Tab 自适应 */}
        <div
          className={`flex-1 min-w-0 w-full flex flex-col ${
            tab === 'ai'
              ? 'lg:h-[calc(100vh-180px)] h-[640px] lg:max-h-[calc(100vh-180px)] max-h-[640px] overflow-hidden'
              : ''
          }`}
        >
          {tab === 'overview' && <OverviewTab product={product} />}
          {tab === 'phase' && <PhaseTab product={product} />}
          {tab === 'weekly' && <WeeklyTab product={product} />}
          {tab === 'team' && <TeamTab product={product} />}
          {tab === 'asset' && <AssetTab product={product} />}
          {tab === 'ai' && <AIChatTab product={product} />}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
