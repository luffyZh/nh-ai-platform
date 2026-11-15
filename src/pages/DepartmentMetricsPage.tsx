import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Activity, AlertCircle, Target, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  DEPT_METRIC_PROFILES,
  DEFAULT_DEPT_RADAR,
  fallbackAchievement,
  buildBottlenecks,
  type BottleneckItem,
} from '../mock/deptMetricsMock';
import type { ProductPhase, HealthStatus } from '../mock/productMock';
import { useProductStore } from '../store/productStore';
import Tag from '../components/ui/Tag';
import StatusDot from '../components/ui/StatusDot';

const PHASE_TAG_COLOR: Record<
  ProductPhase,
  'phase-concept' | 'phase-prototype' | 'phase-evt' | 'phase-dvt' | 'phase-mp'
> = {
  概念期: 'phase-concept',
  原型期: 'phase-prototype',
  EVT: 'phase-evt',
  DVT: 'phase-dvt',
  MP: 'phase-mp',
};

/** 每个部门参与的项目在该部门视角下的效能表现 */
interface DeptProjectPerf {
  productId: string;
  productName: string;
  phase: ProductPhase;
  health: HealthStatus;
  target: number;
  actual: number;
  metricName: string;
  owner: string;
}

const DepartmentMetricsPage: React.FC = () => {
  const { products } = useProductStore();
  const [dept, setDept] = useState<string>('硬件二部');

  const profile = useMemo(
    () =>
      DEPT_METRIC_PROFILES.find((p) => p.dept === dept) ?? {
        dept,
        radar: DEFAULT_DEPT_RADAR,
        projects: [],
      },
    [dept]
  );

  // 该部门当前参战的所有产品线
  const deptProjects = useMemo(
    () => products.filter((p) => p.depts.includes(dept)),
    [products, dept]
  );

  // 项目 × 指标达成：优先取指标库，缺省时按产品 ID 推导稳定值
  const projectPerfs = useMemo<DeptProjectPerf[]>(
    () =>
      deptProjects.map((prod) => {
        const metric = profile.projects.find((m) => m.productId === prod.id);
        const fallback = fallbackAchievement(prod.id);
        return {
          productId: prod.id,
          productName: prod.shortName || prod.name,
          phase: prod.phase,
          health: prod.health,
          target: metric?.target ?? 92,
          actual: metric?.actual ?? fallback,
          metricName: metric?.metricName ?? '综合效能达成率',
          owner: metric?.owner ?? prod.pm,
        };
      }),
    [deptProjects, profile]
  );

  const bottlenecks = useMemo<BottleneckItem[]>(
    () =>
      buildBottlenecks(
        profile,
        projectPerfs.map((p) => ({
          productId: p.productId,
          productName: p.productName,
          health: p.health,
        }))
      ),
    [profile, projectPerfs]
  );

  const riskyCount = projectPerfs.filter((p) => p.health !== '正常').length;
  const avgScore =
    projectPerfs.length > 0
      ? projectPerfs.reduce((sum, p) => sum + p.actual, 0) / projectPerfs.length
      : profile.radar.reduce((sum, d) => sum + d.actual, 0) / profile.radar.length;
  const deptLevelGapCount = bottlenecks.filter((b) => b.scope === '部门').length;

  const barData = projectPerfs.map((p) => ({
    name: p.productName.length > 8 ? `${p.productName.slice(0, 8)}…` : p.productName,
    期望值: p.target,
    实际值: p.actual,
  }));

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* ============= 页头 + 部门选择器 ============= */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-800">部门效能大盘</h2>
          <p className="text-sm text-slate-500 mt-1">
            按部门汇总其在各产品线中的指标达成情况，对比立项时设定的期望目标，自动高亮效能瓶颈以支撑跨项目资源调配。
          </p>
        </div>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="h-9 rounded-xl border border-slate-200 px-4 bg-white text-sm text-slate-700 font-bold outline-none shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          {DEPT_METRIC_PROFILES.map((p) => (
            <option key={p.dept} value={p.dept}>
              {p.dept}
            </option>
          ))}
        </select>
      </div>

      {/* ============= 核心指标卡片 ============= */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-500 font-medium">参战项目总数</div>
            <div className="text-3xl font-black text-slate-800 mt-1 tabular-nums">
              {projectPerfs.length}
              <span className="text-sm font-normal text-slate-400 ml-1">个</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-500 font-medium">延期 / 风险项目</div>
            <div className="text-3xl font-black text-slate-800 mt-1 tabular-nums">
              {riskyCount}
              <span className="text-sm font-normal text-slate-400 ml-1">项</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-500 font-medium">综合效能得分</div>
            <div className="text-3xl font-black text-slate-800 mt-1 tabular-nums">
              {avgScore.toFixed(1)}
              <span className="text-sm font-normal text-slate-400 ml-1">分</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-500 font-medium">待改进预警项</div>
            <div className="text-3xl font-black text-slate-800 mt-1 tabular-nums">
              {bottlenecks.length}
              <span className="text-sm font-normal text-red-400 ml-1">
                含 {deptLevelGapCount} 项部门级
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============= 图表区 ============= */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-800">
              {dept} · 核心能力画像（实际达成 vs 目标值）
            </h3>
            <span className="text-xs text-slate-400">数据来源：部门效能指标库</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={profile.radar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} angle={90} />
                <Radar name="目标值" dataKey="target" stroke="#cbd5e1" fill="#e2e8f0" fillOpacity={0.35} />
                <Radar name="实际达成" dataKey="actual" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h3 className="text-sm font-black text-slate-800 mb-3">各参战项目效能对比</h3>
          {barData.length === 0 ? (
            <div className="h-72 flex flex-col items-center justify-center text-slate-400 text-sm">
              <Building2 className="w-8 h-8 mb-2 text-slate-300" />
              该部门暂无参战项目
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 15, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  <Bar dataKey="期望值" fill="#cbd5e1" radius={[3, 3, 0, 0]} barSize={16} />
                  <Bar dataKey="实际值" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ============= 项目池 + 瓶颈预警 ============= */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h3 className="text-sm font-black text-slate-800 mb-3">部门项目池</h3>
          {projectPerfs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              暂无参战产品线
              <p className="text-xs mt-1 text-slate-400">该部门尚未被任何立项产品关联</p>
            </div>
          ) : (
            <div className="space-y-2">
              {projectPerfs.map((p) => (
                <Link
                  key={p.productId}
                  to={`/products/${p.productId}`}
                  className="block rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 p-3 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-sm text-slate-800 leading-snug">{p.productName}</span>
                    <span className="flex-shrink-0 text-sm font-black text-slate-800 tabular-nums">
                      {p.actual}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Tag color={PHASE_TAG_COLOR[p.phase]} size="sm">
                      {p.phase}
                    </Tag>
                    <span className="text-xs text-slate-400 truncate">{p.metricName}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <StatusDot status={p.health} />
                    <span className="text-xs text-slate-400">目标 {p.target}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Target className="w-4 h-4 text-red-500" />
              效能瓶颈预警
            </h3>
            <span className="text-xs text-slate-400">
              自动抓取「延期 / 风险 / 指标未达标」任务，按缺口倒序
            </span>
          </div>

          {bottlenecks.length === 0 ? (
            <div className="py-12 text-center text-emerald-600 text-sm">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              该部门所有参与项目的指标均已达标
              <p className="text-xs mt-1 text-slate-400">继续保持，可沉淀为标杆经验向其他部门复用</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bottlenecks.map((b) => (
                <div
                  key={b.id}
                  className={`rounded-xl border p-3 ${
                    b.level === '延期'
                      ? 'border-red-200 bg-red-50/50'
                      : b.level === '风险'
                      ? 'border-amber-200 bg-amber-50/50'
                      : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        b.level === '延期'
                          ? 'text-red-500'
                          : b.level === '风险'
                          ? 'text-amber-500'
                          : 'text-slate-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Tag
                          color={
                            b.level === '延期' ? 'red' : b.level === '风险' ? 'amber' : 'slate'
                          }
                          size="sm"
                        >
                          {b.level}
                        </Tag>
                        <Tag color="slate" size="sm">
                          {b.scope}
                        </Tag>
                        <span className="font-bold text-sm text-slate-800">{b.metricName}</span>
                        {b.productName && (
                          <span className="text-xs text-slate-500">@ {b.productName}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-1.5 flex-wrap">
                        <span>
                          目标 <b className="text-slate-700 tabular-nums">{b.target}</b>
                        </span>
                        <span>
                          实际 <b className="text-slate-700 tabular-nums">{b.actual}</b>
                        </span>
                        <span>
                          缺口{' '}
                          <b className="text-red-600 tabular-nums">-{b.gap.toFixed(0)}</b>
                        </span>
                        <span>责任人 {b.owner}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{b.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              提示：预警数据由产品健康度与部门指标库自动汇总，实际值随周报同步更新
            </span>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              前往产品大盘调配资源
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentMetricsPage;
