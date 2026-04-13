'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { currentWeek, type NewsItem } from '@/lib/priceData'
import type { Dictionary } from '@/lib/i18n/dictionaries/zh'
import type { Locale } from '@/lib/i18n/config'

const SALES_EMAIL = 'ryan139@gmail.com'

// ── Inquiry Modal ─────────────────────────────────────
type InquiryForm = {
  name: string; company: string; industry: string
  grade: string; volume: string; contact: string; notes: string
}
const EMPTY_FORM: InquiryForm = {
  name: '', company: '', industry: '', grade: '', volume: '', contact: '', notes: '',
}

function InquiryModal({ onClose, dict }: { onClose: () => void; dict: Dictionary }) {
  const [form, setForm] = useState<InquiryForm>(EMPTY_FORM)
  const [sent, setSent] = useState(false)
  const t = dict.inquiry

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (k: keyof InquiryForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).catch(() => {})
    const ml = t.mailLines
    const mailLines = [
      `${ml.name}: ${form.name}`,
      `${ml.company}: ${form.company}`,
      `${ml.industry}: ${form.industry}`,
      `${ml.grade}: ${form.grade}`,
      `${ml.volume}: ${form.volume} t`,
      `${ml.contact}: ${form.contact}`,
      `${ml.notes}: ${form.notes || '—'}`,
      '',
      '--- sent via PentaPrice ---',
    ].join('\n')
    const subject = encodeURIComponent(`${t.emailSubject} — ${form.company}`)
    const body = encodeURIComponent(mailLines)
    window.open(`mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`)
    setSent(true)
  }

  return (
    <div className="pe-modal-backdrop" onClick={onClose}>
      <div className="pe-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="pe-modal-header">
          <div>
            <h2 className="pe-modal-title">{t.modalTitle}</h2>
            <p className="pe-modal-sub">{t.modalSub}</p>
          </div>
          <button className="pe-modal-close" onClick={onClose} aria-label={t.close}>✕</button>
        </div>

        {sent ? (
          <div className="pe-modal-thanks">
            <div className="pe-modal-thanks-icon">✓</div>
            <h3>{t.thanksTitle}</h3>
            <p>{t.thanksBody.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</p>
            <p className="pe-modal-thanks-email">📧 {SALES_EMAIL}</p>
            <button className="pe-cta-btn" style={{ marginTop: '1rem' }} onClick={onClose}>{t.closeBtn}</button>
          </div>
        ) : (
          <form className="pe-modal-form" onSubmit={handleSubmit}>
            <div className="pe-form-row-2">
              <label className="pe-form-field">
                <span className="pe-form-label">{t.nameLbl} <em>*</em></span>
                <input required value={form.name} onChange={set('name')} placeholder={t.namePlaceholder} />
              </label>
              <label className="pe-form-field">
                <span className="pe-form-label">{t.companyLbl} <em>*</em></span>
                <input required value={form.company} onChange={set('company')} placeholder={t.companyPlaceholder} />
              </label>
            </div>

            <div className="pe-form-row-2">
              <label className="pe-form-field">
                <span className="pe-form-label">{t.industryLbl} <em>*</em></span>
                <select required value={form.industry} onChange={set('industry')}>
                  <option value="">{t.select}</option>
                  {t.industries.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
              <label className="pe-form-field">
                <span className="pe-form-label">{t.gradeLbl} <em>*</em></span>
                <select required value={form.grade} onChange={set('grade')}>
                  <option value="">{t.select}</option>
                  {t.grades.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="pe-form-row-2">
              <label className="pe-form-field">
                <span className="pe-form-label">{t.volumeLbl} <em>*</em></span>
                <input required type="number" min="1" value={form.volume} onChange={set('volume')} placeholder={t.volumePlaceholder} />
              </label>
              <label className="pe-form-field">
                <span className="pe-form-label">{t.contactLbl} <em>*</em></span>
                <input required value={form.contact} onChange={set('contact')} placeholder={t.contactPlaceholder} />
              </label>
            </div>

            <label className="pe-form-field">
              <span className="pe-form-label">{t.notesLbl}</span>
              <textarea rows={3} value={form.notes} onChange={set('notes')} placeholder={t.notesPh} />
            </label>

            <div className="pe-modal-footer">
              <p className="pe-modal-disclaimer">
                {t.disclaimer} {SALES_EMAIL}
              </p>
              <div className="pe-modal-actions">
                <button type="button" className="pe-modal-cancel" onClick={onClose}>{t.cancelBtn}</button>
                <button type="submit" className="pe-cta-btn">{t.submitBtn}</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────
function TrendIcon({ val, dict }: { val: number; dict: Dictionary }) {
  const t = dict.change
  if (val > 0) return <span className="pe-change-up">▲ {val.toLocaleString()} {t.wow}</span>
  if (val < 0) return <span className="pe-change-down">▼ {Math.abs(val).toLocaleString()} {t.wow}</span>
  return <span className="pe-change-flat">{t.flatLabel}</span>
}

function PctBadge({ val, suffix = '% MoM' }: { val: number; suffix?: string }) {
  const cls = val > 0 ? 'pe-change-up' : val < 0 ? 'pe-change-down' : 'pe-change-flat'
  const arrow = val > 0 ? '▲' : val < 0 ? '▼' : '—'
  return <span className={`pe-metric-change ${cls}`}>{arrow} {Math.abs(val)}{suffix}</span>
}

type MetricCardProps = { label: string; labelSub: string; value: string; change: React.ReactNode }
function MetricCard({ label, labelSub, value, change }: MetricCardProps) {
  return (
    <div className="pe-metric-card">
      <p className="pe-metric-label">
        <span>{label}</span>
        <span className="pe-metric-label-en">{labelSub}</span>
      </p>
      <p className="pe-metric-value">{value}</p>
      <div>{change}</div>
    </div>
  )
}

function NewsItemCard({ item, dict }: { item: NewsItem; dict: Dictionary }) {
  const hasBody = Boolean(item.body || item.bodyEn)
  const [open, setOpen] = useState(false)
  const t = dict.news

  return (
    <div className="pe-news-item">
      <div className="pe-news-dot" />
      <div className="pe-news-body">
        <button
          type="button"
          className="pe-news-head"
          onClick={() => hasBody && setOpen(v => !v)}
          aria-expanded={open}
          disabled={!hasBody}
        >
          <p className="pe-news-text">{item.text}</p>
          {item.textEn && <p className="pe-news-text-en">{item.textEn}</p>}
          {hasBody && <span className="pe-news-toggle" aria-hidden="true">{open ? '▾' : '▸'}</span>}
        </button>

        {hasBody && open && (
          <div className="pe-news-detail">
            {item.body && (
              <p className="pe-news-body-text">
                {item.body.split('\n').map((line, i) => (
                  <span key={i}>{line}{i < item.body!.split('\n').length - 1 && <br />}</span>
                ))}
              </p>
            )}
            {item.bodyEn && (
              <p className="pe-news-body-text-en">
                {item.bodyEn.split('\n').map((line, i) => (
                  <span key={i}>{line}{i < item.bodyEn!.split('\n').length - 1 && <br />}</span>
                ))}
              </p>
            )}
          </div>
        )}

        <div className="pe-news-meta">
          <span className="pe-news-tag">{item.tag}{item.tagEn ? ` · ${item.tagEn}` : ''}</span>
          <span>{item.date}</span>
          {item.source && <span className="pe-news-source">· {item.source}</span>}
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="pe-news-link" onClick={e => e.stopPropagation()}>
              {t.readSource}
            </a>
          ) : (
            <span className="pe-news-link-placeholder">{t.noSourceLink}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function NewsList({ items, dict }: { items: NewsItem[]; dict: Dictionary }) {
  return (
    <div className="pe-news-card">
      {items.map((n, i) => <NewsItemCard key={i} item={n} dict={dict} />)}
    </div>
  )
}

// ── Chart colours ─────────────────────────────────────
const C = {
  green:    '#1D9E75', greenBg: 'rgba(29,158,117,0.08)',
  blue:     '#378ADD', amber:   '#BA7517', amberBg: 'rgba(186,117,23,0.08)',
  red:      '#E24B4A', gray:    '#888780',
  gridLine: 'rgba(136,135,128,0.1)', tickColor: '#7a9e8a',
}

function baseLineOptions(yCallback?: (v: number | string) => string) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index' as const, intersect: false } },
    scales: {
      x: { ticks: { font: { size: 11 }, color: C.tickColor, maxTicksLimit: 9 }, grid: { display: false } },
      y: { ticks: { font: { size: 11 }, color: C.tickColor, callback: yCallback ?? ((v: number | string) => String(v)) }, grid: { color: C.gridLine }, border: { display: false } },
    },
  }
}

// ── Mono Panel ────────────────────────────────────────
function MonoPanel({ dict }: { dict: Dictionary }) {
  const d = currentWeek.mono
  const t = dict.mono
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      if (!chartRef.current) return
      chartInstance.current?.destroy()
      const fob = d.history12w.map(v => Math.round(v * 0.13))
      chartInstance.current = new Chart(chartRef.current!, {
        type: 'line',
        data: {
          labels: d.historyLabels,
          datasets: [
            { label: t.legendDomestic, data: d.history12w, borderColor: C.green, backgroundColor: C.greenBg, borderWidth: 2, pointRadius: 3, pointBackgroundColor: C.green, tension: 0.4, fill: true },
            { label: t.legendFob,      data: fob,          borderColor: C.blue, borderDash: [5, 3], borderWidth: 1.5, pointRadius: 0, tension: 0.4, fill: false },
          ],
        },
        options: {
          ...baseLineOptions(v => Number(v) >= 1000 ? '¥' + (Number(v) / 1000).toFixed(0) + 'k' : String(v)),
          plugins: {
            ...baseLineOptions().plugins,
            tooltip: { mode: 'index' as const, intersect: false, callbacks: { label: (ctx: any) => ctx.dataset.label + ': ¥' + ctx.parsed.y.toLocaleString() } },
          },
        },
      })
    })
    return () => chartInstance.current?.destroy()
  }, [d, t.legendDomestic, t.legendFob])

  return (
    <>
      <div className="pe-grid-4">
        <MetricCard label={t.domesticAvg} labelSub={t.domesticAvgSub} value={'¥' + d.domesticAvg.toLocaleString()} change={<TrendIcon val={d.weekChange} dict={dict} />} />
        <MetricCard label={t.grade95} labelSub={t.grade95Sub} value={`¥${d.grade95.low.toLocaleString()}–${d.grade95.high.toLocaleString()}`} change={<span className="pe-change-down pe-metric-change">▼ {Math.abs(d.grade95ChangeWoW)} {dict.change.wow}</span>} />
        <MetricCard label={t.grade98} labelSub={t.grade98Sub} value={`¥${d.grade98.low.toLocaleString()}–${d.grade98.high.toLocaleString()}`} change={<span className="pe-change-up pe-metric-change">▲ {d.grade98ChangeWoW} {dict.change.wow}</span>} />
        <MetricCard label={t.fobQingdao} labelSub={t.fobQingdaoSub} value={'$' + d.fobQingdao.toLocaleString()} change={<span className="pe-change-down pe-metric-change">▼ {Math.abs(d.fobChangeMoM)} {dict.change.mom}</span>} />
      </div>

      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">{t.chartTitle}</p>
          <div className="pe-legend">
            <span><span className="pe-legend-dot" style={{ background: C.green }} /> {t.legendDomestic}</span>
            <span><span className="pe-legend-dot" style={{ background: C.blue }} /> {t.legendFob}</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 230 }}>
          <canvas ref={chartRef} role="img" aria-label="Mono-PE 12-week price trend chart" />
        </div>
      </div>

      <div className="pe-grid-2">
        <div>
          <p className="pe-section-label">{t.regionalTitle}</p>
          <div className="pe-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t.regionHeader}</th>
                  <th>{t.priceHeader}</th>
                </tr>
              </thead>
              <tbody>
                {d.regions.map(r => (
                  <tr key={r.name}>
                    <td>
                      <div className="pe-td-main">{r.name}</div>
                      <div className="pe-td-sub">{r.nameEn}</div>
                    </td>
                    <td className={r.trend === 'up' ? 'td-up' : r.trend === 'down' ? 'td-down' : ''}>{r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="pe-table-note">{t.vatNote}</p>
          </div>
        </div>
        <div>
          <p className="pe-section-label">{t.newsTitle}</p>
          <NewsList items={d.news} dict={dict} />
        </div>
      </div>
    </>
  )
}

// ── Di Panel ──────────────────────────────────────────
function DiPanel({ dict }: { dict: Dictionary }) {
  const d = currentWeek.di
  const t = dict.di
  const trendRef  = useRef<HTMLCanvasElement>(null)
  const supplyRef = useRef<HTMLCanvasElement>(null)
  const trendChart  = useRef<any>(null)
  const supplyChart = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)

      if (trendRef.current) {
        trendChart.current?.destroy()
        trendChart.current = new Chart(trendRef.current, {
          type: 'line',
          data: {
            labels: d.historyLabels,
            datasets: [
              { label: t.legendAvg,     data: d.history18m, borderColor: C.amber, backgroundColor: C.amberBg, borderWidth: 2, pointRadius: 2, tension: 0.3, fill: true },
              { label: t.legendHighEnd, data: d.history18m.map(v => Math.round(v * 1.1)), borderColor: C.red, borderDash: [4, 3], borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
            ],
          },
          options: {
            ...baseLineOptions(v => '¥' + (Number(v) / 1000).toFixed(0) + 'k'),
            plugins: { legend: { display: false }, tooltip: { mode: 'index' as const, intersect: false, callbacks: { label: (ctx: any) => ctx.dataset.label + ': ¥' + ctx.parsed.y.toLocaleString() + '/t' } } },
          },
        })
      }

      if (supplyRef.current) {
        supplyChart.current?.destroy()
        supplyChart.current = new Chart(supplyRef.current, {
          type: 'bar',
          data: {
            labels: [t.supplyLabel, t.demandLabel],
            datasets: [{ data: [d.supply * 10, d.demand * 10], backgroundColor: ['rgba(29,158,117,0.75)', 'rgba(226,75,74,0.75)'], borderColor: [C.green, C.red], borderWidth: 1.5, borderRadius: 6, barThickness: 56 }],
          },
          options: {
            responsive: true, maintainAspectRatio: false, indexAxis: 'y',
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => `~ ${ctx.parsed.x} kt  (${(ctx.parsed.x / 10).toFixed(1)} 万吨)` } } },
            scales: {
              x: { ticks: { color: C.tickColor, callback: (v: any) => v + ' kt' }, grid: { color: C.gridLine }, max: 32, border: { display: false } },
              y: { ticks: { color: C.tickColor, font: { size: 12 } }, grid: { display: false } },
            },
          },
        })
      }
    })
    return () => { trendChart.current?.destroy(); supplyChart.current?.destroy() }
  }, [d, t.legendAvg, t.legendHighEnd, t.supplyLabel, t.demandLabel])

  const gapKt  = ((d.demand - d.supply) * 10).toFixed(0)
  const gapWan = (d.demand - d.supply).toFixed(1)

  return (
    <>
      <div className="pe-grid-4">
        <MetricCard label={t.marketAvg} labelSub={t.marketAvgSub} value={'¥' + d.marketAvg.toLocaleString()} change={<span className="pe-change-down pe-metric-change">▼ ¥{Math.abs(d.marketAvgChangeMoM).toLocaleString()} {t.momLabel}</span>} />
        <MetricCard label={t.highEnd} labelSub={t.highEndSub} value={'¥' + d.highEnd.toLocaleString() + '+'} change={<span className="pe-change-up pe-metric-change">{dict.change.pcbDriven}</span>} />
        <MetricCard label={t.vsOct} labelSub={t.vsOctSub} value={'+' + d.vsOct2024Pct + '%'} change={<span className="pe-change-up pe-metric-change">¥{(d.baseline2024Oct / 1000).toFixed(1)}k → ¥{(d.marketAvg / 1000).toFixed(0)}k /t</span>} />
        <MetricCard label={t.fobExport} labelSub={t.fobExportSub} value={'$' + d.fob.toLocaleString()} change={<span className="pe-change-flat pe-metric-change">{dict.change.tightSupply}</span>} />
      </div>

      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">{t.trendTitle}</p>
          <div className="pe-legend">
            <span><span className="pe-legend-dot" style={{ background: C.amber }} /> {t.legendAvg}</span>
            <span><span className="pe-legend-dot" style={{ background: C.red }} /> {t.legendHighEnd}</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 220 }}>
          <canvas ref={trendRef} role="img" aria-label="Di-PE 18-month price trend chart" />
        </div>
      </div>

      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">{t.supplyTitle}</p>
          <span className="supply-gap-label">{t.gapPrefix} {gapKt} kt ({gapWan} 万吨)</span>
        </div>
        <div style={{ position: 'relative', height: 150 }}>
          <canvas ref={supplyRef} role="img" aria-label="Di-PE supply-demand gap chart" />
        </div>
        <p className="pe-chart-note">{t.chartNote}</p>
      </div>

      <div>
        <p className="pe-section-label">{t.newsTitle}</p>
        <NewsList items={d.news} dict={dict} />
      </div>
    </>
  )
}

