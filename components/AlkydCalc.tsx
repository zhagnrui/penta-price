'use client'

import { useState, useMemo } from 'react'
import { currentWeek } from '@/lib/priceData'
import Link from 'next/link'

// ── Oil options ──────────────────────────────────────
type OilOption = {
  label: string
  labelEn: string
  mw: number        // triglyceride MW g/mol
  iodineValue: number
  fattyAcidMW: number
}

const OIL_OPTIONS: Record<string, OilOption> = {
  soybean: { label: '豆油 Soybean oil', labelEn: 'Soybean oil', mw: 875, iodineValue: 130, fattyAcidMW: 279 },
  linseed: { label: '亚麻油 Linseed oil', labelEn: 'Linseed oil', mw: 879, iodineValue: 185, fattyAcidMW: 278 },
  castor:  { label: '蓖麻油 Castor oil',  labelEn: 'Castor oil',  mw: 932, iodineValue: 85,  fattyAcidMW: 298 },
  coconut: { label: '椰子油 Coconut oil', labelEn: 'Coconut oil', mw: 678, iodineValue: 10,  fattyAcidMW: 200 },
}

// ── Polyol options ───────────────────────────────────
type PolyolOption = {
  label: string
  labelEn: string
  mw: number
  functionality: number
  isPE: boolean
}

const POLYOL_OPTIONS: Record<string, PolyolOption> = {
  pe:      { label: '季戊四醇 (PE)',       labelEn: 'Pentaerythritol, PE', mw: 136.15, functionality: 4, isPE: true  },
  glycerol:{ label: '甘油 (Glycerol)',     labelEn: 'Glycerol',           mw: 92.09,  functionality: 3, isPE: false },
}

// ── Oil length category ───────────────────────────────
function oilLengthCategory(oilLength: number): { label: string; labelEn: string; color: string; bg: string } {
  if (oilLength < 40) return { label: '短油', labelEn: 'Short oil', color: '#b91c1c', bg: '#fef2f2' }
  if (oilLength <= 60) return { label: '中油', labelEn: 'Medium oil', color: '#166534', bg: '#f0fdf4' }
  return { label: '长油', labelEn: 'Long oil', color: '#1e40af', bg: '#eff6ff' }
}

// ── Default values ───────────────────────────────────
const DEFAULTS = {
  targetKg:   1000,
  oilLength:  50,
  oilKey:     'soybean' as string,
  polyolKey:  'pe'      as string,
  paRatio:    1.5,
  purity:     98,
}

// ── MW constants ─────────────────────────────────────
const MW_PA       = 148.12   // 苯酐 Phthalic anhydride g/mol
const MW_GLYCEROL = 92.09    // 甘油
const MW_PE_ALKYD = 136.15   // 季戊四醇

