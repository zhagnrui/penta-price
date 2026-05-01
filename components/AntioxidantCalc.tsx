'use client'

import { useState, useMemo } from 'react'
import { currentWeek } from '@/lib/priceData'
import type { Dictionary } from '@/lib/i18n/dictionaries/zh'

// ── 分子量常数 ──────────────────────────────────────────────
const MW_PE       = 136.15
const MW_MDHP     = 292.42
const MW_AO1010   = 1177.63
const MW_METHANOL = 32.04

function calculate(targetKg: number, pePurity: number, mdhpPurity: number,
                   molarExcess: number, yieldPct: number,
                   pePrice: number, mdhpPrice: number, methanolPrice: number) {
  const yieldFrac    = yieldPct / 100
  const targetMoles  = (targetKg * 1000) / (MW_AO1010 * yieldFrac)
  const peTheoKg     = (targetMoles * MW_PE) / 1000
  const peActualKg   = peTheoKg / (pePurity / 100)
  const mdhpTheoKg   = (targetMoles * 4 * MW_MDHP) / 1000
  const mdhpActualKg = (mdhpTheoKg * molarExcess) / (mdhpPurity / 100)
  const methanolKg   = (targetMoles * 4 * MW_METHANOL) / 1000
  const theoreticalKg = (targetMoles * MW_AO1010) / 1000

  const peCost         = peActualKg  * pePrice
  const mdhpCost       = mdhpActualKg * mdhpPrice
  const methanolValue  = (methanolKg * methanolPrice) / 1000   // ¥/ton → ¥
  const netCost        = peCost + mdhpCost - methanolValue
  const costPerKg      = targetKg > 0 ? netCost / targetKg : 0

  return { targetMoles, peTheoKg, peActualKg, mdhpActualKg, methanolKg, theoreticalKg,
           peCost, mdhpCost, methanolValue, netCost, costPerKg }
}

// ── 共用子组件（与 LubricantCalc 相同样式体系）──────────────

function CostBar({ items }: { items: { label: string; cost: number; color: string }[] }) {
  const total = items.filter(i => i.cost > 0).reduce((s, i) => s + i.cost, 0)
  if (total <= 0) return null
  return (
    <div className="bg-white rounded-lg p-5 mb-5 border border-slate-200">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">成本分解</h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold tabular-nums ${item.cost < 0 ? 'text-green-600' : ''}`}>
                  {item.cost < 0 ? '-' : ''}¥{Math.abs(item.cost).toFixed(0)}
                </span>
                <span className="text-xs text-slate-400 w-12 text-right">
                  {total > 0 ? ((item.cost / total) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.abs((item.cost / total) * 100)}%`, backgroundColor: item.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
        <span>副产甲醇可冲抵原料成本</span>
        <span className="text-green-600 font-medium">-¥{items.find(i=>i.cost < 0) ? Math.abs(items.find(i=>i.cost < 0)!.cost).toFixed(0) : 0}</span>
      </div>
    </div>
  )
}

function MetricBadge({ label, value, unit, ok, note }: {
  label: string; value: string; unit?: string; ok?: boolean; note?: string
}) {
  const borderColor = ok === undefined ? 'border-slate-200 bg-slate-50'
                    : ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
  const textColor   = ok === undefined ? 'text-slate-800' : ok ? 'text-green-800' : 'text-red-700'
  return (
    <div className={`rounded-lg p-3 border text-center ${borderColor}`}>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-xl font-black tabular-nums ${textColor}`}>{value}{unit && <span className="text-sm font-normal ml-0.5">{unit}</span>}</div>
      {note && <div className="text-xs text-slate-400 mt-0.5">{note}</div>}
    </div>
  )
}

function ImplicationCard({ level, title, driver, desc, mitigation, impact }: {
  level: 'info'|'warning'|'critical'; title: string; driver: string;
  desc: string; mitigation: string; impact: string;
}) {
  const s = {
    info:     { bg: 'bg-blue-50 border-blue-200',   icon: 'ℹ️', text: 'text-blue-800' },
    warning:  { bg: 'bg-amber-50 border-amber-200', icon: '⚠️', text: 'text-amber-800' },
    critical: { bg: 'bg-red-50 border-red-200',     icon: '🚨', text: 'text-red-800' },
  }[level]
  return (
    <div className={`rounded-lg p-4 border ${s.bg}`}>
      <div className="flex gap-3">
        <div className="text-lg flex-shrink-0">{s.icon}</div>
        <div className="flex-1">
          <div className={`font-semibold text-sm mb-2 ${s.text}`}>{title}</div>
          <div className="text-xs text-slate-700 space-y-1 mb-2">
            <div><strong>成本驱动：</strong>{driver}</div>
            <div><strong>技术影响：</strong>{desc}</div>
          </div>
          <div className="bg-white bg-opacity-70 rounded px-3 py-2 text-xs text-slate-700 mb-1">
            💡 <strong>建议：</strong>{mitigation}
          </div>
          <div className={`text-xs font-medium ${impact.includes('节省') ? 'text-green-700' : 'text-slate-600'}`}>{impact}</div>
        </div>
      </div>
    </div>
  )
}

