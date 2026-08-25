import React, { useState, useMemo } from 'react';
import { Search, Plus, Package2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Tag from '../components/ui/Tag';
import StatusDot from '../components/ui/StatusDot';
import { useProductStore } from '../store/productStore';
import type { ProductPhase } from '../mock/productMock';

const PHASE_TAG_COLOR: Record<string, 'phase-concept' | 'phase-prototype' | 'phase-evt' | 'phase-dvt' | 'phase-mp'> = {
  概念期: 'phase-concept',
  原型期: 'phase-prototype',
  EVT: 'phase-evt',
  DVT: 'phase-dvt',
  MP: 'phase-mp',
};

const ProductListPage: React.FC = () => {
  const { products } = useProductStore();
  const [keyword, setKeyword] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<'全部' | ProductPhase>('全部');

  const visible = useMemo(() => {
    return products.filter((p) => {
      if (phaseFilter !== '全部' && p.phase !== phaseFilter) return false;
      if (keyword.trim()) {
        const k = keyword.trim().toLowerCase();
        if (!p.name.toLowerCase().includes(k) && !p.id.toLowerCase().includes(k)) return false;
      }
      return true;
    });
  }, [products, keyword, phaseFilter]);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-800">产品大盘</h2>
          <p className="text-sm text-slate-500 mt-1">
            全院在研产品线一览，创意认领后将自动进入原型期。当前共有{' '}
            <span className="font-bold text-blue-600">{products.length}</span> 条产品线。
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索产品名称/编号"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-64 h-9 rounded-xl border border-slate-200 pl-9 pr-4 bg-slate-50 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value as '全部' | ProductPhase)}
            className="h-9 rounded-xl border border-slate-200 px-3 bg-slate-50 text-sm text-slate-600 outline-none"
          >
            <option>全部</option>
            <option>概念期</option>
            <option>原型期</option>
            <option>EVT</option>
            <option>DVT</option>
            <option>MP</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold shadow-sm">
          <Plus className="w-4 h-4" /> 新建产品
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {visible.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Package2 className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">当前筛选条件下暂无产品线</p>
            <p className="text-xs mt-1">提示：在创意机会池中认领「评审中」的创意，即可自动创建原型期产品。</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">产品编号 / 名称</th>
                <th className="px-6 py-4 font-semibold">产品经理</th>
                <th className="px-6 py-4 font-semibold">参战部门</th>
                <th className="px-6 py-4 font-semibold">当前阶段</th>
                <th className="px-6 py-4 font-semibold">健康度</th>
                <th className="px-6 py-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {visible.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex-shrink-0">
                      {prod.coverImage ? (
                        <div
                          className="absolute inset-0"
                          style={{ backgroundImage: `url(${prod.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 text-slate-400">
                          <Package2 className="w-5 h-5" strokeWidth={1.6} />
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/products/${prod.id}`}
                        className="font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        {prod.name}
                      </Link>
                      <div className="text-xs text-slate-400 mt-0.5">{prod.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {prod.pm[0]}
                    </div>
                    <span className="text-slate-600">{prod.pm}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap">
                    {prod.depts.map((d) => (
                      <Tag key={d} color="slate">
                        {d}
                      </Tag>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Tag color={PHASE_TAG_COLOR[prod.phase] ?? 'phase-prototype'}>{prod.phase}</Tag>
                </td>
                <td className="px-6 py-4">
                  <StatusDot status={prod.health} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/products/${prod.id}`}
                    className="inline-flex cursor-pointer px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-sm font-medium text-blue-600 transition-colors"
                  >
                    查看详情
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
