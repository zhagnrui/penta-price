'use client'

import { useState, useMemo } from 'react'
import { currentWeek } from '@/lib/priceData'
import Link from 'next/link'
import type { Dictionary } from '@/lib/i18n/dictionaries/zh'

const MW_PE       = 136.15
const MW_MDHP     = 292.42
const MW_AO1010   = 1177.63
const MW_METHANOL = 32.04

const DEFAULTS = { targetKg: 1000, pePurity: 98, mdhpPurity: 99, molarExcess: 1.05, yieldPct: 92 }

function calculate(targetKg: number, pePurity: number, mdhpPurity: number, molarExcess: number, yieldPct: number) {
  const yieldFrac     = yieldPct / 100
  const targetMoles   = (targetKg * 1000) / (MW_AO1010 * yieldFrac)
  const peTheoKg      = (targetMoles * MW_PE) / 1000
  const peActualKg    = peTheoKg / (pePurity / 100)
  const mdhpTheoKg    = (targetMoles * 4 * MW_MDHP) / 1000
  const mdhpActualKg  = (mdhpTheoKg * molarExcess) / (mdhpPurity / 100)
  const methanolKg    = (targetMoles * 4 * MW_METHANOL) / 1000
  const theoreticalKg = (targetMoles * MW_AO1010) / 1000
  const pePrice       = currentWeek.mono.grade98.low
  const peCost        = (peActualKg * pePrice) / 1000
  const methanolPrice = 2800
  const methanolValue = (methanolKg * methanolPrice) / 1000
  return { targetMoles, peTheoKg, peActualKg, mdhpActualKg, methanolKg, theoreticalKg, peCost, methanolValue }
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function NumInput({ label, labelEn, value, onChange, min, max, step = 1, unit }: {
  label: string; labelEn: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; unit: string;
}) {
  return (
    <label className="pe-calc-field">
      <span className="pe-calc-label">{label}<span className="pe-calc-label-en">{labelEn}</span></span>
      <div className="pe-calc-input-wrap">
        <input type="number" className="pe-calc-input" value={value} min={min} max={max} step={step}
          onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= min && v <= max) onChange(v) }} />
        <span className="pe-calc-unit">{unit}</span>
      </div>
    </label>
  )
}

function ResultRow({ label, labelEn, value, unit, highlight = false }: {
  label: string; labelEn: string; value: string; unit: string; highlight?: boolean;
}) {
  return (
    <div className={`pe-calc-result-row${highlight ? ' pe-calc-result-highlight' : ''}`}>
      <div className="pe-calc-result-label">{label}<span className="pe-calc-result-label-en">{labelEn}</span></div>
      <div className="pe-calc-result-value">{value}<span className="pe-calc-result-unit">{unit}</span></div>
    </div>
  )
}