function OptCard({ title, currentCost, newCost, trade, how }: {
  title: string; currentCost: number; newCost: number; trade: string; how: string;
}) {
  const saved = currentCost - newCost
  const pct   = currentCost > 0 ? ((saved / currentCost) * 100).toFixed(1) : '0'
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-slate-900 text-sm pr-2">{title}</h4>
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-slate-500">可节省</div>
          <div className="text-xl font-bold text-green-600 tabular-nums">¥{saved.toFixed(0)}</div>
          <div className="text-xs text-green-600">-{pct}%</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white bg-opacity-60 rounded px-2 py-1.5">
          <div className="text-xs text-slate-500">当前</div>
          <div className="text-sm font-semibold tabular-nums">¥{currentCost.toFixed(0)}</div>
        </div>
        <div className="bg-white bg-opacity-60 rounded px-2 py-1.5">
          <div className="text-xs text-slate-500">优化后</div>
          <div className="text-sm font-semibold text-green-700 tabular-nums">¥{newCost.toFixed(0)}</div>
        </div>
      </div>
      <div className="text-xs text-slate-600 space-y-1">
        <div><strong>技术权衡：</strong>{trade}</div>
        <div><strong>实施：</strong>{how}</div>
      </div>
    </div>
  )
}

function PriceInput({ label, value, unit, min, max, step, onChange, hint }: {
  label: string; value: number; unit: string; min: number; max: number; step: number;
  onChange: (v: number) => void; hint?: string;
}) {
  return (
    <label className="pe-calc-field">
      <span className="pe-calc-label">{label}</span>
      <div className="pe-calc-input-wrap">
        <input type="number" className="pe-calc-input" value={value} min={min} max={max} step={step}
          onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(v) }} />
        <span className="pe-calc-unit">{unit}</span>
      </div>
      {hint && <span className="pe-calc-hint">{hint}</span>}
    </label>
  )
}

// ── 主组件 ──────────────────────────────────────────────────