// ── International Panel ───────────────────────────────
function IntlPanel({ dict }: { dict: Dictionary }) {
  const d = currentWeek.intl
  const t = dict.intl
  const chartRef  = useRef<HTMLCanvasElement>(null)
  const chartInst = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)
      if (!chartRef.current) return
      chartInst.current?.destroy()
      chartInst.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: d.history.labels,
          datasets: [
            { label: t.legendUS,  data: d.history.us,  borderColor: C.blue,  borderWidth: 2, pointRadius: 2, tension: 0.3, fill: false },
            { label: t.legendEU,  data: d.history.eu,  borderColor: C.green, borderWidth: 2, pointRadius: 2, tension: 0.3, fill: false },
            { label: t.legendCN,  data: d.history.cn,  borderColor: C.amber, borderDash: [4, 3], borderWidth: 2, pointRadius: 2, tension: 0.3, fill: false },
            { label: t.legendSEA, data: d.history.sea, borderColor: C.gray,  borderDash: [2, 4], borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
          ],
        },
        options: {
          ...baseLineOptions(v => '$' + v),
          plugins: { legend: { display: false }, tooltip: { mode: 'index' as const, intersect: false, callbacks: { label: (ctx: any) => ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString() + '/t' } } },
        },
      })
    })
    return () => chartInst.current?.destroy()
  }, [d, t.legendUS, t.legendEU, t.legendCN, t.legendSEA])

  return (
    <>
      <div className="pe-grid-4">
        <MetricCard label={t.usCif}    labelSub={t.usCifSub}    value={'$' + d.us.toLocaleString()}       change={<PctBadge val={d.usChange} />} />
        <MetricCard label={t.euCif}    labelSub={t.euCifSub}    value={'$' + d.europe.toLocaleString()}   change={<PctBadge val={d.euChange} />} />
        <MetricCard label={t.chinaFob} labelSub={t.chinaFobSub} value={'$' + d.chinafob.toLocaleString()} change={<PctBadge val={d.cnChange} />} />
        <MetricCard label={t.seaCif}   labelSub={t.seaCifSub}   value={'$' + d.sea.toLocaleString()}      change={<PctBadge val={d.seaChange} />} />
      </div>

      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">{t.chartTitle}</p>
          <div className="pe-legend">
            <span><span className="pe-legend-dot" style={{ background: C.blue }} />{t.legendUS}</span>
            <span><span className="pe-legend-dot" style={{ background: C.green }} />{t.legendEU}</span>
            <span><span className="pe-legend-dot" style={{ background: C.amber }} />{t.legendCN}</span>
            <span><span className="pe-legend-dot" style={{ background: C.gray }} />{t.legendSEA}</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 250 }}>
          <canvas ref={chartRef} role="img" aria-label="Global pentaerythritol price comparison chart" />
        </div>
      </div>

      <div>
        <p className="pe-section-label">{t.newsTitle}</p>
        <NewsList items={d.news} dict={dict} />
      </div>
    </>
  )
}

