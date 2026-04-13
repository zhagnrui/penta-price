'use client'

import { useState, useMemo } from 'react'

// ─────────────────────────────────────────────────────────
// IFR 批次配方优化器
// 基于三组分检测报告（COA）做化学计量平衡分析
//
// 核心化学计量关系：
//   APP  → P₂O₅ → H₃PO₄（催化酸源）
//   PER  → –OH 基团（碳源，磷酸酯化后脱水成炭）
//   MEL  → –NH₂/=N– → NH₃ + N₂（气源，驱动炭层膨胀）
//
// 关键比值：
//   n_P / n_OH  ：磷酸 vs 羟基 摩尔比（控制酯化程度）
//   wt%P / wt%N ：P:N 质量比（控制炭层质量与膨胀速率平衡）
//   wt%P in IFR ：磷含量（阻燃效能锚点）
//   wt%N in IFR ：氮含量（膨胀驱动强度）
//
// 参考：Bourbigot & Duquesne (2004), Camino et al.,
//       GB/T 9978 系列（防火涂料测试标准）
// ─────────────────────────────────────────────────────────

// ── Atomic / molecular weights ────────────────────────
const MW = {
  P2O5:    141.94,
  KOH:      56.11,
  P:        30.97,
  N:        14.01,
  PE:      136.15,  // Pentaerythritol C₅H₁₂O₄
  MEL:     126.12,  // Melamine C₃H₆N₆
}

// ── Reference ranges (from IFR literature) ───────────────
// Bourbigot et al. / 国内膨胀阻燃文献综合整理
const REF = {
  // P:N 质量比 —— 酸源与气源平衡
  // < 1.5：磷偏少，炭层催化不足
  // 1.5–2.5：最佳区间
  // > 2.5：磷过量，炭层偏脆
  PN_low:   1.5,
  PN_high:  2.5,

  // P/OH 摩尔比 —— 磷酸对 PER 的酯化程度
  // < 0.5：酯化不完全，大量游离 OH，成炭率低
  // 0.5–1.2：有效酯化区间（单酯/二酯为主）
  // > 1.2：磷酸过量，余酸可能阻碍炭层致密化
  POH_low:  0.5,
  POH_high: 1.2,

  // IFR 混合物中 P 含量（质量分数）
  // < 15%：阻燃效能偏弱
  // 15–22%：工程常用区间
  // > 22%：成本高，且对涂膜力学性能有负面影响
  P_pct_low:  15,
  P_pct_high: 22,

  // IFR 混合物中 N 含量（质量分数）
  // < 8%：发泡驱动不足，膨胀倍率低
  // 8–13%：正常区间
  // > 13%：炭层可能过松，结构强度下降
  N_pct_low:  8,
  N_pct_high: 13,
}