export default function AntioxidantCalc({ lang }: { lang: string; dict: Dictionary }) {
  const pe98Low = currentWeek.mono.grade98.low / 1000
  const pe95Low = currentWeek.mono.grade95.low / 1000

  const [targetKg,    setTargetKg]    = useState(1000)
  const [pePurity,    setPePurity]    = useState(98)
  const [mdhpPurity,  setMdhpPurity]  = useState(99)
  const [molarExcess, setMolarExcess] = useState(1.05)
  const [yieldPct,    setYieldPct]    = useState(92)
  const [pePrice,     setPePrice]     = useState(parseFloat(pe98Low.toFixed(2)))
  const [mdhpPrice,   setMdhpPrice]   = useState(18.0)   // ¥/kg 参考
  const [methanolPrice, setMethanolPrice] = useState(2800) // ¥/ton

  const result = useMemo(
    () => calculate(targetKg, pePurity, mdhpPurity, molarExcess, yieldPct, pePrice, mdhpPrice, methanolPrice),
    [targetKg, pePurity, mdhpPurity, molarExcess, yieldPct, pePrice, mdhpPrice, methanolPrice]
  )

  // 技术影响
  const implications = useMemo(() => {
    const cards = []
    // MDHP是成本主体
    if (result.mdhpCost > result.peCost) {
      cards.push({ level: 'info' as const,
        title: `MDHP是最大成本项（${((result.mdhpCost/result.netCost)*100).toFixed(0)}%）`,
        driver: `MDHP ¥${result.mdhpCost.toFixed(0)}，用量${result.mdhpActualKg.toFixed(1)}kg`,
        desc: 'MDHP（甲基丙烯酸甲酯中间体）为AO1010合成的关键中间体，每个PE分子需4个MDHP单元',
        mitigation: '优化MDHP摩尔过量系数至最低合理值（1.02–1.05），加强催化剂活性',
        impact: `过量系数降0.02可减少MDHP约${(result.targetMoles * 4 * MW_MDHP / 1000 * 0.02 / mdhpPurity * 100).toFixed(1)}kg` })
    }
    // 摩尔过量偏高
    if (molarExcess > 1.06) {
      cards.push({ level: 'warning' as const,
        title: `MDHP摩尔过量系数${molarExcess}偏高`,
        driver: `多投入MDHP约¥${(result.mdhpActualKg * (molarExcess - 1) / molarExcess * mdhpPrice).toFixed(0)}`,
        desc: '过量MDHP增加原料成本；超量部分需在后处理中去除，增加精制成本和溶剂消耗',
        mitigation: '在催化剂活性可控前提下，将系数降至1.02–1.05；定期检测催化剂活性',
        impact: `降至1.03可节省MDHP≈¥${(result.targetMoles * 4 * MW_MDHP / 1000 * (molarExcess - 1.03) / (mdhpPurity/100) * mdhpPrice).toFixed(0)}` })
    }
    // 收率偏低
    if (yieldPct < 88) {
      cards.push({ level: 'critical' as const,
        title: `收率${yieldPct}%偏低 — 每吨成本大幅上升`,
        driver: `收率每降1%，投料成本增加约¥${(result.netCost * 0.01 / (yieldPct/100)).toFixed(0)}`,
        desc: '低收率意味着更多原料用于生产等量AO1010，直接推高单位生产成本',
        mitigation: '检查催化剂失活情况；优化反应温度（80–100°C）；严格控制水分进入',
        impact: '收率从85%提升至92%：单位成本降低约8.2%' })
    }
    // PE纯度对比
    if (pePurity >= 98) {
      cards.push({ level: 'info' as const,
        title: 'PE 98%纯度 — 对AO1010质量影响有限',
        driver: `PE ¥${result.peCost.toFixed(0)}（¥${pePrice}/kg）`,
        desc: 'AO1010合成中PE纯度差异对产品纯度影响<0.5%（主要由MDHP反应控制），98%较95%溢价明显',
        mitigation: '下调至95%纯度PE；PE在AO1010合成中的功能性要求不需要高纯度',
        impact: `降至95%节省约¥${(result.peActualKg * (pePrice - pe95Low)).toFixed(0)}（本批）` })
    }
    return cards.slice(0, 4)
  }, [molarExcess, yieldPct, pePurity, pePrice, mdhpPrice, result, pe95Low, mdhpPurity])

  // 优化建议
  const optimizations = useMemo(() => {
    const cards = []
    if (molarExcess > 1.04) {
      const newMDHP = result.targetMoles * 4 * MW_MDHP / 1000 * 1.03 / (mdhpPurity / 100)
      const newCost  = result.peCost + newMDHP * mdhpPrice - result.methanolValue
      cards.push({ title: `MDHP过量系数 ${molarExcess}→1.03`,
        currentCost: result.netCost, newCost,
        trade: '需确认催化剂新鲜度；MDHP过量减少会轻微降低反应推动力，收率可能降0.5–1%',
        how: '在催化剂活性评估后调整投料比；首批小试验证' })
    }
    if (pePurity >= 98 && pePrice > pe95Low + 1) {
      const newPECost = result.peActualKg * pe95Low
      const newNet    = newPECost + result.mdhpCost - result.methanolValue
      cards.push({ title: 'PE 98% → 95%',
        currentCost: result.netCost, newCost: newNet,
        trade: 'AO1010产品纯度不受影响；仅微量杂质差异，对塑料稳定应用无影响',
        how: `采购PE 95%（参考价¥${pe95Low.toFixed(2)}/kg），无需更改工艺` })
    }
    if (yieldPct < 90) {
      const improvedYield = Math.min(yieldPct + 3, 93)
      const betterResult = calculate(targetKg, pePurity, mdhpPurity, molarExcess, improvedYield, pePrice, mdhpPrice, methanolPrice)
      cards.push({ title: `提升收率至${improvedYield}%（催化剂优化）`,
        currentCost: result.netCost, newCost: betterResult.netCost,
        trade: '需更换或再生催化剂；短期可能增加操作成本，但长期降低原料消耗',
        how: '检查并更换失活催化剂；优化反应温度至90°C±5°C；控制体系水分<200ppm' })
    }
    return cards
  }, [molarExcess, yieldPct, pePurity, pePrice, mdhpPrice, mdhpPurity, result, pe95Low, targetKg, methanolPrice])

  const RESET = () => {
    setTargetKg(1000); setPePurity(98); setMdhpPurity(99); setMolarExcess(1.05)
    setYieldPct(92); setPePrice(parseFloat(pe98Low.toFixed(2)))
    setMdhpPrice(18.0); setMethanolPrice(2800)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-4">
          <a href={`/${lang}/calculator`}
            style={{ color: 'var(--pe-green)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
            ← 返回计算工具
          </a>
        </div>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">抗氧剂1010成本仪表板</h1>
            <p className="text-sm text-slate-500 mt-1">Irganox 1010 · PE + MDHP投料成本与优化</p>
          </div>
          <button onClick={RESET}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-300 rounded-lg px-3 py-2 bg-white transition-colors">
            重置
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

          {/* 左侧输入 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 sticky top-6">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900 text-sm">生产参数</h2>
                <p className="text-xs text-slate-400 mt-0.5">目标产量 + 原料单价</p>
              </div>
              <div className="p-4 space-y-1">

                <div className="text-xs font-bold text-slate-500 pb-2 border-b border-slate-100 mb-2">
                  🎯 目标产量
                </div>
                <PriceInput label="AO1010目标产量" value={targetKg} unit="kg" min={100} max={100000} step={100} onChange={setTargetKg} />

                <div className="text-xs font-bold text-orange-600 pt-3 pb-2 border-b border-slate-100 mb-2 mt-3 border-t border-slate-100">
                  🟡 季戊四醇 PE
                </div>
                <label className="pe-calc-field">
                  <span className="pe-calc-label">纯度</span>
                  <div className="pe-calc-input-wrap">
                    <select className="pe-calc-input pe-calc-select" value={pePurity}
                      onChange={e => { const v = parseInt(e.target.value); setPePurity(v); setPePrice(v >= 98 ? parseFloat(pe98Low.toFixed(2)) : parseFloat(pe95Low.toFixed(2))) }}>
                      <option value={98}>98%</option>
                      <option value={95}>95%</option>
                    </select>
                  </div>
                </label>
                <PriceInput label="采购价" value={pePrice} unit="¥/kg" min={5} max={30} step={0.25} onChange={setPePrice}
                  hint={`参考：95%≈¥${pe95Low.toFixed(2)}/kg，98%≈¥${pe98Low.toFixed(2)}/kg`} />

                <div className="text-xs font-bold text-purple-600 pt-3 pb-2 border-b border-slate-100 mb-2 mt-3 border-t border-slate-100">
                  🟣 MDHP中间体
                </div>
                <label className="pe-calc-field">
                  <span className="pe-calc-label">纯度</span>
                  <div className="pe-calc-input-wrap">
                    <select className="pe-calc-input pe-calc-select" value={mdhpPurity}
                      onChange={e => setMdhpPurity(parseFloat(e.target.value))}>
                      <option value={99}>99%</option>
                      <option value={98}>98%</option>
                      <option value={97}>97%</option>
                    </select>
                  </div>
                </label>
                <PriceInput label="摩尔过量系数" value={molarExcess} unit="×" min={1.00} max={1.20} step={0.01} onChange={setMolarExcess}
                  hint="推荐1.02–1.05；过高浪费MDHP" />
                <PriceInput label="采购价" value={mdhpPrice} unit="¥/kg" min={5} max={60} step={0.5} onChange={setMdhpPrice}
                  hint="MDHP市场参考价约¥15–22/kg" />

                <div className="text-xs font-bold text-green-600 pt-3 pb-2 border-b border-slate-100 mb-2 mt-3 border-t border-slate-100">
                  ⚗️ 工艺参数
                </div>
                <PriceInput label="综合收率" value={yieldPct} unit="%" min={75} max={98} step={1} onChange={setYieldPct}
                  hint="典型值88–93%；低于88%需排查" />
                <PriceInput label="甲醇回收价" value={methanolPrice} unit="¥/t" min={1000} max={6000} step={100} onChange={setMethanolPrice}
                  hint="副产甲醇可冲抵成本" />
              </div>
            </div>
          </div>

          {/* 右侧仪表板 */}
          <div className="lg:col-span-2">

            {/* 成本总览 */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-5 mb-5 border border-slate-200">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">AO1010 单位净成本</div>
                  <div className="text-4xl font-bold text-slate-900 tabular-nums">
                    ¥{result.costPerKg.toFixed(2)}<span className="text-base text-slate-500 ml-1">/kg</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">已扣除甲醇回收价值 ¥{result.methanolValue.toFixed(0)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">本批净总成本</div>
                  <div className="text-xl font-bold text-slate-700 tabular-nums">¥{result.netCost.toFixed(0)}</div>
                  <div className="text-xs text-slate-500">目标产量 {targetKg.toLocaleString()} kg</div>
                </div>
              </div>
            </div>

            {/* 成本分解 */}
            <CostBar items={[
              { label: `PE ${result.peActualKg.toFixed(1)}kg`, cost: result.peCost, color: '#f97316' },
              { label: `MDHP ${result.mdhpActualKg.toFixed(1)}kg`, cost: result.mdhpCost, color: '#8b5cf6' },
              { label: `甲醇回收（-¥${result.methanolValue.toFixed(0)}）`, cost: -result.methanolValue, color: '#22c55e' },
            ]} />

            {/* 关键指标 */}
            <div className="bg-white rounded-lg p-5 mb-5 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">关键生产指标</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <MetricBadge label="实际PE投料" value={result.peActualKg.toFixed(1)} unit="kg" />
                <MetricBadge label="MDHP投料" value={result.mdhpActualKg.toFixed(1)} unit="kg" />
                <MetricBadge label="副产甲醇" value={result.methanolKg.toFixed(1)} unit="kg" />
                <MetricBadge label="综合收率" value={`${yieldPct}%`}
                  ok={yieldPct >= 88} note={yieldPct < 88 ? '偏低，检查催化剂' : '正常'} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <MetricBadge label="理论AO1010产量" value={result.theoreticalKg.toFixed(1)} unit="kg"
                  note="按化学计量" />
                <MetricBadge label="MDHP过量系数" value={`${molarExcess}×`}
                  ok={molarExcess <= 1.05} note={molarExcess > 1.06 ? '偏高，可优化' : '合理'} />
              </div>
            </div>

            {/* 技术影响 */}
            {implications.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">成本驱动的技术影响</h3>
                <div className="space-y-3">
                  {implications.map((c, i) => <ImplicationCard key={i} {...c} />)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 优化建议 */}
        {optimizations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>💡</span>优化方案
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {optimizations.map((o, i) => <OptCard key={i} {...o} />)}
            </div>
          </div>
        )}

        {/* 成本档位矩阵 */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">生产策略决策矩阵</h3>
            <div className="space-y-3">
              {[
                { label: '成本优先', color: 'border-blue-400 bg-blue-50',
                  config: 'PE 95% + MDHP过量1.02 + 收率92%+', note: '需催化剂状态良好', use: '大批量标准品' },
                { label: '平衡版', color: 'border-green-400 bg-green-50',
                  config: 'PE 98% + MDHP过量1.05 + 收率90%', note: '标准操作，稳定可靠', use: '常规批次生产' },
                { label: '质量优先', color: 'border-purple-400 bg-purple-50',
                  config: 'PE 98% + MDHP过量1.08 + 催化剂新鲜', note: '收率更稳定但成本偏高', use: '高端塑料/出口' },
              ].map((row, i) => (
                <div key={i} className={`border-l-4 p-4 rounded-lg ${row.color}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-900">{row.label}</span>
                    <span className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded text-slate-600">{row.use}</span>
                  </div>
                  <div className="text-xs text-slate-700 space-y-0.5">
                    <div><strong>配置：</strong>{row.config}</div>
                    <div><strong>注意：</strong>{row.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SOP清单 */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>✅</span>工艺检查清单
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: '投料准备', tasks: [
                  `PE实际投料：${result.peActualKg.toFixed(1)}kg（${pePurity}%纯度）`,
                  `MDHP实际投料：${result.mdhpActualKg.toFixed(1)}kg（${mdhpPurity}%纯度）`,
                  '检查PE和MDHP含水量（<200 ppm）',
                  '催化剂准备（钛酸四丁酯，0.1–0.3 wt%）',
                ]},
                { title: '反应控制', tasks: [
                  '升温至80°C启动，维持85–95°C',
                  '氮气保护，蒸馏分离甲醇',
                  `监测甲醇产量≥${(result.methanolKg * 0.85).toFixed(1)}kg（达到计量量85%）`,
                  '检测体系酸值变化（每30分钟）',
                ]},
                { title: '后处理与收率', tasks: [
                  '甲醇精制回收（纯度≥98%）',
                  `甲醇回收价值约¥${result.methanolValue.toFixed(0)}（冲抵原料成本）`,
                  '产品重结晶/过滤',
                  `最终收率目标≥${yieldPct}%（产量≥${targetKg}kg）`,
                ]},
              ].map((g, gi) => (
                <div key={gi} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-sm text-slate-900 mb-3">{g.title}</h4>
                  <ul className="space-y-2">
                    {g.tasks.map((t, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-xs text-slate-700">
                        <input type="checkbox" className="mt-0.5 rounded accent-green-600" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