// ── Calculation ──────────────────────────────────────
// 方法：脂肪酸法（fatty acid method）
// 1. 确定植物油用量（由油长决定）
// 2. 由 paRatio（PA:多元醇 摩尔比）和多元醇 MW 正向计算 PA 与多元醇用量
// 3. 酸值由 PA 用量与总重推算（OH 基过量决定残余酸值）
function calculate(
  targetKg: number,
  oilLength: number,
  paRatio: number,
  purity: number,
  polyolMW: number,
) {
  const oil_kg         = targetKg * (oilLength / 100)
  const non_oil_kg     = targetKg - oil_kg   // 非油部分 = PA + 多元醇

  // PA 和多元醇的摩尔关系：n_PA / n_polyol = paRatio
  // PA MW=148.12，polyol MW 由用户选择
  // pa_kg / 148.12 = paRatio × (polyol_kg / polyolMW)
  // pa_kg + polyol_kg = non_oil_kg
  // 联立求解：
  const ratio          = (paRatio * polyolMW) / MW_PA   // pa_kg / polyol_kg
  const polyol_kg      = non_oil_kg / (1 + ratio)
  const pa_kg          = non_oil_kg - polyol_kg

  const fatty_acid_kg  = oil_kg * 0.955   // 植物油中脂肪酸含量约95.5%（甘油酯水解后）

  // 酸值估算：残余 COOH 基 ≈ (PA摩尔 - 反应消耗的COOH摩尔) × 56100 / 总质量
  // PA每摩尔含2个COOH；多元醇每摩尔含 functionality 个OH
  // 实际反应COOH消耗 ≈ min(PA×2, 多元醇OH数)
  // 残余COOH ≈ PA×2 - 多元醇OH（当PA过量时为正，即有余酸）
  const pa_moles       = (pa_kg * 1000) / MW_PA
  const polyol_moles   = (polyol_kg * 1000 * (purity / 100)) / polyolMW
  const polyol_fn      = polyolMW === MW_PE_ALKYD ? 4 : 3   // PE官能度4, 甘油3
  const oh_moles       = polyol_moles * polyol_fn
  const cooh_moles     = pa_moles * 2
  const excess_cooh    = Math.max(0, cooh_moles - oh_moles)
  const acid_value     = Math.min(40, (excess_cooh * 56100) / (targetKg * 1000))

  // OH过量比（>1表示OH过量，有利于低酸值）
  const oh_excess_ratio = oh_moles / cooh_moles

  // Composition percentages — 归一化到100%
  const total_check    = oil_kg + pa_kg + polyol_kg
  const oil_pct        = (oil_kg    / total_check) * 100
  const pa_pct         = (pa_kg     / total_check) * 100
  const polyol_pct     = (polyol_kg / total_check) * 100

  // PE cost
  const pe_price       = currentWeek.mono.grade95.low
  const pe_cost        = polyol_kg * pe_price / 1000

  return {
    oil_kg,
    polyol_kg,
    pa_kg,
    fatty_acid_kg,
    acid_value,
    oh_excess_ratio,
    oil_length_check: oilLength,   // 直接用输入值，无需重算
    pe_cost,
    oil_pct,
    pa_pct,
    polyol_pct,
  }
}

function fmt(n: number, decimals = 1): string {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

// ── Number input with validation ────────────────────
function NumInput({
  label, labelEn, value, onChange, min, max, step = 1, unit,
}: {
  label: string; labelEn: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; unit: string;
}) {
  return (
    <label className="pe-calc-field">
      <span className="pe-calc-label">
        {label}
        <span className="pe-calc-label-en">{labelEn}</span>
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
            if (!isNaN(v) && v >= min && v <= max) onChange(v)
          }}
        />
        <span className="pe-calc-unit">{unit}</span>
      </div>
    </label>
  )
}

