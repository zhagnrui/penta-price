'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { currentWeek, type NewsItem } from '@/lib/priceData'

const SALES_EMAIL = 'ryan139@gmail.com'

// ── 询盘 Modal ────────────────────────────────────────
type InquiryForm = {
  name: string
  company: string
  industry: string
  grade: string
  volume: string
  contact: string
  notes: string
}

const EMPTY_FORM: InquiryForm = {
  name: '', company: '', industry: '', grade: '', volume: '', contact: '', notes: '',
}

function InquiryModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<InquiryForm>(EMPTY_FORM)
  const [sent, setSent] = useState(false)

  // ESC 关闭
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (k: keyof InquiryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. POST to API (Resend email) — fire and don't block UX on failure
    fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    }).catch(() => { /* silently fall back to mailto */ })

    // 2. Also open mailto as a reliable fallback
    const mailLines = [
      `姓名 / Name: ${form.name}`,
      `公司 / Company: ${form.company}`,
      `行业 / Industry: ${form.industry}`,
      `需求规格 / Grade: ${form.grade}`,
      `预计月用量 / Monthly volume: ${form.volume} 吨/t`,
      `联系方式 / Contact (email/WeChat): ${form.contact}`,
      `备注 / Notes: ${form.notes || '—'}`,
      '',
      '--- sent via PentaPrice ---',
    ].join('\n')
    const subject  = encodeURIComponent(`季戊四醇询价 / Pentaerythritol Quote — ${form.company}`)
    const mailBody = encodeURIComponent(mailLines)
    window.open(`mailto:${SALES_EMAIL}?subject=${subject}&body=${mailBody}`)

    setSent(true)
  }

  return (
    <div className="pe-modal-backdrop" onClick={onClose}>
      <div className="pe-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="询盘表单">
        <div className="pe-modal-header">
          <div>
            <h2 className="pe-modal-title">获取报价 · Request a Quote</h2>
            <p className="pe-modal-sub">填写后将打开您的邮件客户端 · Opens your email client on submit</p>
          </div>
          <button className="pe-modal-close" onClick={onClose} aria-label="关闭">✕</button>
        </div>

        {sent ? (
          <div className="pe-modal-thanks">
            <div className="pe-modal-thanks-icon">✓</div>
            <h3>邮件客户端已打开 / Email client opened</h3>
            <p>请在邮件客户端中确认发送。我们将在 1 个工作日内回复。<br />Please confirm send in your email client. We reply within 1 business day.</p>
            <p className="pe-modal-thanks-email">📧 {SALES_EMAIL}</p>
            <button className="pe-cta-btn" style={{ marginTop: '1rem' }} onClick={onClose}>关闭 / Close</button>
          </div>
        ) : (
          <form className="pe-modal-form" onSubmit={handleSubmit}>
            <div className="pe-form-row-2">
              <label className="pe-form-field">
                <span className="pe-form-label">姓名 Name <em>*</em></span>
                <input required value={form.name} onChange={set('name')} placeholder="张三 / Zhang San" />
              </label>
              <label className="pe-form-field">
                <span className="pe-form-label">公司 Company <em>*</em></span>
                <input required value={form.company} onChange={set('company')} placeholder="XX化工有限公司" />
              </label>
            </div>

            <div className="pe-form-row-2">
              <label className="pe-form-field">
                <span className="pe-form-label">行业 Industry <em>*</em></span>
                <select required value={form.industry} onChange={set('industry')}>
                  <option value="">请选择 / Please select</option>
                  <option value="涂料 / Coatings">涂料 / Coatings</option>
                  <option value="润滑油 / Lubricants">润滑油 / Lubricants</option>
                  <option value="抗氧剂 / Antioxidants">抗氧剂 / Antioxidants</option>
                  <option value="其他 / Other">其他 / Other</option>
                </select>
              </label>
              <label className="pe-form-field">
                <span className="pe-form-label">需求规格 Grade <em>*</em></span>
                <select required value={form.grade} onChange={set('grade')}>
                  <option value="">请选择 / Please select</option>
                  <option value="单季 95% Mono-PE 95%">单季 95% / Mono-PE 95%</option>
                  <option value="单季 98% Mono-PE 98%">单季 98% / Mono-PE 98%</option>
                  <option value="双季 Di-PE">双季 / Di-PE</option>
                </select>
              </label>
            </div>

            <div className="pe-form-row-2">
              <label className="pe-form-field">
                <span className="pe-form-label">预计月用量 Monthly volume (吨/t) <em>*</em></span>
                <input required type="number" min="1" value={form.volume} onChange={set('volume')} placeholder="e.g. 50" />
              </label>
              <label className="pe-form-field">
                <span className="pe-form-label">联系方式 Contact (email / WeChat) <em>*</em></span>
                <input required value={form.contact} onChange={set('contact')} placeholder="email 或 微信号" />
              </label>
            </div>

            <label className="pe-form-field">
              <span className="pe-form-label">备注 Notes</span>
              <textarea rows={3} value={form.notes} onChange={set('notes')} placeholder="交货地、包装要求、其他说明… / Delivery location, packaging, other requirements…" />
            </label>

            <div className="pe-modal-footer">
              <p className="pe-modal-disclaimer">
                提交后将打开您默认邮件客户端，收件人已预填为 {SALES_EMAIL}
                <br />
                On submit your email client opens pre-addressed to {SALES_EMAIL}
              </p>
              <div className="pe-modal-actions">
                <button type="button" className="pe-modal-cancel" onClick={onClose}>取消 / Cancel</button>
                <button type="submit" className="pe-cta-btn">发送询价 / Send inquiry →</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ── 通用小组件 ────────────────────────────────────────

// 双语标签：中文主，英文副
function BiLabel({ cn, en }: { cn: string; en: string }) {
  return (
    <span className="pe-bi">
      <span className="pe-bi-cn">{cn}</span>
      <span className="pe-bi-en">{en}</span>
    </span>
  )
}

function TrendIcon({ val }: { val: number }) {
  if (val > 0) return <span className="pe-change-up">▲ {val.toLocaleString()} WoW / 较上周</span>
  if (val < 0) return <span className="pe-change-down">▼ {Math.abs(val).toLocaleString()} WoW / 较上周</span>
  return <span className="pe-change-flat">— flat WoW / 与上周持平</span>
}

function PctBadge({ val, suffix = '% MoM' }: { val: number; suffix?: string }) {
  const cls = val > 0 ? 'pe-change-up' : val < 0 ? 'pe-change-down' : 'pe-change-flat'
  const arrow = val > 0 ? '▲' : val < 0 ? '▼' : '—'
  return <span className={`pe-metric-change ${cls}`}>{arrow} {Math.abs(val)}{suffix}</span>
}

// 指标卡：支持双语 label
type MetricCardProps = {
  labelCn: string
  labelEn: string
  value: string
  change: React.ReactNode
}
function MetricCard({ labelCn, labelEn, value, change }: MetricCardProps) {
  return (
    <div className="pe-metric-card">
      <p className="pe-metric-label">
        <span>{labelCn}</span>
        <span className="pe-metric-label-en">{labelEn}</span>
      </p>
      <p className="pe-metric-value">{value}</p>
      <div>{change}</div>
    </div>
  )
}

// 新闻条目：标题 + 正文段落（可展开/收起）+ 元信息 + 来源外链
function NewsItemCard({ item }: { item: NewsItem }) {
  const hasBody = Boolean(item.body || item.bodyEn)
  // 默认收起，版面紧凑；读者点击标题行展开正文
  const [open, setOpen] = useState(false)

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
          {hasBody && (
            <span className="pe-news-toggle" aria-hidden="true">
              {open ? '▾' : '▸'}
            </span>
          )}
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
          <span className="pe-news-tag">
            {item.tag}{item.tagEn ? ` · ${item.tagEn}` : ''}
          </span>
          <span>{item.date}</span>
          {item.source && <span className="pe-news-source">· {item.source}</span>}
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pe-news-link"
              onClick={e => e.stopPropagation()}
            >
              ↗ 阅读原文 / Read source
            </a>
          ) : (
            <span className="pe-news-link-placeholder">· 暂无外链 / no source link</span>
          )}
        </div>
      </div>
    </div>
  )
}