// ── Main Component ────────────────────────────────────
export default function PriceDashboard({ lang, dict }: { lang: string; dict: Dictionary }) {
  const [tab, setTab] = useState<'mono' | 'di' | 'intl'>('mono')
  const [showModal, setShowModal] = useState(false)
  const openModal  = useCallback(() => setShowModal(true),  [])
  const closeModal = useCallback(() => setShowModal(false), [])
  const d = currentWeek
  const t = dict

  return (
    <>
    <main className="pe-main">
      {/* Hero */}
      <div className="pe-hero">
        <div>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.subtitle}</p>
        </div>
        <div className="pe-hero-meta">
          <span className="pe-week-badge">{t.hero.thisWeek} · {d.weekLabel}</span>
          <span className="pe-updated">{t.hero.updated}: {d.updatedAt}</span>
        </div>
      </div>

      {/* Calculator nav */}
      <div className="pe-tools-nav">
        <span className="pe-tools-nav-label">{t.tools.label}</span>
        <a href={`/${lang}/calculator/lubricant`}   className="pe-tools-nav-link">{t.tools.lubricant}</a>
        <a href={`/${lang}/calculator/antioxidant`} className="pe-tools-nav-link">{t.tools.antioxidant}</a>
        <a href={`/${lang}/calculator/alkyd`}       className="pe-tools-nav-link">{t.tools.alkyd}</a>
        <a href={`/${lang}/calculator`}             className="pe-tools-nav-all">{t.tools.all}</a>
      </div>

      {/* Tabs */}
      <div className="pe-tabs">
        {([
          ['mono', t.tabs.mono, 'Mono-PE'],
          ['di',   t.tabs.di,   'Di-PE'],
          ['intl', t.tabs.intl, 'Global'],
        ] as const).map(([id, cn]) => (
          <button
            key={id}
            className={`pe-tab-btn ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <span className="pe-tab-cn">{cn}</span>
          </button>
        ))}
      </div>

      {tab === 'mono' && <MonoPanel dict={dict} />}
      {tab === 'di'   && <DiPanel   dict={dict} />}
      {tab === 'intl' && <IntlPanel dict={dict} />}

      {/* Glossary */}
      <div className="pe-glossary">
        <span><strong>¥/t</strong> = {t.glossary.yPerT}</span>
        <span><strong>USD/t</strong> = {t.glossary.usdPerT}</span>
        <span><strong>kt</strong> = {t.glossary.kt}</span>
        <span><strong>WoW</strong> = {t.glossary.wow}</span>
        <span><strong>MoM</strong> = {t.glossary.mom}</span>
        <span><strong>EXW</strong> = {t.glossary.exw}</span>
        <span><strong>FOB</strong> = {t.glossary.fob}</span>
        <span><strong>CIF</strong> = {t.glossary.cif}</span>
      </div>

      {/* CTA */}
      <div className="pe-cta">
        <div>
          <h3>{t.cta.heading}{t.cta.headingEn ? <><br />{t.cta.headingEn}</> : null}</h3>
          <p>{t.cta.body}{t.cta.bodyEn ? <><br />{t.cta.bodyEn}</> : null}</p>
        </div>
        <button className="pe-cta-btn" onClick={openModal}>{t.cta.btn}</button>
      </div>
    </main>

    {showModal && <InquiryModal onClose={closeModal} dict={dict} />}
    </>
  )
}