// ── Calculation ───────────────────────────────────────────
function calculate(
  // APP
  app_kg: number, app_p2o5_pct: number,
  // PER
  per_kg: number, per_oh_value: number,
  // MEL
  mel_kg: number, mel_n_pct: number,
) {
  const total_ifr = app_kg + per_kg + mel_kg
  if (total_ifr <= 0) return null

  // ── 摩尔计算 ───────────────────────────────────────────
  // P 来自 APP（每摩尔 P₂O₅ 含 2 mol P）
  const n_P2O5 = (app_kg * 1000 * app_p2o5_pct / 100) / MW.P2O5  // mol P₂O₅
  const n_P    = n_P2O5 * 2                                         // mol P

  // –OH 来自 PER（羟值 mgKOH/g → mol OH）
  // OH value = mg KOH per gram of sample
  const n_OH   = (per_kg * 1000 * per_oh_value) / (MW.KOH * 1000)  // mol OH

  // N 来自 MEL（含氮量 % → mol N）
  const n_N    = (mel_kg * 1000 * mel_n_pct / 100) / MW.N           // mol N

  // ── 质量计算 ───────────────────────────────────────────
  const mass_P  = (n_P  * MW.P)  / 1000   // kg
  const mass_N  = (n_N  * MW.N)  / 1000   // kg

  // ── 关键比值 ────────────────────────────────────────────
  const ratio_POH = n_OH > 0 ? n_P / n_OH : 0   // P/OH 摩尔比
  const ratio_PN  = mass_N > 0 ? mass_P / mass_N : 0   // P:N 质量比

  const pct_P = (mass_P / total_ifr) * 100  // IFR中 P wt%
  const pct_N = (mass_N / total_ifr) * 100  // IFR中 N wt%

  // ── 炭层膨胀倍率预测 ─────────────────────────────────────
  // 基于 IFR 中氮含量（wt%N）的分档估算
  // 参考：氮通过 MEL 热分解为 NH₃/N₂，驱动熔融磷酸酯发泡
  // 文献中 wt%N 10% 左右时膨胀倍率约 20–30×（受粒径、体系粘度影响）
  let exp_min: number, exp_max: number, exp_label: string
  if (pct_N < 6) {
    exp_min = 5;  exp_max = 12;  exp_label = '偏低，膨胀驱动不足'
  } else if (pct_N < 9) {
    exp_min = 12; exp_max = 20;  exp_label = '正常低端'
  } else if (pct_N < 12) {
    exp_min = 20; exp_max = 32;  exp_label = '正常区间（推荐）'
  } else if (pct_N < 15) {
    exp_min = 28; exp_max = 45;  exp_label = '高膨胀，注意炭层强度'
  } else {
    exp_min = 40; exp_max = 60;  exp_label = '过高，炭层可能松散'
  }

  // ── 调整建议 ────────────────────────────────────────────
  const suggestions: { level: 'ok' | 'warn' | 'err'; text: string }[] = []

  // P:N 质量比评价
  if (ratio_PN < REF.PN_low) {
    suggestions.push({ level: 'warn', text: `P:N 质量比 ${ratio_PN.toFixed(2)} 偏低（目标 ${REF.PN_low}–${REF.PN_high}）。磷酸化催化力不足，建议：① 增加 APP 用量，或 ② 换用高 P₂O₅ 含量的 APP（如 ≥72%）。` })
  } else if (ratio_PN > REF.PN_high) {
    suggestions.push({ level: 'warn', text: `P:N 质量比 ${ratio_PN.toFixed(2)} 偏高（目标 ${REF.PN_low}–${REF.PN_high}）。磷酸过量，炭层容易发脆。建议适当减少 APP，或增加 MEL 用量。` })
  } else {
    suggestions.push({ level: 'ok', text: `P:N 质量比 ${ratio_PN.toFixed(2)}，在目标范围 ${REF.PN_low}–${REF.PN_high} 内，酸源与气源平衡。` })
  }

  // P/OH 摩尔比评价
  if (ratio_POH < REF.POH_low) {
    suggestions.push({ level: 'warn', text: `P/OH 摩尔比 ${ratio_POH.toFixed(2)} 偏低（目标 ${REF.POH_low}–${REF.POH_high}）。PER 的 –OH 基团不能被充分磷酸化，成炭效率下降。建议增加 APP 用量。` })
  } else if (ratio_POH > REF.POH_high) {
    suggestions.push({ level: 'warn', text: `P/OH 摩尔比 ${ratio_POH.toFixed(2)} 偏高（目标 ${REF.POH_low}–${REF.POH_high}）。游离磷酸过多，可能影响涂膜稳定性。建议增加 PER 用量或减少 APP。` })
  } else {
    suggestions.push({ level: 'ok', text: `P/OH 摩尔比 ${ratio_POH.toFixed(2)}，PER 磷酸酯化程度合理（以单酯/二酯为主），有利于致密炭层形成。` })
  }

  // P 含量评价
  if (pct_P < REF.P_pct_low) {
    suggestions.push({ level: 'err', text: `IFR 中磷含量 ${pct_P.toFixed(1)}% 低于推荐下限 ${REF.P_pct_low}%。阻燃效能不足，建议提高 APP 比例。` })
  } else if (pct_P > REF.P_pct_high) {
    suggestions.push({ level: 'warn', text: `IFR 中磷含量 ${pct_P.toFixed(1)}% 超过推荐上限 ${REF.P_pct_high}%。成本偏高且炭层力学性能可能下降。` })
  } else {
    suggestions.push({ level: 'ok', text: `磷含量 ${pct_P.toFixed(1)}%，在推荐区间 ${REF.P_pct_low}–${REF.P_pct_high}% 内。` })
  }

  // N 含量评价
  if (pct_N < REF.N_pct_low) {
    suggestions.push({ level: 'err', text: `IFR 中氮含量 ${pct_N.toFixed(1)}% 低于推荐下限 ${REF.N_pct_low}%。膨胀倍率可能不足。建议：① 增加 MEL 用量，或 ② 检查 MEL 含氮量是否达标（纯品应 ≥66%）。` })
  } else if (pct_N > REF.N_pct_high) {
    suggestions.push({ level: 'warn', text: `IFR 中氮含量 ${pct_N.toFixed(1)}% 超过推荐上限 ${REF.N_pct_high}%。膨胀过快可能导致炭层结构疏松。` })
  } else {
    suggestions.push({ level: 'ok', text: `氮含量 ${pct_N.toFixed(1)}%，膨胀驱动力充分。` })
  }

  // 综合评分
  const errs   = suggestions.filter(s => s.level === 'err').length
  const warns  = suggestions.filter(s => s.level === 'warn').length
  const score  = errs > 0 ? 'D' : warns >= 2 ? 'C' : warns === 1 ? 'B' : 'A'
  const scoreColor = { A: '#1D9E75', B: '#BA7517', C: '#D97706', D: '#E24B4A' }[score]

  return {
    n_P, n_OH, n_N,
    mass_P, mass_N,
    ratio_POH, ratio_PN,
    pct_P, pct_N,
    exp_min, exp_max, exp_label,
    suggestions,
    score, scoreColor,
    total_ifr,
  }
}