function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <div className="pe-news-card">
      {items.map((n, i) => <NewsItemCard key={i} item={n} />)}
    </div>
  )
}

// ── Chart 颜色常量 ───────────────────────────────────
const C = {
  green:     '#1D9E75',
  greenBg:   'rgba(29,158,117,0.08)',
  blue:      '#378ADD',
  amber:     '#BA7517',
  amberBg:   'rgba(186,117,23,0.08)',
  red:       '#E24B4A',
  gray:      '#888780',
  gridLine:  'rgba(136,135,128,0.1)',
  tickColor: '#7a9e8a',
}

// ── 公共 Chart Options ────────────────────────────────
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

// ── 单季 Tab ──────────────────────────────────────────
function MonoPanel() {
  const d = currentWeek.mono
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
            { label: 'China domestic avg / 国内均价 (¥/t)', data: d.history12w, borderColor: C.green, backgroundColor: C.greenBg, borderWidth: 2, pointRadius: 3, pointBackgroundColor: C.green, tension: 0.4, fill: true },
            { label: 'FOB×10 (USD/t)', data: fob, borderColor: C.blue, borderDash: [5, 3], borderWidth: 1.5, pointRadius: 0, tension: 0.4, fill: false },
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
  }, [d])

  return (
    <>
      {/* 指标卡 */}
      <div className="pe-grid-4">
        <MetricCard
          labelCn="国内均价"
          labelEn="Domestic avg (¥/t)"
          value={'¥' + d.domesticAvg.toLocaleString()}
          change={<TrendIcon val={d.weekChange} />}
        />
        <MetricCard
          labelCn="95% 含量出厂含税"
          labelEn="95% grade EXW incl. VAT (¥/t)"
          value={`¥${d.grade95.low.toLocaleString()}–${d.grade95.high.toLocaleString()}`}
          change={<span className="pe-change-down pe-metric-change">▼ {Math.abs(d.grade95ChangeWoW)} WoW / 较上周</span>}
        />
        <MetricCard
          labelCn="98% 含量出厂含税"
          labelEn="98% grade EXW incl. VAT (¥/t)"
          value={`¥${d.grade98.low.toLocaleString()}–${d.grade98.high.toLocaleString()}`}
          change={<span className="pe-change-up pe-metric-change">▲ {d.grade98ChangeWoW} WoW / 较上周</span>}
        />
        <MetricCard
          labelCn="FOB 青岛"
          labelEn="FOB Qingdao (USD/t)"
          value={'$' + d.fobQingdao.toLocaleString()}
          change={<span className="pe-change-down pe-metric-change">▼ {Math.abs(d.fobChangeMoM)} MoM / 较上月</span>}
        />
      </div>

      {/* 走势图 */}
      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">
            单季戊四醇近12周价格走势 · Mono-PE 12-Week Price Trend
          </p>
          <div className="pe-legend">
            <span><span className="pe-legend-dot" style={{ background: C.green }} /> 国内均价 Domestic (¥/t)</span>
            <span><span className="pe-legend-dot" style={{ background: C.blue }} /> FOB青岛×10 FOB Qingdao ×10 (ref.)</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 230 }}>
          <canvas ref={chartRef} role="img" aria-label="Mono-PE 12-week price trend chart" />
        </div>
      </div>

      {/* 地区报价 + 市场快评 */}
      <div className="pe-grid-2">
        <div>
          <p className="pe-section-label">各地区报价参考 · Regional quotes</p>
          <div className="pe-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>地区 / 规格 · Region / Grade</th>
                  <th>价格 · Price</th>
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
            <p className="pe-table-note">
              国内价格含 13% 增值税 · Domestic quotes include 13% VAT
            </p>
          </div>
        </div>
        <div>
          <p className="pe-section-label">本周市场快评 · Market commentary</p>
          <NewsList items={d.news} />
        </div>
      </div>
    </>
  )
}

