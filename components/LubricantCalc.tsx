'use client'

import { useState, useMemo } from 'react'
import { currentWeek } from '@/lib/priceData'
import Link from 'next/link'
import type { Dictionary } from '@/lib/i18n/dictionaries/zh'

// ── Fatty acid data ──────────────────────────────────
type AcidOption = { label: string; labelEn: string; mw: number }
const ACID_OPTIONS: Record<string, AcidOption> = {
  c5:    { label: 'C5 戊酸 (Valeric acid)',    labelEn: 'Valeric acid, C5',         mw: 102.13 },
  c8:    { label: 'C8 辛酸 (Caprylic acid)',   labelEn: 'Caprylic acid, C8',        mw: 144.21 },
  c9:    { label: 'C9 壬酸 (Pelargonic acid)', labelEn: 'Pelargonic acid, C9',      mw: 158.24 },
  c10:   { label: 'C10 癸酸 (Capric acid)',    labelEn: 'Capric acid, C10',         mw: 172.26 },
  c8c10: { label: '混合 C8/C10 (1:1 blend)',   labelEn: 'Mixed C8/C10 blend (1:1)', mw: (144.21 + 172.26) / 2 },
}

const MW_PE    = 136.15
const MW_WATER = 18.015

const DEFAULTS = { peKg: 100, acidKey: 'c8' as string, molarRatio: 4.2, purity: 98 }

function calculate(peKg: number, acidMW: number, molarRatio: number, purity: number) {
  const peMoles         = (peKg * 1000 * (purity / 100)) / MW_PE
  const acidMolesNeeded = peMoles * molarRatio
  const acidKg          = (acidMolesNeeded * acidMW) / 1000
  const esterMW         = MW_PE + 4 * acidMW - 4 * MW_WATER
  const theoreticalKg   = (peMoles * esterMW) / 1000
  const waterKg         = (peMoles * 4 * MW_WATER) / 1000
  const practicalYield  = theoreticalKg * 0.95
  const excessAcidKg    = (acidMolesNeeded - peMoles * 4) * acidMW / 1000
  const pePrice         = currentWeek.mono.grade98.low
  const peCost          = peKg * pePrice / 1000
  return { peMoles, acidKg, theoreticalKg, waterKg, excessAcidKg, practicalYield, peCost, esterMW }
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

export default function LubricantCalc({ lang, dict }: { lang: string; dict: Dictionary }) {
  const [peKg,       setPeKg]       = useState(DEFAULTS.peKg)
  const [acidKey,    setAcidKey]    = useState(DEFAULTS.acidKey)
  const [molarRatio, setMolarRatio] = useState(DEFAULTS.molarRatio)
  const [purity,     setPurity]     = useState(DEFAULTS.purity)

  const acid   = ACID_OPTIONS[acidKey]
  const result = useMemo(() => calculate(peKg, acid.mw, molarRatio, purity), [peKg, acid.mw, molarRatio, purity])

  const handleReset = () => { setPeKg(DEFAULTS.peKg); setAcidKey(DEFAULTS.acidKey); setMolarRatio(DEFAULTS.molarRatio); setPurity(DEFAULTS.purity) }

  const t = dict.calc

  return (
    <div className="pe-calc-wrapper">
      <div className="pe-calc-panel pe-card">
        <div className="pe-calc-panel-header">
          <h2 className="pe-calc-panel-title">{t.inputs}</h2>
          <button className="pe-calc-reset-btn" onClick={handleReset} type="button">{t.reset}</button>
        </div>
        <div className="pe-calc-fields">
          <NumInput label="PE 用量" labelEn="Pentaerythritol amount" value={peKg} onChange={setPeKg} min={1} max={100000} step={10} unit="kg" />

          <label className="pe-calc-field">
            <span className="pe-calc-label">脂肪酸种类<span className="pe-calc-label-en">Fatty acid type</span></span>
            <div className="pe-calc-input-wrap">
              <select className="pe-calc-input pe-calc-select" value={acidKey} onChange={e => setAcidKey(e.target.value)}>
                {Object.entries(ACID_OPTIONS).map(([key, opt]) => <option key={key} value={key}>{opt.label}</option>)}
              </select>
            </div>
            <span className="pe-calc-hint">MW = {acid.mw.toFixed(2)} g/mol</span>
          </label>

          <NumInput label="摩尔比 (脂肪酸 : PE)" labelEn="Molar ratio (acid : PE)" value={molarRatio} onChange={setMolarRatio} min={4.0} max={5.0} step={0.1} unit=": 1" />
          <NumInput label="PE 纯度" labelEn="PE purity" value={purity} onChange={setPurity} min={95} max={99} step={0.5} unit="%" />

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
          <ResultRow label="脂肪酸需求量" labelEn="Fatty acid required" value={fmt(result.acidKg)} unit="kg" />
          <ResultRow label="理论四酯产量" labelEn="Theoretical tetraester yield" value={fmt(result.theoreticalKg)} unit="kg" />
          <ResultRow label="脱水量（缩合水）" labelEn="Condensation water removed" value={fmt(result.waterKg)} unit="kg" />
          <ResultRow label="过量酸回收量（可循环利用）" labelEn="Excess acid recoverable (distillation recycle)" value={fmt(result.excessAcidKg)} unit="kg" />
          <ResultRow label="实际预估产量 (收率 95%)" labelEn="Practical yield (η = 0.95, incl. distillation loss)" value={fmt(result.practicalYield)} unit="kg" highlight />
          <ResultRow label="当前 PE 原料成本" labelEn="PE feedstock cost (grade 98% low)" value={`¥${fmt(result.peCost, 0)}`} unit="" highlight />
        </div>
        <div className="pe-calc-mw-note">
          <span>四酯理论分子量 Tetraester MW：</span>
          <strong>{fmt(result.esterMW, 1)} g/mol</strong>
        </div>
        <div className="pe-calc-disclaimer">
          计算结果仅供参考，实际收率受反应温度、催化剂、真空度等条件影响。<br />
          <span style={{ opacity: 0.75 }}>Results are for reference only; actual yield depends on reaction conditions. 数据来源：PentaPrice</span>
        </div>
      </div>
    </div>
  )
}
