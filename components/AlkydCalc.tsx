'use client'

import { useState, useMemo } from 'react'
import { currentWeek } from '@/lib/priceData'
import type { Dictionary } from '@/lib/i18n/dictionaries/zh'

// ── 原料选项 ────────────────────────────────────────────────
const OIL_OPTIONS = {
  soybean: { label: '豆油',   mw: 875, iodineValue: 130, fattyAcidMW: 279, defaultPrice: 8.0 },
  linseed: { label: '亚麻油', mw: 879, iodineValue: 185, fattyAcidMW: 278, defaultPrice: 12.0 },
  castor:  { label: '蓖麻油', mw: 932, iodineValue: 85,  fattyAcidMW: 298, defaultPrice: 10.0 },
  coconut: { label: '椰子油', mw: 678, iodineValue: 10,  fattyAcidMW: 200, defaultPrice: 9.5  },
}
const POLYOL_OPTIONS = {
  pe:      { label: '季戊四醇 PE', mw: 136.15, fn: 4, isPE: true  },
  glycerol:{ label: '甘油',        mw: 92.09,  fn: 3, isPE: false },
}

const MW_PA       = 148.12
const MW_PE_ALKYD = 136.15

function oilLengthCat(ol: number) {
  if (ol < 40)  return { label: '短油', color: '#b91c1c', bg: '#fef2f2', appNote: '快干型涂料，硬度高，韧性低' }
  if (ol <= 60) return { label: '中油', color: '#166534', bg: '#f0fdf4', appNote: '通用型工业涂料，性能均衡' }
  return             { label: '长油', color: '#1e40af', bg: '#eff6ff', appNote: '装饰涂料，柔韧性好，干燥慢' }
}

function calculate(targetKg: number, oilLength: number, paRatio: number, purity: number,
                   polyolMW: number, oilPrice: number, pePrice: number, paPrice: number) {
  const oil_kg      = targetKg * (oilLength / 100)
  const non_oil_kg  = targetKg - oil_kg
  const ratio       = (paRatio * polyolMW) / MW_PA
  const polyol_kg   = non_oil_kg / (1 + ratio)
  const pa_kg       = non_oil_kg - polyol_kg
  const fatty_acid  = oil_kg * 0.955

  const pa_moles    = (pa_kg * 1000) / MW_PA
  const polyol_moles = (polyol_kg * 1000 * (purity / 100)) / polyolMW
  const polyol_fn   = polyolMW === MW_PE_ALKYD ? 4 : 3
  const oh_moles    = polyol_moles * polyol_fn
  const cooh_moles  = pa_moles * 2
  const oh_ratio    = cooh_moles > 0 ? oh_moles / cooh_moles : 0

  let acid_value: number
  if (oh_ratio < 1.0) {
    acid_value = Math.min(60, ((cooh_moles - oh_moles) * 56100) / (targetKg * 1000))
  } else {
    acid_value = Math.max(5, 20 - (oh_ratio - 1.0) * 25)
  }

  const water_expelled = (Math.min(cooh_moles, oh_moles) * 18.015) / 1000
  const total_raw      = oil_kg + pa_kg + polyol_kg
  const oil_pct        = (oil_kg    / total_raw) * 100
  const pa_pct         = (pa_kg     / total_raw) * 100
  const polyol_pct     = (polyol_kg / total_raw) * 100

  const oilCost    = oil_kg    * oilPrice
  const peCalcCost = polyol_kg * pePrice
  const paCost     = pa_kg     * paPrice
  const totalCost  = oilCost + peCalcCost + paCost
  const costPerTon = targetKg > 0 ? totalCost / targetKg * 1000 : 0

  return { oil_kg, polyol_kg, pa_kg, fatty_acid, acid_value, oh_ratio, water_expelled,
           oil_pct, pa_pct, polyol_pct, oilCost, peCalcCost, paCost, totalCost, costPerTon }
}

// ── 共用子组件 ──────────────────────────────────────────────