// ── 双季 Tab ──────────────────────────────────────────
function DiPanel() {
  const d = currentWeek.di
  const trendRef = useRef<HTMLCanvasElement>(null)
  const supplyRef = useRef<HTMLCanvasElement>(null)
  const trendChart = useRef<any>(null)
  const supplyChart = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    import('chart.js').then(({ Chart, registerables }) => {
      Chart.register(...registerables)

      // 走势图
      if (trendRef.current) {
        trendChart.current?.destroy()
        trendChart.current = new Chart(trendRef.current, {
          type: 'line',
          data: {
            labels: d.historyLabels,
            datasets: [
              { label: 'Avg / 均价', data: d.history18m, borderColor: C.amber, backgroundColor: C.amberBg, borderWidth: 2, pointRadius: 2, tension: 0.3, fill: true },
              { label: 'High-end / 高端', data: d.history18m.map(v => Math.round(v * 1.1)), borderColor: C.red, borderDash: [4, 3], borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
            ],
          },
          options: {
            ...baseLineOptions(v => '¥' + (Number(v) / 1000).toFixed(0) + 'k'),
            plugins: {
              legend: { display: false },
              tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: { label: (ctx: any) => ctx.dataset.label + ': ¥' + ctx.parsed.y.toLocaleString() + '/t' },
              },
            },
          },
        })
      }

      // 供需柱图
      if (supplyRef.current) {
        supplyChart.current?.destroy()
        supplyChart.current = new Chart(supplyRef.current, {
          type: 'bar',
          data: {
            labels: ['Effective supply · 有效供给', 'Market demand · 市场需求'],
            datasets: [{
              data: [d.supply * 10, d.demand * 10], // 万吨 → kt
              backgroundColor: ['rgba(29,158,117,0.75)', 'rgba(226,75,74,0.75)'],
              borderColor: [C.green, C.red],
              borderWidth: 1.5,
              borderRadius: 6,
              barThickness: 56,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx: any) => `~ ${ctx.parsed.x} kt  (${(ctx.parsed.x / 10).toFixed(1)} 万吨)`,
                },
              },
            },
            scales: {
              x: {
                ticks: { color: C.tickColor, callback: (v: any) => v + ' kt' },
                grid: { color: C.gridLine },
                max: 32,
                border: { display: false },
              },
              y: { ticks: { color: C.tickColor, font: { size: 12 } }, grid: { display: false } },
            },
          },
        })
      }
    })
    return () => { trendChart.current?.destroy(); supplyChart.current?.destroy() }
  }, [d])

  const gapKt = ((d.demand - d.supply) * 10).toFixed(0)
  const gapWan = (d.demand - d.supply).toFixed(1)

  return (
    <>
      <div className="pe-grid-4">
        <MetricCard
          labelCn="市场均价"
          labelEn="Market avg (¥/t)"
          value={'¥' + d.marketAvg.toLocaleString()}
          change={
            <span className="pe-change-down pe-metric-change">
              ▼ ¥{Math.abs(d.marketAvgChangeMoM).toLocaleString()} MoM / 较上月
            </span>
          }
        />
        <MetricCard
          labelCn="高端报价上限"
          labelEn="High-end ceiling (¥/t)"
          value={'¥' + d.highEnd.toLocaleString() + '+'}
          change={<span className="pe-change-up pe-metric-change">▲ PCB-driven / PCB需求驱动</span>}
        />
        <MetricCard
          labelCn="较2024年10月涨幅"
          labelEn="vs Oct 2024"
          value={'+' + d.vsOct2024Pct + '%'}
          change={
            <span className="pe-change-up pe-metric-change">
              ¥{(d.baseline2024Oct / 1000).toFixed(1)}k → ¥{(d.marketAvg / 1000).toFixed(0)}k /t
            </span>
          }
        />
        <MetricCard
          labelCn="FOB 出口"
          labelEn="FOB export (USD/t)"
          value={'$' + d.fob.toLocaleString()}
          change={<span className="pe-change-flat pe-metric-change">— tight supply / 供货偏紧</span>}
        />
      </div>

      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">
            双季戊四醇 18 个月价格走势 · Di-PE 18-Month Price Trend
          </p>
          <div className="pe-legend">
            <span><span className="pe-legend-dot" style={{ background: C.amber }} /> 均价 Avg</span>
            <span><span className="pe-legend-dot" style={{ background: C.red }} /> 高端 High-end</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 220 }}>
          <canvas ref={trendRef} role="img" aria-label="Di-PE 18-month price trend chart" />
        </div>
      </div>

      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">
            供需缺口 · Supply-Demand Gap (kt)
          </p>
          <span className="supply-gap-label">
            Gap ≈ {gapKt} kt ({gapWan} 万吨)
          </span>
        </div>
        <div style={{ position: 'relative', height: 150 }}>
          <canvas ref={supplyRef} role="img" aria-label="Di-PE supply-demand gap chart" />
        </div>
        <p className="pe-chart-note">
          1 万吨 = 10 kt = 10,000 t · 时间口径待核实 / Timeframe TBD
        </p>
      </div>

      <div>
        <p className="pe-section-label">市场动态 · Market updates</p>
        <NewsList items={d.news} />
      </div>
    </>
  )
}

