'use client'

import { useState, useMemo } from 'react'
import { currentWeek } from '@/lib/priceData'
import type { Dictionary } from '@/lib/i18n/dictionaries/zh'

// ── IFR profile data ──────────────────────────────────
// 数据来源：GB 14907-2018 / GB 12441-2018 / 防火涂料工程实践综合整理
// Source: Chinese fire protection standards + engineering practice
type IFRProfile = {
  app: number       // APP weight ratio per 1 part PER
  mel: number       // MEL weight ratio per 1 part PER
  ifrMin: number    // Min IFR loading in coating formulation (wt%)
  ifrMax: number    // Max IFR loading in coating formulation (wt%)
  expMin: number    // Char expansion ratio min (×)
  expMax: number    // Char expansion ratio max (×)
  std: string       // Applicable standard
  dft: string       // Reference dry film thickness
  note: string      // Technical note
}

const IFR_PROFILES: Record<string, Record<string, IFRProfile>> = {
  steel: {
    '30': {
      app: 3.0, mel: 0.9,
      ifrMin: 35, ifrMax: 42,
      expMin: 15, expMax: 25,
      std: 'GB 14907-2018 一级耐火极限',
      dft: '3–5 mm',
      note: 'APP II型（水溶性低，热稳定性好），PER纯度≥95%。钢结构薄型/超薄型涂料适用。',
    },
    '60': {
      app: 3.5, mel: 1.0,
      ifrMin: 42, ifrMax: 50,
      expMin: 20, expMax: 30,
      std: 'GB 14907-2018 二级耐火极限',
      dft: '5–10 mm',
      note: '典型工业厂房、仓库钢结构用途。建议加入少量蒙脱土/纳米粒子强化炭层。',
    },
    '90': {
      app: 4.0, mel: 1.0,
      ifrMin: 48, ifrMax: 55,
      expMin: 25, expMax: 40,
      std: 'GB 14907-2018 三级耐火极限',
      dft: '10–15 mm',
      note: '高层建筑、厂房主体结构。IFR总载量较高，需关注涂料流平性与附着力。',
    },
    '120': {
      app: 4.0, mel: 1.2,
      ifrMin: 52, ifrMax: 60,
      expMin: 30, expMax: 45,
      std: 'GB 14907-2018 四级耐火极限',
      dft: '15–25 mm',
      note: '超高层建筑核心筒。可考虑引入膨胀石墨（5–10 phr）协效，提高炭层强度。',
    },
  },
  wood: {
    '30': {
      app: 2.5, mel: 0.8,
      ifrMin: 25, ifrMax: 35,
      expMin: 10, expMax: 20,
      std: 'GB 12441-2018 饰面型防火涂料',
      dft: '0.5–2 mm',
      note: '木材饰面型，兼顾装饰性。MEL比例低有助于控制发泡过度，保持涂膜外观。',
    },
    '60': {
      app: 3.0, mel: 1.0,
      ifrMin: 35, ifrMax: 45,
      expMin: 15, expMax: 25,
      std: 'GB 12441-2018 饰面型防火涂料',
      dft: '2–5 mm',
      note: '木结构建筑（古建筑修缮、木屋顶）。水性体系建议选用II型APP，分散性更佳。',
    },
  },
  concrete: {
    '60': {
      app: 3.0, mel: 0.8,
      ifrMin: 32, ifrMax: 42,
      expMin: 12, expMax: 22,
      std: '防火涂料行业标准 / 地铁规范',
      dft: '10–20 mm',
      note: '混凝土防火主要防止高温下爆裂。炭层隔热是关键，膨胀倍率不宜过高。',
    },
    '120': {
      app: 3.5, mel: 1.0,
      ifrMin: 40, ifrMax: 50,
      expMin: 18, expMax: 30,
      std: '地铁/公路隧道防火规范（RABT/HC曲线）',
      dft: '20–35 mm',
      note: '隧道工况温升极快（RABT曲线1200°C），建议配合增韧树脂，防止炭层开裂脱落。',
    },
  },
}

const SUBSTRATE_RATINGS: Record<string, string[]> = {
  steel:    ['30', '60', '90', '120'],
  wood:     ['30', '60'],
  concrete: ['60', '120'],
}

