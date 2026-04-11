'use client'

import { useState, useEffect, useRef } from 'react'
import { currentWeek } from '@/lib/priceData'

// ── 工具函数 ──────────────────────────────────────────
function TrendIcon({ val }: { val: number }) {
  if (val > 0) return <span className="pe-change-up">▲ {val.toLocaleString()} 较上周</span>
  if (val < 0) return <span className="pe-change-down">▼ {Math.abs(val).toLocaleString()} 较上周</span>
  return <span className="pe-change-flat">— 与上周持平</span>
}

function PctBadge({ val, suffix = '% MoM' }: { val: number; suffix?: string }) {
  const cls = val > 0 ? 'pe-change-up' : val < 0 ? 'pe-change-down' : 'pe-change-flat'
  const arrow = val > 0 ? '▲' : val < 0 ? '▼' : '—'
  return <span className={`pe-metric-change ${cls}`}>{arrow} {Math.abs(val)}{suffix}</span>
}

// ── Chart 颜色常量（Canvas 不识别 CSS 变量） ──────────
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
            { label: '国内均价', data: d.history12w, borderColor: C.green, backgroundColor: C.greenBg, borderWidth: 2, pointRadius: 3, pointBackgroundColor: C.green, tension: 0.4, fill: true },
            { label: 'FOB×10', data: fob, borderColor: C.blue, borderDash: [5, 3], borderWidth: 1.5, pointRadius: 0, tension: 0.4, fill: false },
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
  }, [])

  return (
    <>
      {/* 指标卡 */}
      <div className="pe-grid-4">
        {[
          { label: '国内均价 (元/吨)', value: d.domesticAvg.toLocaleString(), change: <TrendIcon val={d.weekChange} /> },
          { label: '95% 含量出厂含税', value: `${d.grade95.low.toLocaleString()}–${d.grade95.high.toLocaleString()}`, change: <span className="pe-change-down pe-metric-change">▼ 200 较上周</span> },
          { label: '98% 含量出厂含税', value: `${d.grade98.low.toLocaleString()}–${d.grade98.high.toLocaleString()}`, change: <span className="pe-change-up pe-metric-change">▲ 100 较上周</span> },
          { label: 'FOB 青岛 (USD/吨)', value: d.fobQingdao.toLocaleString(), change: <span className="pe-change-down pe-metric-change">▼ 40 本月</span> },
        ].map(c => (
          <div key={c.label} className="pe-metric-card">
            <p className="pe-metric-label">{c.label}</p>
            <p className="pe-metric-value">{c.value}</p>
            <div>{c.change}</div>
          </div>
        ))}
      </div>

      {/* 走势图 */}
      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">单季戊四醇近12周价格走势</p>
          <div className="pe-legend">
            <span><span className="pe-legend-dot" style={{ background: C.green }} /> 国内均价（元/吨）</span>
            <span><span className="pe-legend-dot" style={{ background: C.blue }} /> FOB青岛 ×10（参考）</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 230 }}>
          <canvas ref={chartRef} role="img" aria-label="单季戊四醇近12周价格走势折线图" />
        </div>
      </div>

      {/* 地区报价 + 市场快评 */}
      <div className="pe-grid-2">
        <div>
          <p className="pe-section-label">各地区报价参考</p>
          <div className="pe-table-wrap">
            <table>
              <thead><tr><th>地区 / 规格</th><th>价格（元/吨）</th></tr></thead>
              <tbody>
                {d.regions.map(r => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td className={r.trend === 'up' ? 'td-up' : r.trend === 'down' ? 'td-down' : ''}>{r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <p className="pe-section-label">本周市场快评</p>
          <div className="pe-news-card">
            {d.news.map((n, i) => (
              <div key={i} className="pe-news-item">
                <div className="pe-news-dot" />
                <div className="pe-news-body">
                  <p className="pe-news-text">{n.text}</p>
                  <div className="pe-news-meta">
                    <span className="pe-news-tag">{n.tag}</span>
                    <span>{n.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              { label: '均价', data: d.history18m, borderColor: C.amber, backgroundColor: C.amberBg, borderWidth: 2, pointRadius: 2, tension: 0.3, fill: true },
              { label: '高端', data: d.history18m.map(v => Math.round(v * 1.1)), borderColor: C.red, borderDash: [4, 3], borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
            ],
          },
          options: baseLineOptions(v => '¥' + (Number(v) / 10000).toFixed(1) + '万'),
        })
      }

      // 供需柱图
      if (supplyRef.current) {
        supplyChart.current?.destroy()
        supplyChart.current = new Chart(supplyRef.current, {
          type: 'bar',
          data: {
            labels: ['有效供给', '市场需求'],
            datasets: [{
              data: [d.supply, d.demand],
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
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => '约 ' + ctx.parsed.x + ' 万吨' } } },
            scales: {
              x: { ticks: { color: C.tickColor, callback: (v: any) => v + '万吨' }, grid: { color: C.gridLine }, max: 3.2, border: { display: false } },
              y: { ticks: { color: C.tickColor, font: { size: 13 } }, grid: { display: false } },
            },
          },
        })
      }
    })
    return () => { trendChart.current?.destroy(); supplyChart.current?.destroy() }
  }, [])

  return (
    <>
      <div className="pe-grid-4">
        {[
          { label: '市场均价（元/吨）', value: (d.marketAvg / 10000).toFixed(1) + '万', change: <span className="pe-change-down pe-metric-change">▼ 0.3万 较上月</span> },
          { label: '高端报价上限', value: (d.highEnd / 10000).toFixed(0) + '万+', change: <span className="pe-change-up pe-metric-change">▲ PCB需求驱动</span> },
          { label: '较2024年10月涨幅', value: '+' + d.vsOct2024Pct + '%', change: <span className="pe-change-up pe-metric-change">2.5万→6.2万</span> },
          { label: 'FOB 出口（USD/吨）', value: d.fob.toLocaleString(), change: <span className="pe-change-flat pe-metric-change">— 供货偏紧</span> },
        ].map(c => (
          <div key={c.label} className="pe-metric-card">
            <p className="pe-metric-label">{c.label}</p>
            <p className="pe-metric-value">{c.value}</p>
            <div>{c.change}</div>
          </div>
        ))}
      </div>

      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">双季戊四醇价格飙升走势（近18个月）</p>
          <div className="pe-legend">
            <span><span className="pe-legend-dot" style={{ background: C.amber }} /> 均价</span>
            <span><span className="pe-legend-dot" style={{ background: C.red }} /> 高端上限</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 220 }}>
          <canvas ref={trendRef} role="img" aria-label="双季戊四醇近18个月价格走势" />
        </div>
      </div>

      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">供需缺口分析（万吨）</p>
          <span className="supply-gap-label">缺口约 {(d.demand - d.supply).toFixed(1)} 万吨</span>
        </div>
        <div style={{ position: 'relative', height: 150 }}>
          <canvas ref={supplyRef} role="img" aria-label="双季戊四醇供需缺口柱图" />
        </div>
      </div>

      <div>
        <p className="pe-section-label">市场动态</p>
        <div className="pe-news-card">
          {d.news.map((n, i) => (
            <div key={i} className="pe-news-item">
              <div className="pe-news-dot" />
              <div className="pe-news-body">
                <p className="pe-news-text">{n.text}</p>
                <div className="pe-news-meta">
                  <span className="pe-news-tag">{n.tag}</span>
                  <span>{n.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
            { label: 'Europe',     data: d.history.eu,  borderColor: C.green, borderWidth: 2, pointRadius: 2, tension: 0.3, fill: false },
            { label: 'China FOB',  data: d.history.cn,  borderColor: C.amber, borderDash: [4, 3], borderWidth: 2, pointRadius: 2, tension: 0.3, fill: false },
            { label: 'SEA CIF',    data: d.history.sea, borderColor: C.gray,  borderDash: [2, 4], borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
          ],
        },
        options: baseLineOptions(v => '$' + v),
      })
    })
    return () => chartInst.current?.destroy()
  }, [])

  return (
    <>
      <div className="pe-grid-4">
        {[
          { label: '美国 CIF (USD/吨)', value: '$' + d.us.toLocaleString(), pct: d.usChange },
          { label: '欧洲 德国 (USD/吨)', value: '$' + d.europe.toLocaleString(), pct: d.euChange },
          { label: '中国 FOB (USD/吨)', value: '$' + d.chinafob.toLocaleString(), pct: d.cnChange },
          { label: '东南亚 CIF (USD/吨)', value: '$' + d.sea.toLocaleString(), pct: d.seaChange },
        ].map(c => (
          <div key={c.label} className="pe-metric-card">
            <p className="pe-metric-label">{c.label}</p>
            <p className="pe-metric-value">{c.value}</p>
            <PctBadge val={c.pct} />
          </div>
        ))}
      </div>

      <div className="pe-chart-wrap">
        <div className="pe-chart-header">
          <p className="pe-chart-title">全球主要市场价格对比 (USD/吨)</p>
          <div className="pe-legend">
            <span><span className="pe-legend-dot" style={{ background: C.blue }} />美国</span>
            <span><span className="pe-legend-dot" style={{ background: C.green }} />欧洲</span>
            <span><span className="pe-legend-dot" style={{ background: C.amber }} />中国FOB</span>
            <span><span className="pe-legend-dot" style={{ background: C.gray }} />东南亚</span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 250 }}>
          <canvas ref={chartRef} role="img" aria-label="全球四地区季戊四醇价格走势对比" />
        </div>
      </div>

      <div>
        <p className="pe-section-label">全球市场快评 · Market Commentary</p>
        <div className="pe-news-card">
          {d.news.map((n, i) => (
            <div key={i} className="pe-news-item">
              <div className="pe-news-dot" />
              <div className="pe-news-body">
                <p className="pe-news-text">{n.text}</p>
                <div className="pe-news-meta">
                  <span className="pe-news-tag">{n.tag}</span>
                  <span>{n.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ── 主组件 ────────────────────────────────────────────
export default function PriceDashboard() {
  const [tab, setTab] = useState<'mono' | 'di' | 'intl'>('mono')
  const d = currentWeek

  return (
    <main className="pe-main">
      {/* Hero */}
      <div className="pe-hero">
        <div>
          <h1>季戊四醇价格行情 · Pentaerythritol Price Tracker</h1>
          <p>单季 / 双季 · 国内出厂 + 国际 FOB / CIF · 每周更新 | Updated weekly</p>
        </div>
        <span className="pe-week-badge">本周更新 · {d.weekLabel}</span>
      </div>

      {/* Tabs */}
      <div className="pe-tabs">
        {([['mono', '单季戊四醇'], ['di', '双季戊四醇'], ['intl', '国际行情']] as const).map(([id, label]) => (
          <button key={id} className={`pe-tab-btn ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {/* Panel */}
      {tab === 'mono' && <MonoPanel />}
      {tab === 'di'   && <DiPanel />}
      {tab === 'intl' && <IntlPanel />}

      {/* CTA */}
      <div className="pe-cta">
        <div>
          <h3>需要稳定高纯度季戊四醇供应？</h3>
          <p>98% / 95% 含量 · 大批量现货 · 出口单据齐全 · 技术支持</p>
        </div>
        <button className="pe-cta-btn">获取报价 →</button>
      </div>
    </main>
  )
}