// ── 国际行情 Tab ──────────────────────────────────────
function IntlPanel() {
  const d = currentWeek.intl
  const chartRef = useRef<HTMLCanvasElement>(null)
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
            { label: 'USA CIF',    data: d.history.us,  borderColor: C.blue,  borderWidth: 2, pointRadius: 2, tension: 0.3, fill: false },
            { label: 'Europe DE',  data: d.history.eu,  borderColor: C.green, borderWidth: 2, pointRadius: 2, tension: 0.3, fill: false },
            { label: 'China FOB',  data: d.history.cn,  borderColor: C.amber, borderDash: [4, 3], borderWidth: 2, pointRadius: 2, tension: 0.3, fill: false },
            { label: 'SEA CIF',    data: d.history.sea, borderColor: C.gray,  borderDash: [2, 4], borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
          ],
        },
        options: {
          ...baseLineOptions(v => '$' + v),
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index' as const,
              intersect: false,
              callbacks: { label: (ctx: any) => ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString() + '/t' },
            },
          },
        },
      })
    })
    return () => chartInst.current?.destroy()
  }, [d])

  return (
    <>
      <div className="pe-grid-4">
        <MetricCard
          labelCn="美国 CIF"
          labelEn="USA CIF (USD/t)"
          value={'$' + d.us.toLocaleString()}
          change={<PctBadge val={d.usChange} />}
        />
        <MetricCard
          labelCn="欧洲 (德国)"
          labelEn="Europe DE (USD/t)"
          value={'$' + d.europe.toLocaleString()}
          change={<PctBadge val={d.euChange} />}
        />
        <MetricCard
          labelCn="中国 FOB"
          labelEn="China FOB (USD/t)"
          value={'$' + d.chinafob.toLocaleString()}
          change={<PctBadge val={d.cnChange} />}
        />
        <MetricCard
          labelCn="东南亚 CIF"
          labelEn="SEA CIF (USD/t)"
          value={'$' + d.sea.toLocaleString()}
          change={<PctBadge val={d.seaChange} />}
        />
      </div>

      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">
            全球主要市场价格对比 · Global Market Comparison (USD/t)
          </p>
          <div className="pe-legend">
            <span><span className="pe-legend-dot" style={{ background: C.blue }} />美国 USA</span>
            <span><span className="pe-legend-dot" style={{ background: C.green }} />欧洲 Europe</span>
            <span><span className="pe-legend-dot" style={{ background: C.amber }} />中国FOB China FOB</span>
            <span><span className="pe-legend-dot" style={{ background: C.gray }} />东南亚 SEA</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 250 }}>
          <canvas ref={chartRef} role="img" aria-label="Global pentaerythritol price comparison chart" />
        </div>
      </div>

      <div>
        <p className="pe-section-label">全球市场快评 · Global market commentary</p>
        <NewsList items={d.news} />
      </div>
    </>
  )
}