// ── Number input ──────────────────────────────────────────
function Field({
  label, labelEn, hint, value, onChange, min, max, step, unit,
}: {
  label: string; labelEn: string; hint?: string
  value: number; onChange: (v: number) => void
  min: number; max: number; step: number; unit: string
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
      {hint && <span className="pe-calc-hint">{hint}</span>}
    </label>
  )
}

// ── Ratio gauge ───────────────────────────────────────────
function Gauge({
  label, value, low, high, unit = '', decimals = 2, inverse = false,
}: {
  label: string; value: number; low: number; high: number
  unit?: string; decimals?: number; inverse?: boolean
}) {
  const inRange = value >= low && value <= high
  const color   = inRange ? '#1D9E75' : '#E24B4A'
  const pct     = Math.min(100, Math.max(0, ((value - low * 0.5) / (high * 1.5 - low * 0.5)) * 100))

  return (
    <div style={{ padding: '10px 14px', background: 'var(--pe-surface)', border: `1px solid ${color}30`, borderRadius: 'var(--radius-md)' }}>
      <div style={{ fontSize: '10px', color: 'var(--pe-text-hint)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', marginBottom: '4px' }}>
        {value.toFixed(decimals)}{unit}
      </div>
      <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.4s' }} />
      </div>
      <div style={{ fontSize: '10px', color: 'var(--pe-text-hint)' }}>
        推荐区间 {low}–{high}{unit}
        <span style={{ marginLeft: '6px', color, fontWeight: 700 }}>
          {inRange ? '✓ 合理' : value < low ? '↑ 偏低' : '↓ 偏高'}
        </span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────
export default function IFRBatchCalc() {
  // APP
  const [app_kg,       set_app_kg]       = useState(63.6)
  const [app_p2o5,     set_app_p2o5]     = useState(71.0)   // %
  // PER
  const [per_kg,       set_per_kg]       = useState(18.2)
  const [per_mono_pct, set_per_mono_pct] = useState(95.0)   // 单季含量 %，用于推算羟值
  const [per_oh_manual, set_per_oh_manual] = useState(false)
  const [per_oh_value, set_per_oh_value] = useState(1566.0) // mgKOH/g
  // MEL
  const [mel_kg,       set_mel_kg]       = useState(18.2)
  const [mel_n_manual, set_mel_n_manual] = useState(false)
  const [mel_n_pct,    set_mel_n_pct]    = useState(66.3)   // %

  // 自动推算羟值（可手动覆盖）
  const per_oh_auto  = 1648 * per_mono_pct / 100
  const per_oh_used  = per_oh_manual ? per_oh_value : per_oh_auto
  // 自动推算含氮量（纯三聚氰胺理论值 66.67%，乘以纯度）
  const mel_n_auto   = 66.67
  const mel_n_used   = mel_n_manual ? mel_n_pct : mel_n_auto

  const r = useMemo(
    () => calculate(app_kg, app_p2o5, per_kg, per_oh_used, mel_kg, mel_n_used),
    [app_kg, app_p2o5, per_kg, per_oh_used, mel_kg, mel_n_used],
  )

  const RESET = () => {
    set_app_kg(63.6); set_app_p2o5(71.0)
    set_per_kg(18.2); set_per_mono_pct(95.0); set_per_oh_manual(false); set_per_oh_value(1566)
    set_mel_kg(18.2); set_mel_n_manual(false); set_mel_n_pct(66.3)
  }

  return (
    <div>
      {/* 说明栏 */}
      <div style={{ padding: '14px 18px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '13px', color: '#1e40af', lineHeight: 1.7 }}>
        <strong>使用方法：</strong>将三个原料检测报告（COA）的关键数值填入下方，计算器将根据实际化学计量分析磷酸化程度（P/OH 比）、酸-气平衡（P:N 比），并给出该批次的配方调整建议。
        <br />
        <span style={{ opacity: 0.8 }}>投料量可输入实际生产每锅批次的用量（kg）。</span>
      </div>

      <div className="pe-calc-wrapper">
        {/* ── 输入面板 ── */}
        <div className="pe-calc-panel pe-card">
          <div className="pe-calc-panel-header">
            <h2 className="pe-calc-panel-title">检测报告数值 · COA Inputs</h2>
            <button className="pe-calc-reset-btn" onClick={RESET} type="button">重置 Reset</button>
          </div>

          <div className="pe-calc-fields">
            {/* ──── APP ──── */}
            <div style={{ padding: '8px 0 2px', borderBottom: '1px solid var(--pe-border-light)', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1D9E75', textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>
                🟠 聚磷酸铵 APP (Ammonium Polyphosphate)
              </span>
            </div>

            <Field label="本批用量" labelEn="Batch quantity" value={app_kg} onChange={set_app_kg} min={0.1} max={100000} step={0.1} unit="kg" />
            <Field
              label="P₂O₅ 含量"
              labelEn="Phosphorus pentoxide content (from COA)"
              hint="II型APP典型值 70–72%，该值直接决定磷酸化能力"
              value={app_p2o5}
              onChange={set_app_p2o5}
              min={60} max={78} step={0.1} unit="%"
            />

            {/* ──── PER ──── */}
            <div style={{ padding: '8px 0 2px', borderBottom: '1px solid var(--pe-border-light)', marginBottom: '4px', marginTop: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#BA7517', textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>
                🟡 季戊四醇 PER (Pentaerythritol)
              </span>
            </div>

            <Field label="本批用量" labelEn="Batch quantity" value={per_kg} onChange={set_per_kg} min={0.1} max={100000} step={0.1} unit="kg" />

            {!per_oh_manual ? (
              <Field
                label="单季含量"
                labelEn="Mono-pentaerythritol content (from COA)"
                hint={`检测报告中"季戊四醇含量" → 自动推算羟值 ≈ ${per_oh_auto.toFixed(0)} mgKOH/g`}
                value={per_mono_pct}
                onChange={set_per_mono_pct}
                min={90} max={100} step={0.1} unit="%"
              />
            ) : (
              <Field
                label="羟值（手动输入）"
                labelEn="Hydroxyl value (manual)"
                hint="mgKOH/g，由检测报告直接读取。纯PER理论值 1648 mgKOH/g"
                value={per_oh_value}
                onChange={set_per_oh_value}
                min={1400} max={1700} step={1} unit="mgKOH/g"
              />
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--pe-text-muted)', cursor: 'pointer', paddingBottom: '4px' }}>
              <input type="checkbox" checked={per_oh_manual} onChange={e => set_per_oh_manual(e.target.checked)} style={{ accentColor: '#BA7517' }} />
              报告有羟值数据 — 手动输入羟值（不用单季含量换算）
            </label>

            {/* ──── MEL ──── */}
            <div style={{ padding: '8px 0 2px', borderBottom: '1px solid var(--pe-border-light)', marginBottom: '4px', marginTop: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#378ADD', textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>
                🔵 三聚氰胺 MEL (Melamine)
              </span>
            </div>

            <Field label="本批用量" labelEn="Batch quantity" value={mel_kg} onChange={set_mel_kg} min={0.1} max={100000} step={0.1} unit="kg" />

            {!mel_n_manual ? (
              <div className="pe-calc-field">
                <span className="pe-calc-label">含氮量<span className="pe-calc-label-en">Nitrogen content</span></span>
                <div style={{ padding: '8px 12px', background: 'var(--pe-green-light)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--pe-green-dark)', fontWeight: 600 }}>
                  自动使用纯品理论值：66.67 %
                </div>
                <span className="pe-calc-hint">三聚氰胺（C₃H₆N₆，MW 126.12）理论含氮量。若报告显示≥66%，可直接用理论值。</span>
              </div>
            ) : (
              <Field
                label="含氮量（手动输入）"
                labelEn="Nitrogen content (manual)"
                hint="从检测报告直接读取，纯品理论值 66.67%"
                value={mel_n_pct}
                onChange={set_mel_n_pct}
                min={60} max={67} step={0.1} unit="%"
              />
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--pe-text-muted)', cursor: 'pointer', paddingBottom: '4px' }}>
              <input type="checkbox" checked={mel_n_manual} onChange={e => set_mel_n_manual(e.target.checked)} style={{ accentColor: '#378ADD' }} />
              报告含氮量低于 66%，手动输入实测值
            </label>
          </div>
        </div>

        {/* ── 分析结果 ── */}
        {r && (
          <div className="pe-calc-panel pe-card">
            <div className="pe-calc-panel-header">
              <h2 className="pe-calc-panel-title">化学计量分析 · Stoichiometric Analysis</h2>
              <div style={{
                background: r.scoreColor,
                color: '#fff',
                fontWeight: 900,
                fontSize: '18px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {r.score}
              </div>
            </div>

            {/* 摩尔数明细 */}
            <div style={{ marginBottom: '1.25rem', padding: '12px 16px', background: 'var(--pe-surface)', border: '1px solid var(--pe-border-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--pe-text-hint)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>
                有效摩尔数 · Effective Molar Equivalents
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '12px' }}>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ color: '#1D9E75', fontWeight: 700, fontSize: '10px', marginBottom: '2px' }}>磷 P（来自APP）</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{(r.n_P).toFixed(0)}</div>
                  <div style={{ color: 'var(--pe-text-hint)', fontSize: '10px' }}>mol P</div>
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ color: '#BA7517', fontWeight: 700, fontSize: '10px', marginBottom: '2px' }}>羟基 –OH（来自PER）</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{(r.n_OH).toFixed(0)}</div>
                  <div style={{ color: 'var(--pe-text-hint)', fontSize: '10px' }}>mol OH</div>
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ color: '#378ADD', fontWeight: 700, fontSize: '10px', marginBottom: '2px' }}>氮 N（来自MEL）</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{(r.n_N).toFixed(0)}</div>
                  <div style={{ color: 'var(--pe-text-hint)', fontSize: '10px' }}>mol N</div>
                </div>
              </div>
            </div>

            {/* 四个关键指标 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '1.25rem' }}>
              <Gauge label="P/OH 摩尔比（磷酸酯化程度）" value={r.ratio_POH} low={REF.POH_low} high={REF.POH_high} decimals={2} />
              <Gauge label="P:N 质量比（酸-气平衡）"      value={r.ratio_PN}  low={REF.PN_low}  high={REF.PN_high}  decimals={2} />
              <Gauge label="IFR 中磷含量 P wt%"          value={r.pct_P}     low={REF.P_pct_low} high={REF.P_pct_high} unit="%" decimals={1} />
              <Gauge label="IFR 中氮含量 N wt%"          value={r.pct_N}     low={REF.N_pct_low} high={REF.N_pct_high} unit="%" decimals={1} />
            </div>

            {/* 炭层膨胀倍率 */}
            <div style={{ padding: '12px 16px', background: 'var(--pe-surface)', border: '1px solid var(--pe-border-light)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--pe-text-hint)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>
                预计炭层膨胀倍率（参考区间）
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--pe-text)' }}>
                {r.exp_min}–{r.exp_max}×
              </div>
              <div style={{ fontSize: '11px', color: 'var(--pe-text-hint)', marginTop: '2px' }}>
                {r.exp_label} · 受粒径、树脂体系和涂膜厚度影响，此为估算区间
              </div>
            </div>

            {/* 调整建议 */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--pe-text-hint)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>
                配方调整建议 · Formulation Recommendations
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {r.suggestions.map((s, i) => {
                  const bg    = s.level === 'ok' ? '#F0FDF4' : s.level === 'warn' ? '#FFFBEB' : '#FEF2F2'
                  const border = s.level === 'ok' ? '#86EFAC' : s.level === 'warn' ? '#FDE68A' : '#FCA5A5'
                  const icon   = s.level === 'ok' ? '✅' : s.level === 'warn' ? '⚠️' : '🔴'
                  return (
                    <div key={i} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '12px', color: 'var(--pe-text)', lineHeight: 1.7 }}>
                      {icon} {s.text}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 免责 */}
            <div className="pe-calc-disclaimer">
              化学计量分析基于 APP 的 P₂O₅ 含量、PER 的羟值、MEL 的含氮量精确计算；推荐比值区间综合自 Bourbigot & Duquesne (2004) 等 IFR 体系文献及工程实践。
              炭层膨胀倍率为分档估算，受树脂粘度、粒径分布、涂装工艺等多因素影响，实际性能须通过 GB/T 9978 系列标准检测验证。
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
