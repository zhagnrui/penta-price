'use client'

import { useState, useMemo } from 'react'
import { currentWeek } from '@/lib/priceData'
import type { Dictionary } from '@/lib/i18n/dictionaries/zh'

// ── 脂肪酸选项 ──────────────────────────────────────────────
const ACID_OPTIONS = {
  c5:    { label: 'C5 戊酸',        mw: 102.13, defaultPrice: 9.5  },
  c8:    { label: 'C8 辛酸',        mw: 144.21, defaultPrice: 11.0 },
  c9:    { label: 'C9 壬酸',        mw: 158.24, defaultPrice: 12.5 },
  c10:   { label: 'C10 癸酸',       mw: 172.26, defaultPrice: 13.5 },
  c8c10: { label: '混合 C8/C10',    mw: 158.24, defaultPrice: 12.2 },
}

const MW_PE    = 136.15
const MW_WATER = 18.015

function calculate(peKg: number, acidMW: number, molarRatio: number, purity: number,
                   pePrice: number, acidPrice: number) {
  const peMoles        = (peKg * 1000 * (purity / 100)) / MW_PE
  const acidKg         = (peMoles * molarRatio * acidMW) / 1000
  const esterMW        = MW_PE + 4 * acidMW - 4 * MW_WATER
  const theoreticalKg  = (peMoles * esterMW) / 1000
  const waterKg        = (peMoles * 4 * MW_WATER) / 1000
  const practicalKg    = theoreticalKg * 0.95
  const excessAcidKg   = (peMoles * (molarRatio - 4) * acidMW) / 1000

  const peCost         = peKg * pePrice
  const acidCost       = acidKg * acidPrice
  const totalCost      = peCost + acidCost
  const costPerKg      = practicalKg > 0 ? totalCost / practicalKg : 0

  return { peMoles, acidKg, theoreticalKg, waterKg, practicalKg, excessAcidKg,
           peCost, acidCost, totalCost, costPerKg, esterMW }
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

export default function LubricantCalc({ lang }: { lang: string; dict: Dictionary }) {
  const pe98Low  = currentWeek.mono.grade98.low  / 1000  // ¥/kg
  const pe95Low  = currentWeek.mono.grade95.low  / 1000

  const [peKg,       setPeKg]       = useState(100)
  const [acidKey,    setAcidKey]    = useState('c8')
  const [molarRatio, setMolarRatio] = useState(4.2)
  const [purity,     setPurity]     = useState(98)
  const [pePrice,    setPePrice]    = useState(parseFloat(pe98Low.toFixed(2)))
  const [acidPrice,  setAcidPrice]  = useState(ACID_OPTIONS.c8.defaultPrice)

  const acid   = ACID_OPTIONS[acidKey as keyof typeof ACID_OPTIONS]
  const result = useMemo(
    () => calculate(peKg, acid.mw, molarRatio, purity, pePrice, acidPrice),
    [peKg, acid.mw, molarRatio, purity, pePrice, acidPrice]
  )

  // 技术影响卡片
  const implications = useMemo(() => {
    const cards = []
    // 摩尔比偏高
    if (molarRatio > 4.3) {
      cards.push({ level: 'warning' as const, title: `摩尔比${molarRatio}偏高 — 过量酸成本`,
        driver: `脂肪酸用量 ¥${result.acidCost.toFixed(0)}（占${((result.acidCost/result.totalCost)*100).toFixed(0)}%）`,
        desc: `当前摩尔比${molarRatio}，过量酸约${result.excessAcidKg.toFixed(1)}kg，增加成本但可通过蒸馏回收`,
        mitigation: '摩尔比降至4.05–4.10可节省酸用量，确保高温蒸馏回收过量酸',
        impact: `降至4.05可节省酸≈¥${((molarRatio - 4.05) * result.peMoles * acid.mw / 1000 * acidPrice).toFixed(0)}` })
    }
    // PE是成本主体
    if (result.peCost > result.acidCost) {
      cards.push({ level: 'info' as const, title: `PE是成本主要项（${((result.peCost/result.totalCost)*100).toFixed(0)}%）`,
        driver: `PE ¥${result.peCost.toFixed(0)}，当前价格¥${pePrice}/kg`,
        desc: 'PE为四元醇骨架，无法替代，但纯度规格直接影响单价',
        mitigation: '若下游产品非高端润滑脂，可将PE从98%降至95%，降低采购成本',
        impact: `95%替代98%：¥${pe95Low.toFixed(2)}/kg vs ¥${pe98Low.toFixed(2)}/kg，本批节省¥${(peKg * (pePrice - pe95Low)).toFixed(0)}` })
    }
    // 脂肪酸是成本主体
    if (result.acidCost >= result.peCost) {
      cards.push({ level: 'info' as const, title: `脂肪酸是成本主要项（${((result.acidCost/result.totalCost)*100).toFixed(0)}%）`,
        driver: `${acid.label} ¥${result.acidCost.toFixed(0)}，用量${result.acidKg.toFixed(1)}kg`,
        desc: `${acid.label}(MW=${acid.mw})是产品MW和粘度的决定因素`,
        mitigation: '优化摩尔比至4.05可减少用量；C8比C10价格通常低¥1-2/kg',
        impact: '降低摩尔比或切换酸型是降低本项成本的主要路径' })
    }
    // 98%与95%纯度对比
    if (purity >= 98) {
      cards.push({ level: 'info' as const, title: 'PE 98%纯度 — 是否必要？',
        driver: `PE单价¥${pePrice}/kg，98%溢价约¥${(pePrice - pe95Low).toFixed(2)}/kg`,
        desc: 'PE纯度差异3%（95% vs 98%）对四酯最终产品性能影响可忽略；主要差异在烷基化副产物杂质',
        mitigation: '工业润滑油基础油应用可使用95%；精密润滑脂或医用级才需98%',
        impact: `降级节省¥${(peKg * (pePrice - pe95Low)).toFixed(0)}（本批${peKg}kg）` })
    }
    return cards.slice(0, 3)
  }, [molarRatio, result, acid, purity, pePrice, acidPrice, pe95Low, pe98Low, peKg])

  // 优化建议
  const optimizations = useMemo(() => {
    const cards = []
    if (molarRatio > 4.15) {
      const newAcidKg  = (result.peMoles * 4.05 * acid.mw) / 1000
      const newAcidCost = newAcidKg * acidPrice
      cards.push({ title: '将摩尔比降至4.05', currentCost: result.acidCost, newCost: newAcidCost,
        trade: `过量酸由${result.excessAcidKg.toFixed(1)}kg降至约${(result.peMoles * 0.05 * acid.mw / 1000).toFixed(1)}kg；需确保催化剂活性足够`,
        how: '调整投料计量；加强蒸馏脱酸操作，维持酸值<5 mgKOH/g' })
    }
    if (purity >= 98 && pePrice > pe95Low + 1) {
      const newPeCost = peKg * pe95Low
      cards.push({ title: 'PE 98% → 95% 降级', currentCost: result.peCost, newCost: newPeCost,
        trade: '理论产率降低约1.5%（OH值降幅对应）；产品颜色和杂质无显著变化',
        how: `采购95%单季PE（市场价约¥${pe95Low.toFixed(2)}/kg），适用于工业润滑油基础油` })
    }
    return cards
  }, [molarRatio, result, acid, purity, pePrice, acidPrice, pe95Low, peKg])

  const RESET = () => {
    setPeKg(100); setAcidKey('c8'); setMolarRatio(4.2); setPurity(98)
    setPePrice(parseFloat(pe98Low.toFixed(2))); setAcidPrice(ACID_OPTIONS.c8.defaultPrice)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* 返回 */}
        <div className="mb-4">
          <a href={`/${lang}/calculator`}
            style={{ color: 'var(--pe-green)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
            ← 返回计算工具
          </a>
        </div>

        {/* 标题 */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">润滑油四酯成本仪表板</h1>
            <p className="text-sm text-slate-500 mt-1">POE合成润滑油 · PE四酯收率与成本优化</p>
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
                <h2 className="font-semibold text-slate-900 text-sm">原料配置</h2>
                <p className="text-xs text-slate-400 mt-0.5">填入用量和采购单价</p>
              </div>
              <div className="p-4 space-y-1">

                {/* PE */}
                <div className="text-xs font-bold text-orange-600 pb-2 border-b border-slate-100 mb-2">
                  🟡 季戊四醇 PE
                </div>
                <PriceInput label="用量" value={peKg} unit="kg" min={10} max={100000} step={10} onChange={setPeKg} />
                <label className="pe-calc-field">
                  <span className="pe-calc-label">纯度</span>
                  <div className="pe-calc-input-wrap">
                    <select className="pe-calc-input pe-calc-select" value={purity}
                      onChange={e => { const v = parseInt(e.target.value); setPurity(v); setPePrice(v >= 98 ? parseFloat(pe98Low.toFixed(2)) : parseFloat(pe95Low.toFixed(2))) }}>
                      <option value={98}>98%（工业高纯）</option>
                      <option value={95}>95%（工业标准）</option>
                    </select>
                  </div>
                </label>
                <PriceInput label="采购价" value={pePrice} unit="¥/kg" min={5} max={30} step={0.25} onChange={setPePrice}
                  hint={`市场参考：95%≈¥${pe95Low.toFixed(2)}/kg，98%≈¥${pe98Low.toFixed(2)}/kg`} />

                {/* 脂肪酸 */}
                <div className="text-xs font-bold text-blue-600 pt-3 pb-2 border-b border-slate-100 mb-2 mt-3 border-t border-slate-100">
                  🔵 脂肪酸
                </div>
                <label className="pe-calc-field">
                  <span className="pe-calc-label">种类</span>
                  <div className="pe-calc-input-wrap">
                    <select className="pe-calc-input pe-calc-select" value={acidKey}
                      onChange={e => { setAcidKey(e.target.value); setAcidPrice(ACID_OPTIONS[e.target.value as keyof typeof ACID_OPTIONS].defaultPrice) }}>
                      {Object.entries(ACID_OPTIONS).map(([k, a]) => (
                        <option key={k} value={k}>{a.label}（MW={a.mw}）</option>
                      ))}
                    </select>
                  </div>
                  <span className="pe-calc-hint">分子量 {acid.mw} g/mol</span>
                </label>
                <PriceInput label="摩尔比（酸:PE）" value={molarRatio} unit=":1" min={4.0} max={5.0} step={0.05} onChange={setMolarRatio}
                  hint="推荐4.05–4.20，过高增加过量酸回收负担" />
                <PriceInput label="采购价" value={acidPrice} unit="¥/kg" min={3} max={30} step={0.5} onChange={setAcidPrice}
                  hint={`参考价：C8≈¥11/kg，C10≈¥13.5/kg`} />
              </div>
            </div>
          </div>

          {/* 右侧仪表板 */}
          <div className="lg:col-span-2">

            {/* 成本总览 */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-5 mb-5 border border-slate-200">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">四酯单位成本</div>
                  <div className="text-4xl font-bold text-slate-900 tabular-nums">
                    ¥{result.costPerKg.toFixed(2)}<span className="text-base text-slate-500 ml-1">/kg</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">本批原料总费用</div>
                  <div className="text-xl font-bold text-slate-700 tabular-nums">¥{result.totalCost.toFixed(0)}</div>
                  <div className="text-xs text-slate-500">产出约 {result.practicalKg.toFixed(1)} kg</div>
                </div>
              </div>
            </div>

            {/* 成本分解 */}
            <CostBar items={[
              { label: `PE ${peKg}kg`, cost: result.peCost, color: '#f97316' },
              { label: `${acid.label} ${result.acidKg.toFixed(1)}kg`, cost: result.acidCost, color: '#3b82f6' },
            ]} />

            {/* 关键指标 */}
            <div className="bg-white rounded-lg p-5 mb-5 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">关键技术指标</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <MetricBadge label="预估产量" value={result.practicalKg.toFixed(1)} unit="kg" />
                <MetricBadge label="理论产量" value={result.theoreticalKg.toFixed(1)} unit="kg" />
                <MetricBadge label="脱水量" value={result.waterKg.toFixed(1)} unit="kg" />
                <MetricBadge label="过量酸" value={result.excessAcidKg.toFixed(1)} unit="kg"
                  ok={result.excessAcidKg < 5} note={result.excessAcidKg > 5 ? '可回收' : '正常'} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <MetricBadge label="四酯理论MW" value={result.esterMW.toFixed(1)} unit="g/mol" />
                <MetricBadge label="PE 用量（纯）" value={(peKg * purity / 100).toFixed(1)} unit="kg" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optimizations.map((o, i) => <OptCard key={i} {...o} />)}
            </div>
          </div>
        )}

        {/* 档位决策矩阵 */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">配方档位决策矩阵</h3>
            <div className="space-y-3">
              {[
                { label: '经济版', price: '低成本', color: 'border-blue-400 bg-blue-50',
                  materials: 'PE 95% + C8/C10混酸，摩尔比4.05', risks: ['PE杂质稍高', '需严格酸值控制'],
                  use: '工业基础油/齿轮油' },
                { label: '标准版', price: '常规', color: 'border-green-400 bg-green-50',
                  materials: 'PE 98% + C8辛酸，摩尔比4.15', risks: ['性能稳定可靠'],
                  use: '航空润滑油/压缩机油' },
                { label: '高端版', price: '高成本', color: 'border-purple-400 bg-purple-50',
                  materials: 'PE 98% + 纯C10，摩尔比4.2+催化剂优化', risks: ['成本高但性能最佳'],
                  use: '精密仪器/航天级润滑' },
              ].map((row, i) => (
                <div key={i} className={`border-l-4 p-4 rounded-lg ${row.color}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900">{row.label}</span>
                    <span className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded text-slate-600">{row.use}</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-700">
                    <div><strong>原料：</strong>{row.materials}</div>
                    <div><strong>注意：</strong>{row.risks.join('；')}</div>
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
                { title: '原料准备', tasks: [
                  `PE用量：${peKg}kg（纯量${(peKg * purity / 100).toFixed(1)}kg）`,
                  `脂肪酸：${result.acidKg.toFixed(1)}kg（${acid.label}，MW=${acid.mw}）`,
                  '催化剂准备（硫酸/钛酸酯，0.1–0.3 wt%）',
                  '检查PE含水量（<0.1%）',
                ]},
                { title: '酯化反应', tasks: [
                  '升温至160°C启动，逐步升至230–240°C',
                  '氮气保护，持续分水（Dean-Stark装置）',
                  `监测脱水量≥${(result.waterKg * 0.9).toFixed(1)}kg`,
                  '阶段取样测酸值（目标<5 mgKOH/g）',
                ]},
                { title: '后处理', tasks: [
                  `蒸馏回收过量酸≈${result.excessAcidKg.toFixed(1)}kg`,
                  '水洗/中和处理（pH 6–8）',
                  '真空脱水脱色（160°C / -0.09 MPa）',
                  '成品酸值检测（<0.5 mgKOH/g）',
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