export default function AntioxidantCalc({ lang, dict }: { lang: string; dict: Dictionary }) {
  const [targetKg,    setTargetKg]    = useState(DEFAULTS.targetKg)
  const [pePurity,    setPePurity]    = useState(DEFAULTS.pePurity)
  const [mdhpPurity,  setMdhpPurity]  = useState(DEFAULTS.mdhpPurity)
  const [molarExcess, setMolarExcess] = useState(DEFAULTS.molarExcess)
  const [yieldPct,    setYieldPct]    = useState(DEFAULTS.yieldPct)

  const result = useMemo(() => calculate(targetKg, pePurity, mdhpPurity, molarExcess, yieldPct),
    [targetKg, pePurity, mdhpPurity, molarExcess, yieldPct])

  const handleReset = () => {
    setTargetKg(DEFAULTS.targetKg); setPePurity(DEFAULTS.pePurity)
    setMdhpPurity(DEFAULTS.mdhpPurity); setMolarExcess(DEFAULTS.molarExcess); setYieldPct(DEFAULTS.yieldPct)
  }

  const t = dict.calc

  return (
    <div className="pe-calc-wrapper">
      <div className="pe-calc-panel pe-card">
        <div className="pe-calc-panel-header">
          <h2 className="pe-calc-panel-title">{t.inputs}</h2>
          <button className="pe-calc-reset-btn" onClick={handleReset} type="button">{t.reset}</button>
        </div>
        <div className="pe-calc-fields">
          <NumInput label="目标产量" labelEn="Target AO1010 production" value={targetKg} onChange={setTargetKg} min={100} max={100000} step={100} unit="kg" />
          <NumInput label="PE 纯度" labelEn="Pentaerythritol purity" value={pePurity} onChange={setPePurity} min={95} max={99} step={0.5} unit="%" />
          <NumInput label="MDHP 纯度" labelEn="MDHP intermediate purity" value={mdhpPurity} onChange={setMdhpPurity} min={97} max={100} step={0.5} unit="%" />
          <NumInput label="摩尔过量系数 (MDHP)" labelEn="MDHP molar excess over stoichiometric" value={molarExcess} onChange={setMolarExcess} min={1.00} max={1.20} step={0.01} unit="×" />
          <NumInput label="综合收率" labelEn="Overall process yield" value={yieldPct} onChange={setYieldPct} min={80} max={98} step={1} unit="%" />

          <div className="pe-calc-price-ref">
            <span className="pe-calc-price-ref-label">
              当前 PE 参考价 (98%，到厂含税)<span className="pe-calc-label-en">Current PE ref. price (98%, EXW incl. VAT)</span>
            </span>
            <span className="pe-calc-price-ref-value">
              ¥{currentWeek.mono.grade98.low.toLocaleString()}–{currentWeek.mono.grade98.high.toLocaleString()}/吨
            </span>
            <Link href={`/${lang}`} className="pe-calc-price-ref-link">{t.priceRefLink}</Link>
          </div>
        </div>
      </div>

      <div className="pe-calc-panel pe-card">
        <div className="pe-calc-panel-header">
          <h2 className="pe-calc-panel-title">{t.results}</h2>
          <span className="pe-calc-result-badge">{currentWeek.weekLabel}</span>
        </div>
        <div className="pe-calc-results">
          <ResultRow label="理论批次PE用量" labelEn="Stoichiometric PE requirement" value={fmt(result.peTheoKg)} unit="kg" />
          <ResultRow label="实际PE投料量" labelEn="Actual PE feed (incl. purity)" value={fmt(result.peActualKg)} unit="kg" highlight />
          <ResultRow label="MDHP 需求量" labelEn="MDHP required (with excess & purity)" value={fmt(result.mdhpActualKg)} unit="kg" />
          <ResultRow label="副产甲醇量" labelEn="Methanol byproduct (stoichiometric)" value={fmt(result.methanolKg)} unit="kg" />
          <ResultRow label={`理论AO1010生成量（${yieldPct}%收率前）`} labelEn={`Theoretical AO1010 before yield loss (÷${yieldPct}%)`} value={fmt(result.theoreticalKg)} unit="kg" />
          <ResultRow label="副产甲醇参考回收价值（¥2,800/t）" labelEn="Methanol byproduct recovery value (ref. price ¥2,800/t)" value={`¥${fmt(result.methanolValue, 0)}`} unit="" />
          <ResultRow label="当前PE原料成本" labelEn="PE feedstock cost (grade 98% low)" value={`¥${fmt(result.peCost, 0)}`} unit="" highlight />
        </div>
        <div className="pe-calc-mw-note">
          <span>投料摩尔数 Batch moles (AO1010)：</span>
          <strong>{fmt(result.targetMoles / 1000, 4)} mol × 10³</strong>
        </div>
        <div className="pe-calc-disclaimer">
          计算结果仅供参考，实际收率受反应温度、催化剂活性、后处理损耗等因素影响。<br />
          <span style={{ opacity: 0.75 }}>Results are for reference only; actual yield depends on catalyst activity, reaction temperature, and post-treatment losses. 数据来源：PentaPrice</span>
        </div>
      </div>
    </div>
  )
}