const SUBSTRATE_LABELS: Record<string, string> = {
  steel:    '钢结构 (Steel structure)',
  wood:     '木材 / 木结构 (Wood / Timber)',
  concrete: '混凝土 / 隧道 (Concrete / Tunnel)',
}

const RATING_LABELS: Record<string, string> = {
  '30': '30 分钟 (0.5 h)',
  '60': '60 分钟 (1.0 h)',
  '90': '90 分钟 (1.5 h)',
  '120': '120 分钟 (2.0 h)',
}

// ── Calculation ───────────────────────────────────────
function calculate(perKg: number, profile: IFRProfile, customApp?: number, customMel?: number) {
  const app  = customApp ?? profile.app
  const mel  = customMel ?? profile.mel
  const appKg  = perKg * app
  const melKg  = perKg * mel
  const totalIFR = perKg + appKg + melKg

  const ifrPctMid  = (profile.ifrMin + profile.ifrMax) / 2
  const coatingMin = totalIFR / (profile.ifrMax / 100)   // conservative (higher IFR% → less coating)
  const coatingMax = totalIFR / (profile.ifrMin / 100)   // optimistic

  const pePrice  = currentWeek.mono.grade95.low
  const peCost   = perKg * pePrice / 1000

  // APP reference price ~¥4,500–5,500/t (II型APP)
  const appPriceRef = 5000
  const appCost  = appKg * appPriceRef / 1000

  // MEL reference price ~¥2,200–2,800/t
  const melPriceRef = 2500
  const melCost  = melKg * melPriceRef / 1000

  const totalIFRCost = peCost + appCost + melCost

  return {
    appKg, melKg, totalIFR,
    coatingMin, coatingMax,
    ifrPctMid,
    peCost, appCost, melCost, totalIFRCost,
    appRatio: app, melRatio: mel,
  }
}

function fmt(n: number, d = 1) {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d })
}