function CostBar({ items }: { items: { label: string; cost: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.cost, 0)
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
                <span className="text-sm font-semibold tabular-nums">¥{item.cost.toFixed(0)}</span>
                <span className="text-xs text-slate-400 w-10 text-right">{((item.cost / total) * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(item.cost / total) * 100}%`, backgroundColor: item.color }} />
            </div>
          </div>
        ))}
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

export default function AlkydCalc({ lang }: { lang: string; dict: Dictionary }) {
  const pe95Low = currentWeek.mono.grade95.low / 1000
  const pe98Low = currentWeek.mono.grade98.low / 1000

  const [targetKg,  setTargetKg]  = useState(1000)
  const [oilLength, setOilLength] = useState(50)
  const [oilKey,    setOilKey]    = useState('soybean')
  const [polyolKey, setPolyolKey] = useState('pe')
  const [paRatio,   setPaRatio]   = useState(1.5)
  const [purity,    setPurity]    = useState(95)
  const [oilPrice,  setOilPrice]  = useState(OIL_OPTIONS.soybean.defaultPrice)
  const [pePrice,   setPePrice]   = useState(parseFloat(pe95Low.toFixed(2)))
  const [paPrice,   setPaPrice]   = useState(7.5)   // ¥/kg 苯酐参考价

  const oil    = OIL_OPTIONS[oilKey as keyof typeof OIL_OPTIONS]
  const polyol = POLYOL_OPTIONS[polyolKey as keyof typeof POLYOL_OPTIONS]
  const oilCat = oilLengthCat(oilLength)

  const result = useMemo(
    () => calculate(targetKg, oilLength, paRatio, purity, polyol.mw, oilPrice, polyol.isPE ? pePrice : 5.0, paPrice),
    [targetKg, oilLength, paRatio, purity, polyol.mw, oilPrice, pePrice, paPrice, polyol.isPE]
  )

  // 技术影响
  const implications = useMemo(() => {
    const cards = []
    const mainCost = Math.max(result.oilCost, result.peCalcCost, result.paCost)

    // 油长与成本结构关系
    if (oilLength > 55) {
      cards.push({ level: 'info' as const,
        title: `长油（${oilLength}%）— 油价主导成本`,
        driver: `植物油 ¥${result.oilCost.toFixed(0)}（占${((result.oilCost/result.totalCost)*100).toFixed(0)}%）`,
        desc: '长油树脂油含量高，植物油是成本主体。油价波动对最终成本影响大',
        mitigation: `当前${oil.label}价¥${oilPrice}/kg；关注期货行情，建立原材料库存缓冲`,
        impact: `油价每涨¥1/kg影响本批成本¥${result.oil_kg.toFixed(0)}` })
    } else if (oilLength < 40) {
      cards.push({ level: 'info' as const,
        title: `短油（${oilLength}%）— PA成本主导`,
        driver: `苯酐 ¥${result.paCost.toFixed(0)}（占${((result.paCost/result.totalCost)*100).toFixed(0)}%）`,
        desc: '短油醇酸树脂苯酐用量高，硬度强，适合工业快干涂料，但苯酐价格波动影响成本',
        mitigation: '与PA供应商签订长单稳定价格；苯酐与PE一般价格走势相关',
        impact: `PA价每涨¥1/kg影响本批成本¥${result.pa_kg.toFixed(0)}` })
    }

    // OH/COOH比偏低
    if (result.oh_ratio < 1.0) {
      cards.push({ level: 'critical' as const,
        title: 'OH/COOH比<1 — 酸值严重超标风险',
        driver: 'PA用量相对多元醇过多',
        desc: `OH/COOH=${result.oh_ratio.toFixed(2)}，OH基团不足以中和所有COOH，预估酸值${result.acid_value.toFixed(1)} mgKOH/g（偏高）`,
        mitigation: '增加多元醇用量或降低paRatio，使OH/COOH≥1.05；目标酸值5–15 mgKOH/g',
        impact: '调整后改善涂膜耐水性和储存稳定性' })
    } else if (result.oh_ratio > 1.3) {
      cards.push({ level: 'warning' as const,
        title: 'OH过量偏高 — 多元醇浪费',
        driver: `多元醇用量${result.polyol_kg.toFixed(1)}kg，OH过量系数${result.oh_ratio.toFixed(2)}`,
        desc: 'OH/COOH>1.3时，过量羟基留在产品中，增加亲水性，降低耐候性',
        mitigation: '将paRatio提高至1.6–1.8，减少多元醇投入同时改善性能',
        impact: `调整可减少多元醇约${(result.polyol_kg * 0.1).toFixed(1)}kg，节省约¥${(result.polyol_kg * 0.1 * pePrice).toFixed(0)}` })
    }

    // PE vs 甘油成本对比
    if (polyol.isPE) {
      cards.push({ level: 'info' as const,
        title: `使用PE（${purity}%）— 高官能度四元醇`,
        driver: `PE ¥${result.peCalcCost.toFixed(0)}，当前价¥${pePrice}/kg`,
        desc: 'PE（四官能度）vs 甘油（三官能度）：PE树脂支链度更高，硬度更强，但成本更高',
        mitigation: '短油/中油工业用途可评估甘油替代PE降成本；装饰涂料可维持PE',
        impact: `甘油参考价约¥3-5/kg，若切换可节省¥${(result.peCalcCost * 0.5).toFixed(0)}以上（但需重新调整配方比例）` })
    }

    return cards.slice(0, 4)
  }, [oilLength, oil, oilPrice, paPrice, pePrice, purity, polyol, result])

  // 优化建议
  const optimizations = useMemo(() => {
    const cards = []
    // 高油长时：降低油长降低油成本
    if (oilLength > 55 && result.oilCost > result.paCost * 1.5) {
      const newOil   = oilLength - 5
      const newResult = calculate(targetKg, newOil, paRatio, purity, polyol.mw, oilPrice, pePrice, paPrice)
      cards.push({ title: `油长${oilLength}%→${newOil}%（短化）`,
        currentCost: result.totalCost, newCost: newResult.totalCost,
        trade: '树脂韧性降低，干燥时间缩短；需重新评估酸值和OH/COOH比',
        how: `目标油长${newOil}%，同步调整PA/多元醇比例` })
    }
    // PE换甘油（仅当PE是主要成本且不是短油）
    if (polyol.isPE && result.peCalcCost > result.paCost && oilLength >= 40) {
      const glycerolPrice = 4.0
      const newResult = calculate(targetKg, oilLength, paRatio, 100, POLYOL_OPTIONS.glycerol.mw, oilPrice, glycerolPrice, paPrice)
      cards.push({ title: 'PE → 甘油（官能度调整）',
        currentCost: result.totalCost, newCost: newResult.totalCost,
        trade: '甘油三官能度（vs PE四官能度），树脂柔韧性更好但硬度降低；需重新优化配方比例',
        how: '替换多元醇至甘油（MW=92.09），paRatio需相应调整至1.2–1.5' })
    }
    // PA用量优化（OH/COOH偏低时）
    if (result.oh_ratio < 1.05 && polyol.isPE) {
      const newRatio = Math.max(0.8, paRatio - 0.2)
      const newResult = calculate(targetKg, oilLength, newRatio, purity, polyol.mw, oilPrice, pePrice, paPrice)
      cards.push({ title: `PA比例${paRatio}→${newRatio.toFixed(1)}（改善OH/COOH）`,
        currentCost: result.totalCost, newCost: newResult.totalCost,
        trade: `酸值从${result.acid_value.toFixed(0)}降至约${newResult.acid_value.toFixed(0)} mgKOH/g；涂膜耐水性改善`,
        how: `调整PA比例至${newRatio.toFixed(1)}，相应增加多元醇用量` })
    }
    return cards.slice(0, 3)
  }, [oilLength, paRatio, purity, polyol, oilPrice, pePrice, paPrice, result, targetKg])

  const RESET = () => {
    setTargetKg(1000); setOilLength(50); setOilKey('soybean'); setPolyolKey('pe')
    setPaRatio(1.5); setPurity(95); setOilPrice(OIL_OPTIONS.soybean.defaultPrice)
    setPePrice(parseFloat(pe95Low.toFixed(2))); setPaPrice(7.5)
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
            <h1 className="text-2xl font-bold text-slate-900">醇酸树脂成本仪表板</h1>
            <p className="text-sm text-slate-500 mt-1">涂料配方 · 油长/PE/苯酐成本结构优化</p>
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
                <h2 className="font-semibold text-slate-900 text-sm">配方参数</h2>
                <p className="text-xs text-slate-400 mt-0.5">目标产量 + 配比 + 采购价</p>
              </div>
              <div className="p-4 space-y-1">

                <div className="text-xs font-bold text-slate-500 pb-2 border-b border-slate-100 mb-2">
                  🎯 目标产量
                </div>
                <PriceInput label="目标产量" value={targetKg} unit="kg" min={100} max={50000} step={100} onChange={setTargetKg} />

                {/* 植物油 */}
                <div className="text-xs font-bold text-green-600 pt-3 pb-2 border-b border-slate-100 mb-2 mt-3 border-t border-slate-100">
                  🟢 植物油
                </div>
                <label className="pe-calc-field">
                  <span className="pe-calc-label">油长</span>
                  <div className="pe-calc-input-wrap">
                    <input type="number" className="pe-calc-input" value={oilLength} min={25} max={70} step={1}
                      onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) setOilLength(v) }} />
                    <span className="pe-calc-unit">%</span>
                    <span style={{ background: oilCat.bg, color: oilCat.color, fontSize: '10px',
                      fontWeight: 700, padding: '3px 8px', borderRadius: '10px',
                      border: `1px solid ${oilCat.color}40`, whiteSpace: 'nowrap' as const }}>
                      {oilCat.label}
                    </span>
                  </div>
                  <span className="pe-calc-hint">{oilCat.appNote}</span>
                </label>
                <label className="pe-calc-field">
                  <span className="pe-calc-label">种类</span>
                  <div className="pe-calc-input-wrap">
                    <select className="pe-calc-input pe-calc-select" value={oilKey}
                      onChange={e => { setOilKey(e.target.value); setOilPrice(OIL_OPTIONS[e.target.value as keyof typeof OIL_OPTIONS].defaultPrice) }}>
                      {Object.entries(OIL_OPTIONS).map(([k, o]) => <option key={k} value={k}>{o.label}</option>)}
                    </select>
                  </div>
                  <span className="pe-calc-hint">碘值{oil.iodineValue}</span>
                </label>
                <PriceInput label="采购价" value={oilPrice} unit="¥/kg" min={3} max={30} step={0.5} onChange={setOilPrice}
                  hint={`${oil.label}参考价约¥${oil.defaultPrice}/kg`} />

                {/* 多元醇 */}
                <div className="text-xs font-bold text-orange-600 pt-3 pb-2 border-b border-slate-100 mb-2 mt-3 border-t border-slate-100">
                  🟡 多元醇
                </div>
                <label className="pe-calc-field">
                  <span className="pe-calc-label">种类</span>
                  <div className="pe-calc-input-wrap">
                    <select className="pe-calc-input pe-calc-select" value={polyolKey}
                      onChange={e => setPolyolKey(e.target.value)}>
                      <option value="pe">季戊四醇 PE（官能度4）</option>
                      <option value="glycerol">甘油（官能度3）</option>
                    </select>
                  </div>
                  <span className="pe-calc-hint">MW={polyol.mw} g/mol</span>
                </label>
                {polyol.isPE && <>
                  <label className="pe-calc-field">
                    <span className="pe-calc-label">PE纯度</span>
                    <div className="pe-calc-input-wrap">
                      <select className="pe-calc-input pe-calc-select" value={purity}
                        onChange={e => { const v = parseInt(e.target.value); setPurity(v); setPePrice(v >= 98 ? parseFloat(pe98Low.toFixed(2)) : parseFloat(pe95Low.toFixed(2))) }}>
                        <option value={95}>95%</option>
                        <option value={98}>98%</option>
                      </select>
                    </div>
                  </label>
                  <PriceInput label="PE采购价" value={pePrice} unit="¥/kg" min={5} max={30} step={0.25} onChange={setPePrice}
                    hint={`市场：95%≈¥${pe95Low.toFixed(2)}/kg，98%≈¥${pe98Low.toFixed(2)}/kg`} />
                </>}

                {/* 苯酐 */}
                <div className="text-xs font-bold text-red-600 pt-3 pb-2 border-b border-slate-100 mb-2 mt-3 border-t border-slate-100">
                  🔴 苯酐 PA
                </div>
                <PriceInput label="PA/多元醇摩尔比" value={paRatio} unit=":1" min={0.8} max={2.5} step={0.1} onChange={setPaRatio}
                  hint="推荐1.3–1.8；过低酸值偏高" />
                <PriceInput label="苯酐采购价" value={paPrice} unit="¥/kg" min={3} max={20} step={0.5} onChange={setPaPrice}
                  hint="PA市场参考价约¥6–10/kg" />
              </div>
            </div>
          </div>

          {/* 右侧仪表板 */}
          <div className="lg:col-span-2">

            {/* 成本总览 */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-5 mb-5 border border-slate-200">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">醇酸树脂单位成本</div>
                  <div className="text-4xl font-bold text-slate-900 tabular-nums">
                    ¥{result.costPerTon.toFixed(0)}<span className="text-base text-slate-500 ml-1">/吨</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">本批原料总费用</div>
                  <div className="text-xl font-bold text-slate-700 tabular-nums">¥{result.totalCost.toFixed(0)}</div>
                  <div className="text-xs text-slate-500">目标产量 {targetKg.toLocaleString()} kg</div>
                </div>
              </div>
              {/* 配方构成条 */}
              <div className="mt-3">
                <div className="flex rounded-full overflow-hidden h-3 mb-1">
                  <div style={{ width: `${result.oil_pct}%`,    background: '#1D9E75', transition: 'width 0.4s' }} title={`植物油 ${result.oil_pct.toFixed(1)}%`} />
                  <div style={{ width: `${result.pa_pct}%`,     background: '#0d9488', transition: 'width 0.4s' }} title={`苯酐 ${result.pa_pct.toFixed(1)}%`} />
                  <div style={{ width: `${result.polyol_pct}%`, background: '#f97316', transition: 'width 0.4s' }} title={`多元醇 ${result.polyol_pct.toFixed(1)}%`} />
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>植物油 {result.oil_pct.toFixed(1)}%</span>
                  <span><span className="inline-block w-2 h-2 rounded-full bg-teal-600 mr-1"></span>苯酐 {result.pa_pct.toFixed(1)}%</span>
                  <span><span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1"></span>多元醇 {result.polyol_pct.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* 成本分解 */}
            <CostBar items={[
              { label: `${oil.label} ${result.oil_kg.toFixed(1)}kg`, cost: result.oilCost, color: '#1D9E75' },
              { label: `苯酐 PA ${result.pa_kg.toFixed(1)}kg`, cost: result.paCost, color: '#0d9488' },
              { label: `多元醇 ${result.polyol_kg.toFixed(1)}kg`, cost: result.peCalcCost, color: '#f97316' },
            ]} />

            {/* 关键指标 */}
            <div className="bg-white rounded-lg p-5 mb-5 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">关键技术指标</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <MetricBadge label="预估酸值" value={result.acid_value.toFixed(1)} unit="mgKOH/g"
                  ok={result.acid_value <= 15} note={result.acid_value > 15 ? '偏高' : '正常'} />
                <MetricBadge label="OH/COOH比" value={result.oh_ratio.toFixed(2)} unit="×"
                  ok={result.oh_ratio >= 1.0 && result.oh_ratio <= 1.25}
                  note={result.oh_ratio < 1.0 ? '⚠️ OH不足' : result.oh_ratio > 1.25 ? 'OH略过量' : '合理'} />
                <MetricBadge label="油长确认" value={`${oilLength}%`} note={oilCat.label} />
                <MetricBadge label="脱水量" value={result.water_expelled.toFixed(1)} unit="kg" />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <MetricBadge label="植物油用量" value={result.oil_kg.toFixed(1)} unit="kg" />
                <MetricBadge label="多元醇用量" value={result.polyol_kg.toFixed(1)} unit="kg" />
                <MetricBadge label="苯酐用量" value={result.pa_kg.toFixed(1)} unit="kg" />
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

        {/* 油长档位矩阵 */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">油长档位决策矩阵</h3>
            <div className="space-y-3">
              {[
                { label: '短油 <40%', color: 'border-red-400 bg-red-50',
                  cost: '成本：苯酐主导', char: '快干，硬度高，柔韧性差', use: '工业底漆/快干磁漆' },
                { label: '中油 40–60%', color: 'border-green-400 bg-green-50',
                  cost: '成本：油+苯酐均衡', char: '干燥适中，性能均衡，通用性强', use: '通用工业漆/建筑涂料' },
                { label: '长油 >60%', color: 'border-blue-400 bg-blue-50',
                  cost: '成本：油价主导', char: '柔韧好，干燥慢，户外耐候强', use: '船舶/木器/装饰涂料' },
              ].map((row, i) => (
                <div key={i} className={`border-l-4 p-4 rounded-lg ${row.color}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-900">{row.label}</span>
                    <span className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded text-slate-600">{row.use}</span>
                  </div>
                  <div className="text-xs text-slate-700 space-y-0.5">
                    <div><strong>{row.cost}</strong></div>
                    <div>{row.char}</div>
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
                { title: '原料投料', tasks: [
                  `植物油：${result.oil_kg.toFixed(1)}kg（${oil.label}，碘值${oil.iodineValue}）`,
                  `多元醇：${result.polyol_kg.toFixed(1)}kg（${polyol.label}）`,
                  `苯酐PA：${result.pa_kg.toFixed(1)}kg`,
                  '催化剂：二丁基氧化锡0.05–0.1 wt%',
                ]},
                { title: '醇解与酯化', tasks: [
                  '醇解阶段：220–240°C，监测醇解度（甲醇溶解试验）',
                  '酯化阶段：220–250°C，分水，氮气保护',
                  `目标脱水量≥${(result.water_expelled * 0.85).toFixed(1)}kg`,
                  `监测酸值≤${(result.acid_value * 1.2).toFixed(0)} mgKOH/g（中间控制）`,
                ]},
                { title: '终点控制', tasks: [
                  `终点酸值目标：${result.acid_value.toFixed(0)} mgKOH/g`,
                  'OH/COOH比校验（取样测羟值）',
                  '粘度测定（Gardner气泡管法）',
                  '冷却至<180°C加入溶剂，过滤出料',
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