// ── Result row ───────────────────────────────────────
function ResultRow({ label, labelEn, value, unit, highlight = false }: {
  label: string; labelEn: string; value: string; unit: string; highlight?: boolean;
}) {
  return (
    <div className={`pe-calc-result-row${highlight ? ' pe-calc-result-highlight' : ''}`}>
      <div className="pe-calc-result-label">
        {label}
        <span className="pe-calc-result-label-en">{labelEn}</span>
      </div>
      <div className="pe-calc-result-value">
        {value}
        <span className="pe-calc-result-unit">{unit}</span>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────
export default function AlkydCalc() {
  const [targetKg,  setTargetKg]  = useState(DEFAULTS.targetKg)
  const [oilLength, setOilLength] = useState(DEFAULTS.oilLength)
  const [oilKey,    setOilKey]    = useState(DEFAULTS.oilKey)
  const [polyolKey, setPolyolKey] = useState(DEFAULTS.polyolKey)
  const [paRatio,   setPaRatio]   = useState(DEFAULTS.paRatio)
  const [purity,    setPurity]    = useState(DEFAULTS.purity)

  const oil    = OIL_OPTIONS[oilKey]
  const polyol = POLYOL_OPTIONS[polyolKey]

  const result = useMemo(
    () => calculate(targetKg, oilLength, paRatio, purity, polyol.mw),
    [targetKg, oilLength, paRatio, purity, polyol.mw],
  )

  const oilCat = oilLengthCategory(oilLength)

  const handleReset = () => {
    setTargetKg(DEFAULTS.targetKg)
    setOilLength(DEFAULTS.oilLength)
    setOilKey(DEFAULTS.oilKey)
    setPolyolKey(DEFAULTS.polyolKey)
    setPaRatio(DEFAULTS.paRatio)
    setPurity(DEFAULTS.purity)
  }

  return (
    <div className="pe-calc-wrapper">
      {/* ── Inputs ── */}
      <div className="pe-calc-panel pe-card">
        <div className="pe-calc-panel-header">
          <h2 className="pe-calc-panel-title">输入参数 · Inputs</h2>
          <button className="pe-calc-reset-btn" onClick={handleReset} type="button">
            重置 Reset
          </button>
        </div>

        <div className="pe-calc-fields">
          <NumInput
            label="目标产量"
            labelEn="Target alkyd batch size"
            value={targetKg}
            onChange={setTargetKg}
            min={100}
            max={50000}
            step={100}
            unit="kg"
          />

          {/* 油长 + 类型徽标 */}
          <label className="pe-calc-field">
            <span className="pe-calc-label">
              油长
              <span className="pe-calc-label-en">Oil length</span>
            </span>
            <div className="pe-calc-input-wrap">
              <input
                type="number"
                className="pe-calc-input"
                value={oilLength}
                min={25}
                max={70}
                step={1}
                onChange={e => {
                  const v = parseInt(e.target.value, 10)
                  if (!isNaN(v) && v >= 25 && v <= 70) setOilLength(v)
                }}
              />
              <span className="pe-calc-unit">%</span>
              <span
                style={{
                  background: oilCat.bg,
                  color: oilCat.color,
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '12px',
                  border: `1px solid ${oilCat.color}40`,
                  whiteSpace: 'nowrap',
                }}
              >
                {oilCat.label} · {oilCat.labelEn}
              </span>
            </div>
            <span className="pe-calc-hint">
              短油 &lt;40% · 中油 40–60% · 长油 &gt;60%
            </span>
          </label>

          {/* 植物油种类 */}
          <label className="pe-calc-field">
            <span className="pe-calc-label">
              植物油种类
              <span className="pe-calc-label-en">Vegetable oil type</span>
            </span>
            <div className="pe-calc-input-wrap">
              <select
                className="pe-calc-input pe-calc-select"
                value={oilKey}
                onChange={e => setOilKey(e.target.value)}
              >
                {Object.entries(OIL_OPTIONS).map(([key, opt]) => (
                  <option key={key} value={key}>{opt.label}</option>
                ))}
              </select>
            </div>
            <span className="pe-calc-hint">
              碘值 {oil.iodineValue} · 脂肪酸 MW {oil.fattyAcidMW} g/mol
            </span>
          </label>

          {/* 多元醇种类 */}
          <label className="pe-calc-field">
            <span className="pe-calc-label">
              多元醇种类
              <span className="pe-calc-label-en">Polyol type</span>
            </span>
            <div className="pe-calc-input-wrap">
              <select
                className="pe-calc-input pe-calc-select"
                value={polyolKey}
                onChange={e => setPolyolKey(e.target.value)}
              >
                {Object.entries(POLYOL_OPTIONS).map(([key, opt]) => (
                  <option key={key} value={key}>{opt.label}</option>
                ))}
              </select>
            </div>
            <span className="pe-calc-hint">
              MW = {polyol.mw} g/mol · OH官能度 = {polyol.functionality}
            </span>
          </label>

          <NumInput
            label="苯酐用量比 (PA/多元醇 摩尔比)"
            labelEn="Phthalic anhydride / polyol molar ratio"
            value={paRatio}
            onChange={setPaRatio}
            min={0.8}
            max={2.5}
            step={0.1}
            unit=": 1"
          />

          {/* PE 纯度 — 仅当选择 PE 时显示 */}
          {polyol.isPE && (
            <NumInput
              label="PE 纯度"
              labelEn="PE purity"
              value={purity}
              onChange={setPurity}
              min={95}
              max={99}
              step={0.5}
              unit="%"
            />
          )}

          {/* 当前 PE 价格参考 — 仅当选择 PE 时显示 */}
          {polyol.isPE && (
            <div className="pe-calc-price-ref">
              <span className="pe-calc-price-ref-label">
                当前 PE 参考价 (95%，到厂含税)
                <span className="pe-calc-label-en">Current PE ref. price (95%, delivered incl. VAT)</span>
              </span>
              <span className="pe-calc-price-ref-value">
                ¥{currentWeek.mono.grade95.low.toLocaleString()}–{currentWeek.mono.grade95.high.toLocaleString()}/吨
              </span>
              <Link href="/" className="pe-calc-price-ref-link">
                查看最新行情 →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="pe-calc-panel pe-card">
        <div className="pe-calc-panel-header">
          <h2 className="pe-calc-panel-title">计算结果 · Results</h2>
          <span className="pe-calc-result-badge">{currentWeek.weekLabel}</span>
        </div>

        <div className="pe-calc-results">
          <ResultRow
            label="植物油用量"
            labelEn="Vegetable oil required"
            value={fmt(result.oil_kg)}
            unit="kg"
            highlight
          />
          <ResultRow
            label="多元醇用量"
            labelEn={`${polyol.labelEn} required`}
            value={fmt(result.polyol_kg)}
            unit="kg"
            highlight
          />
          <ResultRow
            label="苯酐用量 (PA)"
            labelEn="Phthalic anhydride required"
            value={fmt(result.pa_kg)}
            unit="kg"
          />
          <ResultRow
            label="脂肪酸当量"
            labelEn="Equivalent fatty acid (ref.)"
            value={fmt(result.fatty_acid_kg)}
            unit="kg"
          />
          <ResultRow
            label="预估酸值"
            labelEn="Estimated acid value"
            value={fmt(result.acid_value, 1)}
            unit="mgKOH/g"
            highlight
          />
          <ResultRow
            label="OH/COOH 摩尔比"
            labelEn="OH/COOH molar ratio (>1 = OH excess, lower AV)"
            value={fmt(result.oh_excess_ratio, 2)}
            unit="×"
          />
          <ResultRow
            label="油长确认"
            labelEn="Oil length confirmation"
            value={fmt(result.oil_length_check, 1)}
            unit="%"
          />
          {polyol.isPE && (
            <ResultRow
              label="PE 原料成本"
              labelEn="PE feedstock cost (grade 95% low)"
              value={`¥${fmt(result.pe_cost, 0)}`}
              unit=""
              highlight
            />
          )}
        </div>

        {/* 配方构成 breakdown bar */}
        <div
          style={{
            marginBottom: '0.75rem',
            background: 'var(--pe-surface)',
            border: '1px solid var(--pe-border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--pe-text-hint)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}
          >
            配方构成 · Composition
          </div>
          {/* Bar */}
          <div
            style={{
              display: 'flex',
              borderRadius: '6px',
              overflow: 'hidden',
              height: '20px',
              marginBottom: '6px',
            }}
          >
            <div
              title={`植物油 ${fmt(result.oil_pct, 1)}%`}
              style={{ width: `${result.oil_pct}%`, background: '#1D9E75', transition: 'width 0.3s' }}
            />
            <div
              title={`苯酐 ${fmt(result.pa_pct, 1)}%`}
              style={{ width: `${result.pa_pct}%`, background: '#0d9488', transition: 'width 0.3s' }}
            />
            <div
              title={`多元醇 ${fmt(result.polyol_pct, 1)}%`}
              style={{ width: `${result.polyol_pct}%`, background: '#94a3b8', transition: 'width 0.3s' }}
            />
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { color: '#1D9E75', label: `植物油 ${fmt(result.oil_pct, 1)}%` },
              { color: '#0d9488', label: `苯酐 ${fmt(result.pa_pct, 1)}%` },
              { color: '#94a3b8', label: `多元醇 ${fmt(result.polyol_pct, 1)}%` },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: 'var(--pe-text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 免责声明 */}
        <div className="pe-calc-disclaimer">
          醇酸树脂配方计算为经验估算，实际配方需根据原料性质、工艺条件和目标性能进行实验室优化。<br />
          <span style={{ opacity: 0.75 }}>
            Alkyd formulation results are engineering approximations only. Actual recipes require lab optimization based on raw material characteristics, process conditions, and target properties. · 数据来源：PentaPrice
          </span>
        </div>
      </div>
    </div>
  )
}