// ── Small UI helpers ──────────────────────────────────
function ResultCard({
  icon, label, value, unit, sub, highlight = false,
}: {
  icon: string; label: string; value: string; unit: string; sub?: string; highlight?: boolean;
}) {
  return (
    <div style={{
      background: highlight ? 'var(--pe-green-light)' : 'var(--pe-surface)',
      border: `1px solid ${highlight ? 'var(--pe-green-mid)' : 'var(--pe-border-light)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--pe-text-hint)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span>{icon}</span> {label}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 800, color: highlight ? 'var(--pe-green-dark)' : 'var(--pe-text)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
        {value} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--pe-text-muted)' }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--pe-text-hint)' }}>{sub}</div>}
    </div>
  )
}

// ── Ratio bar ─────────────────────────────────────────
function RatioBar({ app, per, mel }: { app: number; per: number; mel: number }) {
  const total = app + per + mel
  const appPct = (app / total) * 100
  const perPct = (per / total) * 100
  const melPct = (mel / total) * 100
  return (
    <div>
      <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '24px', marginBottom: '8px' }}>
        <div title={`APP ${appPct.toFixed(0)}%`} style={{ width: `${appPct}%`, background: '#1D9E75', transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {appPct > 15 && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>APP {appPct.toFixed(0)}%</span>}
        </div>
        <div title={`PER ${perPct.toFixed(0)}%`} style={{ width: `${perPct}%`, background: '#BA7517', transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {perPct > 10 && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>PER {perPct.toFixed(0)}%</span>}
        </div>
        <div title={`MEL ${melPct.toFixed(0)}%`} style={{ width: `${melPct}%`, background: '#378ADD', transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {melPct > 10 && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>MEL {melPct.toFixed(0)}%</span>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' as const }}>
        {[
          { color: '#1D9E75', label: `聚磷酸铵 APP  ${appPct.toFixed(1)}%` },
          { color: '#BA7517', label: `季戊四醇 PER  ${perPct.toFixed(1)}%` },
          { color: '#378ADD', label: `三聚氰胺 MEL  ${melPct.toFixed(1)}%` },
        ].map(item => (
          <div key={item.color} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--pe-text-muted)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color, flexShrink: 0 }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────
export default function IFRCalc({ lang, dict }: { lang: string; dict: Dictionary }) {
  const [substrate,  setSubstrate]  = useState<string>('steel')
  const [rating,     setRating]     = useState<string>('60')
  const [perKg,      setPerKg]      = useState<number>(10000)  // default 10 吨
  const [customMode, setCustomMode] = useState<boolean>(false)
  const [customApp,  setCustomApp]  = useState<number>(3.5)
  const [customMel,  setCustomMel]  = useState<number>(1.0)

  // Validate rating when substrate changes
  const availableRatings = SUBSTRATE_RATINGS[substrate]
  const validRating = availableRatings.includes(rating) ? rating : availableRatings[0]

  const profile = IFR_PROFILES[substrate][validRating]
  const result  = useMemo(
    () => calculate(perKg, profile, customMode ? customApp : undefined, customMode ? customMel : undefined),
    [perKg, profile, customMode, customApp, customMel],
  )

  const appToUse = customMode ? customApp : profile.app
  const melToUse = customMode ? customMel : profile.mel

  const t = dict.calc

  return (
    <div className="pe-calc-wrapper">
      {/* ── Inputs ── */}
      <div className="pe-calc-panel pe-card">
        <div className="pe-calc-panel-header">
          <h2 className="pe-calc-panel-title">{t.inputs}</h2>
          <button
            className="pe-calc-reset-btn"
            onClick={() => { setSubstrate('steel'); setRating('60'); setPerKg(10000); setCustomMode(false); setCustomApp(3.5); setCustomMel(1.0) }}
            type="button"
          >
            {t.reset}
          </button>
        </div>

        <div className="pe-calc-fields">
          {/* 基材类型 */}
          <label className="pe-calc-field">
            <span className="pe-calc-label">
              基材类型
              <span className="pe-calc-label-en">Substrate type</span>
            </span>
            <div className="pe-calc-input-wrap">
              <select
                className="pe-calc-input pe-calc-select"
                value={substrate}
                onChange={e => {
                  setSubstrate(e.target.value)
                  setRating(SUBSTRATE_RATINGS[e.target.value][0])
                }}
              >
                {Object.entries(SUBSTRATE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </label>

          {/* 耐火极限 */}
          <label className="pe-calc-field">
            <span className="pe-calc-label">
              耐火极限
              <span className="pe-calc-label-en">Fire resistance rating</span>
            </span>
            <div className="pe-calc-input-wrap">
              <select
                className="pe-calc-input pe-calc-select"
                value={validRating}
                onChange={e => setRating(e.target.value)}
              >
                {availableRatings.map(r => (
                  <option key={r} value={r}>{RATING_LABELS[r]}</option>
                ))}
              </select>
            </div>
            <span className="pe-calc-hint">{profile.std} · 参考涂膜厚度 {profile.dft}</span>
          </label>

          {/* PER 采购量 */}
          <label className="pe-calc-field">
            <span className="pe-calc-label">
              季戊四醇采购量 (PER)
              <span className="pe-calc-label-en">Pentaerythritol purchase quantity</span>
            </span>
            <div className="pe-calc-input-wrap">
              <input
                type="number"
                className="pe-calc-input"
                value={perKg}
                min={100}
                max={1000000}
                step={1000}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v > 0) setPerKg(v) }}
              />
              <span className="pe-calc-unit">kg</span>
            </div>
            <span className="pe-calc-hint">
              即 {fmt(perKg / 1000, 1)} 吨 PER · 当前参考价：¥{currentWeek.mono.grade95.low.toLocaleString()}–{currentWeek.mono.grade95.high.toLocaleString()}/吨 (95%)
            </span>
          </label>

          {/* 自定义比例 toggle */}
          <div style={{ padding: '10px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--pe-text-muted)', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={customMode}
                onChange={e => setCustomMode(e.target.checked)}
                style={{ accentColor: 'var(--pe-green)', width: '16px', height: '16px' }}
              />
              自定义 APP:PER:MEL 比例（Custom ratio）
            </label>
            <div style={{ fontSize: '11px', color: 'var(--pe-text-hint)', marginTop: '4px', paddingLeft: '24px' }}>
              勾选后可手动输入配比，适用于已有配方优化数据的情况
            </div>
          </div>

          {customMode && (
            <>
              <label className="pe-calc-field">
                <span className="pe-calc-label">
                  APP 用量比（相对PER）
                  <span className="pe-calc-label-en">APP weight ratio per 1 part PER</span>
                </span>
                <div className="pe-calc-input-wrap">
                  <input type="number" className="pe-calc-input" value={customApp} min={1.0} max={6.0} step={0.1}
                    onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= 1 && v <= 6) setCustomApp(v) }} />
                  <span className="pe-calc-unit">: 1 (PER)</span>
                </div>
              </label>
              <label className="pe-calc-field">
                <span className="pe-calc-label">
                  MEL 用量比（相对PER）
                  <span className="pe-calc-label-en">MEL weight ratio per 1 part PER</span>
                </span>
                <div className="pe-calc-input-wrap">
                  <input type="number" className="pe-calc-input" value={customMel} min={0.5} max={3.0} step={0.1}
                    onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= 0.5 && v <= 3) setCustomMel(v) }} />
                  <span className="pe-calc-unit">: 1 (PER)</span>
                </div>
              </label>
            </>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="pe-calc-panel pe-card">
        <div className="pe-calc-panel-header">
          <h2 className="pe-calc-panel-title">{t.results}</h2>
          <span className="pe-calc-result-badge">{currentWeek.weekLabel}</span>
        </div>

        {/* 三位一体比例 */}
        <div style={{ marginBottom: '1.25rem', padding: '14px 16px', background: 'var(--pe-surface)', border: '1px solid var(--pe-border-light)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--pe-text-hint)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '10px' }}>
            三位一体推荐比例 · IFR "Three-in-One" Ratio
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--pe-green-dark)', fontVariantNumeric: 'tabular-nums', marginBottom: '4px' }}>
            {appToUse.toFixed(1)} : 1 : {melToUse.toFixed(1)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--pe-text-hint)', marginBottom: '12px' }}>
            APP (聚磷酸铵) : PER (季戊四醇) : MEL (三聚氰胺) · 质量比 / Weight ratio
          </div>
          <RatioBar app={appToUse} per={1} mel={melToUse} />
          {!customMode && (
            <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--pe-text-hint)' }}>
              📊 IFR 在涂料配方中推荐占比：{profile.ifrMin}–{profile.ifrMax} wt%
              &nbsp;·&nbsp;
              🔥 炭层膨胀倍率（参考）：{profile.expMin}–{profile.expMax} ×
            </div>
          )}
        </div>

        {/* 配套采购量 — 核心结果 */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--pe-text-hint)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '10px' }}>
            配套采购量 · Procurement Quantities
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px' }}>
            <ResultCard icon="🟠" label="聚磷酸铵 APP 需求量" value={fmt(result.appKg / 1000, 2)} unit="吨" sub={`${fmt(result.appKg)} kg`} highlight />
            <ResultCard icon="🟡" label="季戊四醇 PER 输入量" value={fmt(perKg / 1000, 2)} unit="吨" sub={`(采购量)`} />
            <ResultCard icon="🔵" label="三聚氰胺 MEL 需求量" value={fmt(result.melKg / 1000, 2)} unit="吨" sub={`${fmt(result.melKg)} kg`} highlight />
            <ResultCard icon="⚗️" label="IFR 三组分总量" value={fmt(result.totalIFR / 1000, 2)} unit="吨" sub={`含 PER + APP + MEL`} />
          </div>
        </div>

        {/* 涂料产能估算 */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--pe-text-hint)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '10px' }}>
            涂料产能估算 · Estimated Coating Yield
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            <ResultCard
              icon="🎨"
              label={`防火涂料产量（IFR 占 ${profile.ifrMin}–${profile.ifrMax}%）`}
              value={`${fmt(result.coatingMin / 1000, 1)} – ${fmt(result.coatingMax / 1000, 1)}`}
              unit="吨涂料"
              sub="含树脂/助剂/填料等非IFR组分"
            />
            <ResultCard
              icon="📏"
              label="参考涂膜厚度 (DFT)"
              value={profile.dft}
              unit=""
              sub={`基材：${SUBSTRATE_LABELS[substrate].split('(')[0].trim()}`}
            />
          </div>
        </div>

        {/* 原料成本参考 */}
        <div style={{ marginBottom: '1.25rem', padding: '14px 16px', background: '#FFFBEB', border: '1px solid #FEF08A', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '10px' }}>
            💰 IFR 三组分原料成本参考 · IFR Raw Material Cost Reference
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '10px', fontSize: '12px' }}>
            <div style={{ color: '#78350F' }}>
              <div style={{ fontWeight: 600 }}>季戊四醇 PER</div>
              <div>¥{fmt(result.peCost, 0)}</div>
              <div style={{ opacity: 0.7 }}>@¥{currentWeek.mono.grade95.low.toLocaleString()}/t (95%)</div>
            </div>
            <div style={{ color: '#78350F' }}>
              <div style={{ fontWeight: 600 }}>聚磷酸铵 APP</div>
              <div>¥{fmt(result.appCost, 0)}</div>
              <div style={{ opacity: 0.7 }}>@¥5,000/t (参考，II型)</div>
            </div>
            <div style={{ color: '#78350F' }}>
              <div style={{ fontWeight: 600 }}>三聚氰胺 MEL</div>
              <div>¥{fmt(result.melCost, 0)}</div>
              <div style={{ opacity: 0.7 }}>@¥2,500/t (参考)</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #FEF08A', paddingTop: '8px', fontSize: '13px', fontWeight: 700, color: '#78350F' }}>
            IFR 三组分合计：约 ¥{fmt(result.totalIFRCost, 0)}（APP/MEL价格仅供参考，以实际采购价为准）
          </div>
        </div>

        {/* 捆绑销售建议 — 核心价值 */}
        <div style={{
          background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          color: '#fff',
          marginBottom: '1rem',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.8, marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            📦 配套采购建议 · Bundle Procurement Recommendation
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', lineHeight: 1.5 }}>
            采购 <span style={{ fontSize: '22px', fontWeight: 900 }}>{fmt(perKg / 1000, 1)} 吨</span> 季戊四醇（PER），建议同步配套：
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px' }}>聚磷酸铵 (APP II型)</div>
              <div style={{ fontSize: '24px', fontWeight: 900 }}>{fmt(result.appKg / 1000, 2)} 吨</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>约为 PER 用量的 {appToUse.toFixed(1)} 倍</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px' }}>三聚氰胺 (MEL)</div>
              <div style={{ fontSize: '24px', fontWeight: 900 }}>{fmt(result.melKg / 1000, 2)} 吨</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>约为 PER 用量的 {melToUse.toFixed(1)} 倍</div>
            </div>
          </div>
          <div style={{ fontSize: '12px', opacity: 0.85, lineHeight: 1.6 }}>
            三组分合计 {fmt(result.totalIFR / 1000, 1)} 吨 IFR 体系，可产出防火涂料约{' '}
            <strong>{fmt(result.coatingMin / 1000, 0)}–{fmt(result.coatingMax / 1000, 0)} 吨</strong>
            （基于该耐火极限 IFR 占比 {profile.ifrMin}–{profile.ifrMax}%）
          </div>
        </div>

        {/* 技术说明 */}
        <div style={{ padding: '12px 14px', background: 'var(--pe-surface)', border: '1px solid var(--pe-border-light)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--pe-text-hint)', marginBottom: '6px' }}>
            📋 技术说明 · Technical Notes
          </div>
          <div style={{ fontSize: '12px', color: 'var(--pe-text-muted)', lineHeight: 1.7 }}>
            {profile.note}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--pe-text-hint)', marginTop: '6px' }}>
            参考标准：{profile.std}
          </div>
        </div>

        {/* 免责声明 */}
        <div className="pe-calc-disclaimer">
          本工具比例数据综合自 GB 14907-2018、GB 12441-2018 及防火涂料工程实践资料，仅作配方开发初始参考。
          实际耐火性能须通过国家认可实验室检测（GB/T 9978 系列），配方性能受树脂体系、填料、施工工艺等多因素影响。
          APP/MEL 价格为估算参考值，以实际采购价为准。<br />
          <span style={{ opacity: 0.75 }}>
            Ratio data is for formulation reference only. Fire resistance performance must be verified by accredited laboratory testing. · Data source: PentaPrice
          </span>
        </div>
      </div>
    </div>
  )
}
