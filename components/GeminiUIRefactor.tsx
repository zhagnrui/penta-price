'use client'

import { useState, useMemo } from 'react'

/**
 * Gemini版本UI改造 v3.0 — Phase 3: 性能预测集成
 *
 * 架构：
 * ┌─ 左侧输入面板（原料配置：kg + 价格）
 * │
 * ├─ 右侧成本仪表板（动态计算）
 * │  ├─ 成本总数 + 成本分解图
 * │  ├─ 化学计量分析（P/OH, P:N, P%, N%）
 * │  ├─ 性能预测（LOI, PHRR, THRF + 炭层评分）
 * │  ├─ 技术影响卡片（从化学计量推导）
 * │  └─ 优化建议（动态生成）
 * │
 * └─ 底部：成本档位矩阵 + SOP清单
 */

// ── 分子量常数 ──────────────────────────────────────────────
const MW = { P2O5: 141.94, KOH: 56.11, P: 30.97, N: 14.01 }

// ── 市场参考价格（¥/kg，从 priceData.ts 同步）──────────────
const MARKET_REF = {
  per95: 10.25,   // ¥/kg (95%, ¥10,000–10,500/t avg)
  per98: 13.75,   // ¥/kg (98%, ¥13,500–14,000/t avg)
}

// ────────────────────────────────────────────────────────────
// 性能预测模型（与 IFRBatchCalcV2 一致，基于论文数据）
// ────────────────────────────────────────────────────────────

/**
 * LOI 预测 — Schartel et al. (2003)
 * LOI ≈ 20 + 0.5 × wt%P   (linear, P range 8–22%)
 */
function predictLOI(pct_P: number) {
  const loi = 20.0 + 0.5 * pct_P
  const level =
    loi < 24 ? 'poor' :
    loi < 27 ? 'acceptable' :
    loi < 30 ? 'good' : 'excellent'
  return { value: Math.round(loi * 10) / 10, min: Math.max(20, loi - 2), max: loi + 2, level }
}

/**
 * PHRR 预测 — Zhenglai et al. (2010)
 * Baseline 850 kW/m²；P%和P:N共同影响降低幅度
 */
function predictPHRR(pct_P: number, ratio_PN: number, ifrLoading = 40) {
  const baseline = 850
  const p_factor  = 1.0 - (pct_P - 10) / 100
  let pn_factor = 1.0
  if      (ratio_PN < 1.5) pn_factor = 1.0 + (1.5 - ratio_PN) * 0.30
  else if (ratio_PN > 2.5) pn_factor = 1.0 + (ratio_PN - 2.5) * 0.25
  const ifr_factor = 0.5 + 0.5 * Math.pow(ifrLoading / 100, 0.6)
  const phrr = baseline * p_factor * pn_factor * ifr_factor
  return { value: Math.round(phrr), min: Math.round(phrr * 0.85), max: Math.round(phrr * 1.15) }
}

/**
 * THRF 隔热时间预测 — Schartel & Braun (2007)
 * 基线 150s；P/OH 0.5–1.2 最佳，膨胀倍率和P%调节
 */
function predictTHRF(ratio_POH: number, pct_N: number, pct_P: number) {
  // 膨胀倍率估算（来自N%分段）
  const exp_mid = pct_N < 6 ? 8.5 : pct_N < 9 ? 16 : pct_N < 12 ? 26 : pct_N < 15 ? 36.5 : 50
  const baseline = 150
  let poh_factor = ratio_POH < 0.5 ? 0.7 + ratio_POH * 0.6
                 : ratio_POH > 1.2 ? 1.3 - (ratio_POH - 1.2) * 0.4 : 1.2
  const exp_factor = Math.max(0.8, 1.0 - (exp_mid - 20) / 200)
  const p_factor   = 0.9 + (pct_P - 15) / 70
  const thrf = baseline * poh_factor * exp_factor * p_factor
  return { value: Math.round(thrf), min: Math.round(thrf * 0.80), max: Math.round(thrf * 1.20), exp_mid }
}

/** 炭层综合质量评分 (0–100) */
function charScore(ratio_POH: number, ratio_PN: number, pct_P: number, pct_N: number): number {
  let s = 0
  if (ratio_POH >= 0.5 && ratio_POH <= 1.2)   s += 25
  else if (ratio_POH >= 0.4 && ratio_POH <= 1.3) s += 18
  else s += 8
  if (ratio_PN >= 1.5 && ratio_PN <= 2.5)     s += 25
  else if (ratio_PN >= 1.3 && ratio_PN <= 2.7) s += 18
  else s += 8
  if (pct_P >= 15 && pct_P <= 22) s += 25
  else if (pct_P >= 13 && pct_P <= 23) s += 18
  else s += 8
  if (pct_N >= 8 && pct_N <= 13) s += 25
  else if (pct_N >= 6 && pct_N <= 15)  s += 18
  else s += 8
  return s
}