// ── 主组件 ────────────────────────────────────────────
export default function PriceDashboard() {
  const [tab, setTab] = useState<'mono' | 'di' | 'intl'>('mono')
  const [showModal, setShowModal] = useState(false)
  const openModal  = useCallback(() => setShowModal(true),  [])
  const closeModal = useCallback(() => setShowModal(false), [])
  const d = currentWeek

  return (
    <>
    <main className="pe-main">
      {/* Hero */}
      <div className="pe-hero">
        <div>
          <h1>PentaPrice · 季戊四醇价格行情</h1>
          <p>
            单季 / 双季 · 国内出厂 + 国际 FOB / CIF · 每周更新
            <br />
            Mono &amp; Di-PE · China EXW + Global FOB / CIF · Updated weekly
          </p>
        </div>
        <div className="pe-hero-meta">
          <span className="pe-week-badge">本周 / This week · {d.weekLabel}</span>
          <span className="pe-updated">更新于 / Updated: {d.updatedAt}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="pe-tabs">
        {([
          ['mono', '单季戊四醇', 'Mono-PE'],
          ['di',   '双季戊四醇', 'Di-PE'],
          ['intl', '国际行情',   'Global'],
        ] as const).map(([id, cn, en]) => (
          <button
            key={id}
            className={`pe-tab-btn ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <span className="pe-tab-cn">{cn}</span>
            <span className="pe-tab-en">{en}</span>
          </button>
        ))}
      </div>

      {/* Panel */}
      {tab === 'mono' && <MonoPanel />}
      {tab === 'di'   && <DiPanel />}
      {tab === 'intl' && <IntlPanel />}

      {/* 单位 / 缩写说明 */}
      <div className="pe-glossary">
        <span><strong>¥/t</strong> = 元/吨 RMB per metric ton</span>
        <span><strong>USD/t</strong> = 美元/吨</span>
        <span><strong>kt</strong> = 1,000 吨 = 0.1 万吨</span>
        <span><strong>WoW</strong> = Week-over-Week / 较上周</span>
        <span><strong>MoM</strong> = Month-over-Month / 较上月</span>
        <span><strong>EXW</strong> = Ex-Works / 出厂价</span>
        <span><strong>FOB</strong> = Free on Board / 离岸价</span>
        <span><strong>CIF</strong> = Cost Insurance &amp; Freight / 到岸价</span>
      </div>

      {/* CTA */}
      <div className="pe-cta">
        <div>
          <h3>需要稳定高纯度季戊四醇供应？<br />Need reliable high-purity pentaerythritol supply?</h3>
          <p>
            98% / 95% 含量 · 大批量现货 · 出口单据齐全 · 技术支持
            <br />
            98% / 95% grade · Bulk stock · Full export docs · Technical support
          </p>
        </div>
        <button className="pe-cta-btn" onClick={openModal}>获取报价 / Get quote →</button>
      </div>
    </main>
    {showModal && <InquiryModal onClose={closeModal} />}
    </>
  )
}