// ────────────────────────────────────────────────────────────
// 数据接口
// ────────────────────────────────────────────────────────────

interface CostBreakdownItem {
  name: string
  cost: number
  percentage: number
  color: string
}

interface TechImplication {
  id: string
  title: string
  level: 'info' | 'warning' | 'critical'
  costDriver: string
  description: string
  mitigation: string
  costImpact: string
}

interface OptimizationSuggestion {
  id: string
  title: string
  currentCost: number
  optimizedCost: number
  savings: number
  technicalTrade: string
  implementation: string
}

// ────────────────────────────────────────────────────────────
// 成本总览卡片
// ────────────────────────────────────────────────────────────

function CostSummary({
  unitCost,
  totalCost,
  totalKg,
}: {
  unitCost: number
  totalCost: number
  totalKg: number
}) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-5 mb-5 border border-slate-200">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">IFR体系 单位成本</div>
          <div className="text-4xl font-bold text-slate-900 tabular-nums">
            ¥{unitCost.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
            <span className="text-base text-slate-500 ml-1">/吨</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 mb-1">本批总费用</div>
          <div className="text-xl font-bold text-slate-700 tabular-nums">
            ¥{totalCost.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-slate-500">{totalKg.toFixed(1)} kg</div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 成本分解图
// ────────────────────────────────────────────────────────────

function CostBreakdownChart({ items }: { items: CostBreakdownItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="bg-white rounded-lg p-5 mb-5 border border-slate-200">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">成本分解 Cost Breakdown</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-slate-700">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 tabular-nums">
                  ¥{item.cost.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-xs text-slate-500 w-10 text-right">{item.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
        {items.map((item) => (
          <div key={`leg-${item.name}`} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-500 truncate">{item.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 技术影响卡片
// ────────────────────────────────────────────────────────────

function TechImplicationCard({ item }: { item: TechImplication }) {
  const styles = {
    info:     { bg: 'bg-blue-50 border-blue-200',   icon: 'ℹ️', accent: 'text-blue-700' },
    warning:  { bg: 'bg-amber-50 border-amber-200', icon: '⚠️', accent: 'text-amber-700' },
    critical: { bg: 'bg-red-50 border-red-200',     icon: '🚨', accent: 'text-red-700' },
  }[item.level]

  return (
    <div className={`rounded-lg p-4 border ${styles.bg}`}>
      <div className="flex gap-3">
        <div className="text-lg flex-shrink-0">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm mb-2 ${styles.accent}`}>{item.title}</div>
          <div className="text-xs text-slate-700 space-y-1 mb-2">
            <div><strong>成本驱动：</strong>{item.costDriver}</div>
            <div><strong>技术影响：</strong>{item.description}</div>
          </div>
          <div className="bg-white bg-opacity-70 rounded px-3 py-2 text-xs text-slate-700 mb-2">
            💡 <strong>解决方案：</strong>{item.mitigation}
          </div>
          <div className={`text-xs font-medium ${item.costImpact.includes('节省') || item.costImpact.includes('降') ? 'text-green-700' : 'text-slate-600'}`}>
            {item.costImpact}
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 优化建议卡片
// ────────────────────────────────────────────────────────────

function OptimizationCard({ item }: { item: OptimizationSuggestion }) {
  const savings = item.currentCost - item.optimizedCost
  const savingsPct = item.currentCost > 0 ? ((savings / item.currentCost) * 100).toFixed(1) : '0'

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-slate-900 text-sm pr-2">{item.title}</h4>
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-slate-500">可节省</div>
          <div className="text-xl font-bold text-green-600 tabular-nums">
            ¥{savings.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-green-600">-{savingsPct}%</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white bg-opacity-60 rounded px-2 py-1.5">
          <div className="text-xs text-slate-500">当前</div>
          <div className="text-sm font-semibold text-slate-700 tabular-nums">
            ¥{item.currentCost.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="bg-white bg-opacity-60 rounded px-2 py-1.5">
          <div className="text-xs text-slate-500">优化后</div>
          <div className="text-sm font-semibold text-green-700 tabular-nums">
            ¥{item.optimizedCost.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>
      <div className="text-xs text-slate-600 space-y-1">
        <div><strong>技术权衡：</strong>{item.technicalTrade}</div>
        <div><strong>实施方式：</strong>{item.implementation}</div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 化学计量指标（小卡片）
// ────────────────────────────────────────────────────────────

function StoichBadge({ label, value, unit, min, max }: {
  label: string; value: number; unit?: string; min: number; max: number
}) {
  const ok = value >= min && value <= max
  return (
    <div className={`rounded-lg p-3 border text-center ${ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-xl font-bold tabular-nums ${ok ? 'text-green-700' : 'text-red-700'}`}>
        {value.toFixed(2)}{unit}
      </div>
      <div className={`text-xs mt-1 ${ok ? 'text-green-600' : 'text-red-600'}`}>
        {ok ? '✓ 合理' : '✗ 需调整'} <span className="text-slate-400">({min}–{max})</span>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 性能预测面板
// ────────────────────────────────────────────────────────────

interface PerfData {
  loi:   ReturnType<typeof predictLOI>
  phrr:  ReturnType<typeof predictPHRR>
  thrf:  ReturnType<typeof predictTHRF>
  score: number
}

function PerformancePrediction({ perf, unitCost }: { perf: PerfData; unitCost: number }) {
  const loiColor   = perf.loi.level === 'poor' ? 'text-red-700' : perf.loi.level === 'excellent' ? 'text-green-700' : 'text-blue-700'
  const loiLabel   = { poor: '⚠️ 偏弱', acceptable: '✓ 可接受', good: '✓ 良好', excellent: '✓✓ 优秀' }[perf.loi.level]
  const scoreColor = perf.score >= 85 ? 'text-green-700' : perf.score >= 65 ? 'text-amber-700' : 'text-red-700'
  const scoreLabel = perf.score >= 95 ? 'A+ 完美' : perf.score >= 85 ? 'A 优秀' : perf.score >= 70 ? 'B 良好' : perf.score >= 50 ? 'C 需改进' : 'D 不合格'

  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-5 mb-5 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-blue-900">
          🎯 性能预测 Performance Prediction
        </h3>
        <div className="text-xs text-blue-500">基于论文经验公式 | Schartel (2003, 2007); Zhenglai (2010)</div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* LOI */}
        <div className="bg-white rounded-lg p-3 border border-blue-100 text-center">
          <div className="text-xs font-semibold text-blue-600 mb-1">极限氧指数 LOI</div>
          <div className={`text-3xl font-black tabular-nums ${loiColor}`}>{perf.loi.value}</div>
          <div className="text-xs text-slate-400 mb-1">范围 {perf.loi.min.toFixed(1)}–{perf.loi.max.toFixed(1)}</div>
          <div className={`text-xs font-medium ${loiColor}`}>{loiLabel}</div>
        </div>

        {/* PHRR */}
        <div className="bg-white rounded-lg p-3 border border-red-100 text-center">
          <div className="text-xs font-semibold text-red-600 mb-1">热释放速率 PHRR</div>
          <div className="text-3xl font-black tabular-nums text-red-700">{perf.phrr.value}</div>
          <div className="text-xs text-slate-400 mb-1">kW/m² ({perf.phrr.min}–{perf.phrr.max})</div>
          <div className="text-xs font-medium text-red-600">越低越好</div>
        </div>

        {/* THRF */}
        <div className="bg-white rounded-lg p-3 border border-teal-100 text-center">
          <div className="text-xs font-semibold text-teal-600 mb-1">隔热时间 THRF</div>
          <div className="text-3xl font-black tabular-nums text-teal-700">{perf.thrf.value}</div>
          <div className="text-xs text-slate-400 mb-1">秒 ({perf.thrf.min}–{perf.thrf.max}s)</div>
          <div className="text-xs font-medium text-teal-600">膨胀倍率≈{perf.thrf.exp_mid.toFixed(0)}×</div>
        </div>
      </div>

      {/* 炭层评分 + 成本效能比 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg px-4 py-3 border border-blue-100 flex items-center gap-3">
          <div>
            <div className="text-xs text-slate-500 mb-0.5">炭层综合评分</div>
            <div className={`text-2xl font-black tabular-nums ${scoreColor}`}>{perf.score}<span className="text-sm font-normal">/100</span></div>
          </div>
          <div className={`text-lg font-bold ${scoreColor}`}>{scoreLabel}</div>
        </div>
        <div className="bg-white rounded-lg px-4 py-3 border border-blue-100">
          <div className="text-xs text-slate-500 mb-0.5">性能/成本比（LOI/成本）</div>
          <div className="text-2xl font-black text-slate-700 tabular-nums">
            {unitCost > 0 ? (perf.loi.value / (unitCost / 1000)).toFixed(2) : '—'}
          </div>
          <div className="text-xs text-slate-400">LOI点数 / 千元·吨 · 越高越经济</div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 价格输入字段（简化版）
// ────────────────────────────────────────────────────────────

function PriceField({
  label, labelEn, value, unit, min, max, step, onChange, hint,
}: {
  label: string; labelEn?: string; value: number; unit: string
  min: number; max: number; step: number
  onChange: (v: number) => void
  hint?: string
}) {
  return (
    <label className="pe-calc-field">
      <span className="pe-calc-label">
        {label}
        {labelEn && <span className="pe-calc-label-en">{labelEn}</span>}
      </span>
      <div className="pe-calc-input-wrap">
        <input
          type="number"
          className="pe-calc-input"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => {
            const v = parseFloat(e.target.value)
            if (!isNaN(v)) onChange(v)
          }}
        />
        <span className="pe-calc-unit">{unit}</span>
      </div>
      {hint && <span className="pe-calc-hint">{hint}</span>}
    </label>
  )
}

// ────────────────────────────────────────────────────────────
// 主仪表板组件
// ────────────────────────────────────────────────────────────

export default function GeminiUIRefactor() {
  // ── 原料用量 ────────────────────────────────────────────
  const [app_kg,    set_app_kg]    = useState(63.6)
  const [app_p2o5,  set_app_p2o5]  = useState(71.0)
  const [app_price, set_app_price] = useState(10.0)   // ¥/kg

  const [per_kg,      set_per_kg]      = useState(18.2)
  const [per_mono,    set_per_mono]    = useState(95.0)  // %
  const [per_price,   set_per_price]   = useState(MARKET_REF.per95)

  const [mel_kg,    set_mel_kg]    = useState(18.2)
  const [mel_price, set_mel_price] = useState(8.5)    // ¥/kg

  // ── 成本计算 ─────────────────────────────────────────────
  const app_cost = app_kg  * app_price
  const per_cost = per_kg  * per_price
  const mel_cost = mel_kg  * mel_price
  const total_cost = app_cost + per_cost + mel_cost

  // ── 化学计量分析（与 IFRBatchCalcV2 保持一致）───────────
  const stoich = useMemo(() => {
    const total_ifr = app_kg + per_kg + mel_kg
    if (total_ifr <= 0) return null

    const per_oh = 1648 * per_mono / 100        // 推算 OH value mgKOH/g
    const n_P2O5 = (app_kg * 1000 * app_p2o5 / 100) / MW.P2O5
    const n_P    = n_P2O5 * 2
    const n_OH   = (per_kg * 1000 * per_oh) / (MW.KOH * 1000)
    const n_N    = (mel_kg * 1000 * 66.67 / 100) / MW.N

    const mass_P = (n_P * MW.P) / 1000
    const mass_N = (n_N * MW.N) / 1000

    const ratio_POH = n_OH > 0 ? n_P / n_OH : 0
    const ratio_PN  = mass_N > 0 ? mass_P / mass_N : 0
    const pct_P     = (mass_P / total_ifr) * 100
    const pct_N     = (mass_N / total_ifr) * 100

    return { ratio_POH, ratio_PN, pct_P, pct_N, total_ifr }
  }, [app_kg, app_p2o5, per_kg, per_mono, mel_kg])

  // ── 单位成本 (¥/t) ──────────────────────────────────────
  const unit_cost = stoich && stoich.total_ifr > 0
    ? (total_cost / stoich.total_ifr) * 1000
    : 0

  // ── 性能预测 ─────────────────────────────────────────────
  const performance = useMemo<PerfData | null>(() => {
    if (!stoich) return null
    return {
      loi:   predictLOI(stoich.pct_P),
      phrr:  predictPHRR(stoich.pct_P, stoich.ratio_PN),
      thrf:  predictTHRF(stoich.ratio_POH, stoich.pct_N, stoich.pct_P),
      score: charScore(stoich.ratio_POH, stoich.ratio_PN, stoich.pct_P, stoich.pct_N),
    }
  }, [stoich])

  // ── 成本分解数据 ─────────────────────────────────────────
  const costBreakdown = useMemo<CostBreakdownItem[]>(() => {
    if (total_cost <= 0) return []
    return [
      { name: 'APP 聚磷酸铵', cost: app_cost, percentage: (app_cost / total_cost) * 100, color: '#ef4444' },
      { name: 'PER 季戊四醇', cost: per_cost, percentage: (per_cost / total_cost) * 100, color: '#f97316' },
      { name: 'MEL 三聚氰胺', cost: mel_cost, percentage: (mel_cost / total_cost) * 100, color: '#3b82f6' },
    ]
  }, [app_cost, per_cost, mel_cost, total_cost])

  // ── 技术影响卡片（动态推导自化学计量）──────────────────
  const techImplications = useMemo<TechImplication[]>(() => {
    if (!stoich) return []
    const items: TechImplication[] = []

    // 1. APP质量风险
    if (app_p2o5 < 70) {
      items.push({
        id: 'app-quality',
        title: 'APP P₂O₅含量不足 — 水解风险高',
        level: 'critical',
        costDriver: `APP ¥${app_cost.toFixed(0)} (占${((app_cost / total_cost) * 100).toFixed(0)}%)`,
        description: `P₂O₅=${app_p2o5}% 低于推荐70%。水分含量通常>1%，固化时催化APP分解，炭层致密度受损`,
        mitigation: '升级至P₂O₅≥71%的II型APP，固化温度控制≤80°C，分阶段升温<5°C/min',
        costImpact: `升级成本+¥2-3/kg，可提升炭层质量10-15%`,
      })
    } else if (app_cost >= per_cost && app_cost >= mel_cost) {
      items.push({
        id: 'app-cost-driver',
        title: `APP是最大成本驱动（${((app_cost / total_cost) * 100).toFixed(0)}%）`,
        level: 'info',
        costDriver: `APP ¥${app_cost.toFixed(0)} (占${((app_cost / total_cost) * 100).toFixed(0)}%)`,
        description: `P₂O₅=${app_p2o5}%处于合理范围，但用量最大，是削减成本首选目标`,
        mitigation: '可试用国产P₂O₅ 70%等级（需加强工艺控制），或谈判批量采购折扣',
        costImpact: `国产替代可节省¥2-4/kg，本批节省约¥${(app_kg * 2).toFixed(0)}–¥${(app_kg * 4).toFixed(0)}`,
      })
    }

    // 2. PER纯度权衡
    if (per_mono >= 98) {
      items.push({
        id: 'per-premium',
        title: `PER使用高纯度98%（成本${((per_cost / total_cost) * 100).toFixed(0)}%）`,
        level: 'info',
        costDriver: `PER ¥${per_cost.toFixed(0)} (98%纯度 ¥${per_price.toFixed(2)}/kg)`,
        description: '98%vs95%成炭效率差异仅3-5%，但价格相差约¥3.5/kg（≈34%溢价）',
        mitigation: '常规产品降至95%纯度即可，高端防火应用才需要98%',
        costImpact: `降至95%可节省¥${(per_kg * (per_price - MARKET_REF.per95)).toFixed(0)}（本批）`,
      })
    } else if (per_cost >= app_cost) {
      items.push({
        id: 'per-cost',
        title: `PER是最大成本项（${((per_cost / total_cost) * 100).toFixed(0)}%）`,
        level: 'warning',
        costDriver: `PER ¥${per_cost.toFixed(0)} (占${((per_cost / total_cost) * 100).toFixed(0)}%)`,
        description: 'PER用量相对多，是成本优化重点。确认用量是否有空间调减',
        mitigation: '检查P/OH比，若比值>1.0可适量减少PER，同时保持炭化效能',
        costImpact: '每减少1kg PER可节省¥' + per_price.toFixed(2),
      })
    }

    // 3. P/OH比失衡
    if (stoich.ratio_POH < 0.5) {
      items.push({
        id: 'poh-low',
        title: `P/OH比偏低(${stoich.ratio_POH.toFixed(2)}) — PER相对过多`,
        level: 'warning',
        costDriver: 'PER用量超过APP磷酸化学计量需要',
        description: `P/OH=${stoich.ratio_POH.toFixed(2)} < 0.5，磷酸催化剂不足，部分PER的OH未能酯化。炭层形成效率下降`,
        mitigation: '增加APP用量（提高P/OH至0.5–1.2），或适量减少PER',
        costImpact: '调整后可提升阻燃效能10-15%，对成本影响有限',
      })
    } else if (stoich.ratio_POH > 1.2) {
      items.push({
        id: 'poh-high',
        title: `P/OH比偏高(${stoich.ratio_POH.toFixed(2)}) — APP有余量可削减`,
        level: 'warning',
        costDriver: 'APP用量超出最优化学计量',
        description: `P/OH=${stoich.ratio_POH.toFixed(2)} > 1.2，游离磷酸过多，阻碍炭层致密化，且APP成本浪费`,
        mitigation: '减少APP用量（使P/OH降至1.0–1.2），既降成本又改善炭层质量',
        costImpact: `可减少APP约${(app_kg * 0.1).toFixed(1)}kg，节省¥${(app_kg * 0.1 * app_price).toFixed(0)}`,
      })
    }

    // 4. P:N比
    if (stoich.ratio_PN < 1.5) {
      items.push({
        id: 'pn-low',
        title: `P:N比偏低(${stoich.ratio_PN.toFixed(2)}) — MEL用量过多`,
        level: 'warning',
        costDriver: `MEL ¥${mel_cost.toFixed(0)} 用量相对过大`,
        description: `P:N=${stoich.ratio_PN.toFixed(2)} < 1.5，MEL过量。氮气释放过快，炭层膨胀过度导致结构疏松，隔热性下降`,
        mitigation: '减少MEL用量约15%，使P:N目标1.5–2.5。可直接降低MEL成本',
        costImpact: `减少MEL ${(mel_kg * 0.15).toFixed(1)}kg可节省¥${(mel_kg * 0.15 * mel_price).toFixed(0)}`,
      })
    } else if (stoich.ratio_PN > 2.5) {
      items.push({
        id: 'pn-high',
        title: `P:N比偏高(${stoich.ratio_PN.toFixed(2)}) — MEL不足`,
        level: 'warning',
        costDriver: '气源不足影响膨胀性能',
        description: `P:N=${stoich.ratio_PN.toFixed(2)} > 2.5，MEL偏少，炭层膨胀不足，耐火时间降低`,
        mitigation: '适量增加MEL（增加5–10%），使P:N降至1.5–2.5',
        costImpact: `增加MEL ${(mel_kg * 0.08).toFixed(1)}kg，增加成本¥${(mel_kg * 0.08 * mel_price).toFixed(0)}，但性能提升显著`,
      })
    }

    return items.slice(0, 4)
  }, [stoich, app_cost, per_cost, mel_cost, total_cost, app_p2o5, per_mono, per_price, per_kg, app_kg, app_price, mel_kg, mel_cost, mel_price])

  // ── 优化建议（动态生成）─────────────────────────────────
  const optimizations = useMemo<OptimizationSuggestion[]>(() => {
    const items: OptimizationSuggestion[] = []

    // 1. PER 98%→95% 降级
    if (per_mono >= 98 && per_price > MARKET_REF.per95 + 1) {
      const opt_cost = per_kg * MARKET_REF.per95
      items.push({
        id: 'per-downgrade',
        title: '降级PER：98% → 95%',
        currentCost: per_cost,
        optimizedCost: opt_cost,
        savings: per_cost - opt_cost,
        technicalTrade: '成炭效率降低3-5%；OH值1648→1566 mgKOH/g，建议重新验证P/OH比',
        implementation: `采购95%单季PER（市场价约¥${MARKET_REF.per95}/kg），通过GB标准测试后投产`,
      })
    }

    // 2. APP降级（高价格时）
    if (app_p2o5 >= 71 && app_price > 12) {
      const cheaper = app_price - 3
      const opt_cost = app_kg * cheaper
      items.push({
        id: 'app-downgrade',
        title: '采用国产低成本APP',
        currentCost: app_cost,
        optimizedCost: opt_cost,
        savings: app_cost - opt_cost,
        technicalTrade: '需加强工艺控制：温度≤80°C，混合≤30min；P₂O₅可能降至70%',
        implementation: '换用P₂O₅ 70%国产APP，增加MEL 5%补偿膨胀效率',
      })
    }

    // 3. MEL用量优化（P:N偏低时）
    if (stoich && stoich.ratio_PN < 1.6) {
      const reduce = mel_kg * 0.15
      const opt_cost = mel_cost - reduce * mel_price
      items.push({
        id: 'mel-trim',
        title: `减少MEL用量 ${reduce.toFixed(1)}kg (P:N偏低)`,
        currentCost: mel_cost,
        optimizedCost: opt_cost,
        savings: reduce * mel_price,
        technicalTrade: '膨胀倍率略降~5%，P:N比从' + stoich.ratio_PN.toFixed(2) + '提升至约1.8（最优区间）',
        implementation: `将MEL减至${(mel_kg - reduce).toFixed(1)}kg，验证膨胀倍率≥20×`,
      })
    }

    // 4. APP减量优化（P/OH偏高时）
    if (stoich && stoich.ratio_POH > 1.2) {
      const excess_pct = (stoich.ratio_POH - 1.0) / stoich.ratio_POH
      const reduce_kg  = app_kg * excess_pct * 0.7
      const opt_cost   = app_cost - reduce_kg * app_price
      items.push({
        id: 'app-trim',
        title: `减少APP用量 ${reduce_kg.toFixed(1)}kg (P/OH偏高)`,
        currentCost: app_cost,
        optimizedCost: opt_cost,
        savings: reduce_kg * app_price,
        technicalTrade: 'P/OH从' + stoich.ratio_POH.toFixed(2) + '降至约1.0–1.2；炭层致密度改善',
        implementation: `将APP减至${(app_kg - reduce_kg).toFixed(1)}kg，重新核算化学计量`,
      })
    }

    return items.slice(0, 3)
  }, [stoich, per_mono, per_price, per_kg, per_cost, app_p2o5, app_price, app_kg, app_cost, mel_kg, mel_price, mel_cost])

  const RESET = () => {
    set_app_kg(63.6); set_app_p2o5(71.0); set_app_price(10.0)
    set_per_kg(18.2); set_per_mono(95.0);  set_per_price(MARKET_REF.per95)
    set_mel_kg(18.2); set_mel_price(8.5)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* 标题栏 */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">成本驱动的配方优化</h1>
            <p className="text-sm text-slate-500 mt-1">Cost-Driven IFR Formulation Dashboard</p>
          </div>
          <button
            onClick={RESET}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-300 rounded-lg px-3 py-2 bg-white transition-colors"
          >
            重置 Reset
          </button>
        </div>

        {/* 左右布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

          {/* ── 左侧：原料输入面板 ─────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 sticky top-6">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900 text-sm">原料配置 Materials</h2>
                <p className="text-xs text-slate-400 mt-0.5">填入用量和采购单价</p>
              </div>

              <div className="p-4 space-y-1">
                {/* APP */}
                <div className="text-xs font-bold text-red-600 pt-1 pb-2 border-b border-slate-100 mb-2">
                  🟠 聚磷酸铵 APP
                </div>
                <PriceField label="用量" labelEn="Quantity" value={app_kg}
                  unit="kg" min={1} max={10000} step={0.1} onChange={set_app_kg} />
                <PriceField label="P₂O₅含量" labelEn="P₂O₅ % COA" value={app_p2o5}
                  unit="%" min={60} max={78} step={0.1} onChange={set_app_p2o5}
                  hint={app_p2o5 < 70 ? '⚠️ 低于推荐70%' : '✓ 合格'} />
                <PriceField label="采购价" labelEn="Unit price" value={app_price}
                  unit="¥/kg" min={1} max={50} step={0.5} onChange={set_app_price} />

                {/* PER */}
                <div className="text-xs font-bold text-orange-600 pt-3 pb-2 border-b border-slate-100 mb-2 border-t border-slate-100 mt-3">
                  🟡 季戊四醇 PER
                </div>
                <PriceField label="用量" labelEn="Quantity" value={per_kg}
                  unit="kg" min={1} max={10000} step={0.1} onChange={set_per_kg} />
                <PriceField label="单季含量" labelEn="Mono-PE %" value={per_mono}
                  unit="%" min={90} max={100} step={0.1} onChange={v => {
                    set_per_mono(v)
                    // 自动推荐市场价
                    if (v >= 98 && per_price < MARKET_REF.per98) set_per_price(MARKET_REF.per98)
                    if (v < 98  && per_price > MARKET_REF.per95 + 1) set_per_price(MARKET_REF.per95)
                  }}
                  hint={`OH ≈ ${(1648 * per_mono / 100).toFixed(0)} mgKOH/g`} />
                <PriceField label="采购价" labelEn="Unit price" value={per_price}
                  unit="¥/kg" min={5} max={30} step={0.25}
                  onChange={set_per_price}
                  hint={`市场参考：95%≈¥${MARKET_REF.per95}/kg，98%≈¥${MARKET_REF.per98}/kg`} />

                {/* MEL */}
                <div className="text-xs font-bold text-blue-600 pt-3 pb-2 border-b border-slate-100 mb-2 border-t border-slate-100 mt-3">
                  🔵 三聚氰胺 MEL
                </div>
                <PriceField label="用量" labelEn="Quantity" value={mel_kg}
                  unit="kg" min={1} max={10000} step={0.1} onChange={set_mel_kg} />
                <PriceField label="采购价" labelEn="Unit price" value={mel_price}
                  unit="¥/kg" min={3} max={30} step={0.5} onChange={set_mel_price} />
              </div>
            </div>
          </div>

          {/* ── 右侧：成本仪表板 ───────────────────────────── */}
          <div className="lg:col-span-2">

            {/* 成本总览 */}
            <CostSummary
              unitCost={unit_cost}
              totalCost={total_cost}
              totalKg={(app_kg + per_kg + mel_kg)}
            />

            {/* 成本分解图 */}
            <CostBreakdownChart items={costBreakdown} />

            {/* 化学计量指标 */}
            {stoich && (
              <div className="bg-white rounded-lg p-5 mb-5 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  化学计量分析 Stoichiometric Analysis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <StoichBadge label="P/OH 摩尔比" value={stoich.ratio_POH} min={0.5} max={1.2} />
                  <StoichBadge label="P:N 质量比" value={stoich.ratio_PN} min={1.5} max={2.5} />
                  <StoichBadge label="P 含量" value={stoich.pct_P} unit="%" min={15} max={22} />
                  <StoichBadge label="N 含量" value={stoich.pct_N} unit="%" min={8} max={13} />
                </div>
              </div>
            )}

            {/* 性能预测面板 */}
            {performance && (
              <PerformancePrediction perf={performance} unitCost={unit_cost} />
            )}

            {/* 技术影响卡片 */}
            {techImplications.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  成本驱动的技术影响 Cost-Driven Tech Implications
                </h3>
                <div className="space-y-3">
                  {techImplications.map(item => (
                    <TechImplicationCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 优化方案区 */}
        {optimizations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>💡</span>
              优化方案 Optimization Options
              <span className="text-xs font-normal text-slate-400">（基于当前配方动态生成）</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {optimizations.map(item => (
                <OptimizationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* 成本-技术决策矩阵 */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">成本档位决策矩阵</h3>
            <div className="space-y-3">
              {[
                {
                  label: '经济版', price: '¥6,000–8,000/t',
                  color: 'border-blue-400 bg-blue-50',
                  materials: '国产APP P₂O₅ 70% + PER 95% + 国产MEL',
                  risks: ['APP水分>1%，需低温控制', '炭层均匀性较差'],
                  sop: '温度≤80°C，混合<25min，分阶段固化',
                  use: '试样/小批量',
                },
                {
                  label: '标准版', price: '¥9,000–12,000/t',
                  color: 'border-green-400 bg-green-50',
                  materials: 'APP P₂O₅ 71% + PER 95% + MEL 66%N',
                  risks: ['标准工艺即可', 'GB 14907合规'],
                  sop: '标准工艺，温度<120°C',
                  use: '常规生产',
                },
                {
                  label: '高端版', price: '¥13,000–18,000/t',
                  color: 'border-purple-400 bg-purple-50',
                  materials: '进口APP P₂O₅ 73% + PER 98% + 高纯MEL',
                  risks: ['无显著风险', '可加纳米填料'],
                  sop: '可选纳米SiO₂强化炭层',
                  use: '高端防火/认证产品',
                },
              ].map((row, i) => (
                <div key={i} className={`border-l-4 p-4 rounded-lg ${row.color}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-lg font-bold text-slate-900">{row.price}</span>
                      <span className="ml-2 text-xs font-semibold text-slate-500">{row.label}</span>
                    </div>
                    <span className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded text-slate-600">
                      {row.use}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-700">
                    <div><strong>原料：</strong>{row.materials}</div>
                    <div><strong>风险：</strong>{row.risks.join('；')}</div>
                    <div><strong>工艺：</strong>{row.sop}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SOP 检查清单 */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>✅</span>工艺检查清单 SOP Checklist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: '原料准备',
                  tasks: [
                    `检查APP含水量 (<0.5%) — 当前P₂O₅=${app_p2o5}%`,
                    `确认PER纯度 (${per_mono}% Mono-PE)`,
                    '验证MEL含氮量 (>66%)',
                    'APP烘干：110°C / 2h (如有必要)',
                  ],
                },
                {
                  title: '混合工艺',
                  tasks: [
                    `混合温度 50–120°C ${app_p2o5 < 70 ? '⚠️ 建议≤80°C' : ''}`,
                    '搅拌时间 < 30min',
                    '避免长时间持续加热',
                    '检查粘度 (Ford cup 150–200s)',
                  ],
                },
                {
                  title: '固化过程',
                  tasks: [
                    '室温→50°C/4h→80°C/2h',
                    '升温速率 <5°C/min',
                    '监测放热曲线',
                    '防止热失控（备降温措施）',
                  ],
                },
              ].map((group, gi) => (
                <div key={gi} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-sm text-slate-900 mb-3">{group.title}</h4>
                  <ul className="space-y-2">
                    {group.tasks.map((task, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-xs text-slate-700">
                        <input type="checkbox" className="mt-0.5 rounded accent-green-600" />
                        <span>{task}</span>
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
