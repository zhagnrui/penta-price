import type { Metadata } from 'next'
import Link from 'next/link'
import { currentWeek } from '@/lib/priceData'

const SITE_URL = 'https://www.pentaprice.com'

type Props = {
  params: Promise<{ week: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week } = await params
  const { mono, di, intl, weekLabel } = currentWeek
  const canonicalUrl = `${SITE_URL}/weekly/${week}`

  return {
    title: `季戊四醇价格 ${weekLabel} · PentaPrice`,
    description:
      `${weekLabel} 季戊四醇价格归档：单季95%含量 ¥${mono.grade95.low.toLocaleString()}–${mono.grade95.high.toLocaleString()}/吨，` +
      `98%含量 ¥${mono.grade98.low.toLocaleString()}–${mono.grade98.high.toLocaleString()}/吨，` +
      `双季均价 ¥${di.marketAvg.toLocaleString()}/吨，FOB青岛 $${intl.chinafob}/吨。` +
      `Pentaerythritol price archive for ${weekLabel} — mono-PE & di-PE, China EXW + global FOB.`,
    keywords: [
      `pentaerythritol price ${weekLabel}`,
      '季戊四醇价格归档',
      `PE price ${weekLabel}`,
      '季戊四醇周报',
      'PentaPrice archive',
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `季戊四醇价格 ${weekLabel} · PentaPrice`,
      description: `单季95% ¥${mono.grade95.low.toLocaleString()}–${mono.grade95.high.toLocaleString()}/t | 双季均价 ¥${di.marketAvg.toLocaleString()}/t | FOB $${intl.chinafob}/t`,
      url: canonicalUrl,
      siteName: 'PentaPrice',
      locale: 'zh_CN',
      type: 'article',
    },
  }
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up')   return <span style={{ color: 'var(--pe-green)',  fontWeight: 700 }}>↑</span>
  if (trend === 'down') return <span style={{ color: 'var(--pe-red)',    fontWeight: 700 }}>↓</span>
  return <span style={{ color: 'var(--pe-text-hint)' }}>→</span>
}

function ChangeTag({ value, unit = '元/吨' }: { value: number; unit?: string }) {
  if (value === 0) return <span className="pe-change-flat">持平 flat</span>
  if (value > 0)  return <span className="pe-change-up">↑ +{value.toLocaleString()} {unit}</span>
  return <span className="pe-change-down">↓ {value.toLocaleString()} {unit}</span>
}

export default async function WeeklyArchivePage({ params }: Props) {
  const { week } = await params
  const { weekLabel, updatedAt, mono, di, intl } = currentWeek

  return (
    <main className="pe-main">
      {/* ── 返回 + 面包屑 ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        <Link
          href="/"
          style={{
            color: 'var(--pe-green)',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ← 返回最新行情
        </Link>
        <span style={{ color: 'var(--pe-text-hint)', fontSize: '12px' }}>/</span>
        <span style={{ color: 'var(--pe-text-hint)', fontSize: '12px' }}>{week}</span>
      </div>

      {/* ── Hero ── */}
      <div className="pe-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                background: 'var(--pe-green-mid)',
                color: 'var(--pe-green-deep)',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '20px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              数据归档 · Price Archive
            </span>
          </div>
          <h1>季戊四醇价格行情 · {weekLabel}</h1>
          <p>归档数据 · Archived price data — 仅供参考 for reference only</p>
        </div>
        <div className="pe-hero-meta">
          <span className="pe-week-badge">{weekLabel}</span>
          <span className="pe-updated">更新 · Updated: {updatedAt}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PANEL 1: 单季戊四醇 / Mono-Pentaerythritol
          ══════════════════════════════════════════ */}
      <section style={{ marginBottom: '2rem' }}>
        <p className="pe-section-label">单季戊四醇 · Mono-Pentaerythritol</p>

        {/* 指标卡 */}
        <div className="pe-grid-4" style={{ marginBottom: '1rem' }}>
          <div className="pe-metric-card">
            <div className="pe-metric-label">
              国内均价
              <span className="pe-metric-label-en">China Domestic Avg</span>
            </div>
            <div className="pe-metric-value">¥{mono.domesticAvg.toLocaleString()}</div>
            <div className="pe-metric-change">
              <ChangeTag value={mono.weekChange} />
            </div>
          </div>

          <div className="pe-metric-card">
            <div className="pe-metric-label">
              95% 含量价格区间
              <span className="pe-metric-label-en">Grade 95% EXW Range</span>
            </div>
            <div className="pe-metric-value" style={{ fontSize: '20px' }}>
              ¥{mono.grade95.low.toLocaleString()}–{mono.grade95.high.toLocaleString()}
            </div>
            <div className="pe-metric-change">
              <ChangeTag value={mono.grade95ChangeWoW} />
            </div>
          </div>

          <div className="pe-metric-card">
            <div className="pe-metric-label">
              98% 含量价格区间
              <span className="pe-metric-label-en">Grade 98% EXW Range</span>
            </div>
            <div className="pe-metric-value" style={{ fontSize: '20px' }}>
              ¥{mono.grade98.low.toLocaleString()}–{mono.grade98.high.toLocaleString()}
            </div>
            <div className="pe-metric-change">
              <ChangeTag value={mono.grade98ChangeWoW} />
            </div>
          </div>

          <div className="pe-metric-card">
            <div className="pe-metric-label">
              FOB 青岛
              <span className="pe-metric-label-en">FOB Qingdao (USD/t)</span>
            </div>
            <div className="pe-metric-value">${mono.fobQingdao.toLocaleString()}</div>
            <div className="pe-metric-change">
              <ChangeTag value={mono.fobChangeMoM} unit="USD/t MoM" />
            </div>
          </div>
        </div>

        {/* 地区报价表 */}
        <div className="pe-table-wrap">
          <table>
            <thead>
              <tr>
                <th>地区 · Region</th>
                <th>报价区间 · Price Range (¥/t)</th>
                <th>走势 · Trend</th>
              </tr>
            </thead>
            <tbody>
              {mono.regions.map((r) => (
                <tr key={r.name}>
                  <td>
                    <div className="pe-td-main">{r.name}</div>
                    <div className="pe-td-sub">{r.nameEn}</div>
                  </td>
                  <td>{r.price}</td>
                  <td><TrendIcon trend={r.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="pe-table-note">价格含税到厂，单位 元/吨（FOB 为 USD/吨）· Prices are EXW incl. VAT in CNY/t (FOB in USD/t)</p>
        </div>

        {/* 市场快评 */}
        {mono.news.length > 0 && (
          <div className="pe-news-card" style={{ marginTop: '1rem' }}>
            {mono.news.map((item, i) => (
              <div key={i} className="pe-news-item">
                <div className="pe-news-dot" />
                <div className="pe-news-body">
                  <p className="pe-news-text">{item.text}</p>
                  {item.textEn && <p className="pe-news-text-en">{item.textEn}</p>}
                  <div className="pe-news-meta">
                    <span className="pe-news-tag">{item.tag}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          PANEL 2: 双季戊四醇 / Di-Pentaerythritol
          ══════════════════════════════════════════ */}
      <section style={{ marginBottom: '2rem' }}>
        <p className="pe-section-label">双季戊四醇 · Di-Pentaerythritol</p>

        <div className="pe-grid-4" style={{ marginBottom: '1rem' }}>
          <div className="pe-metric-card">
            <div className="pe-metric-label">
              市场均价
              <span className="pe-metric-label-en">Market Average</span>
            </div>
            <div className="pe-metric-value">¥{di.marketAvg.toLocaleString()}</div>
            <div className="pe-metric-change">
              <ChangeTag value={di.marketAvgChangeMoM} unit="元/吨 MoM" />
            </div>
          </div>

          <div className="pe-metric-card">
            <div className="pe-metric-label">
              高端报价
              <span className="pe-metric-label-en">Premium Quote</span>
            </div>
            <div className="pe-metric-value">¥{di.highEnd.toLocaleString()}</div>
          </div>

          <div className="pe-metric-card">
            <div className="pe-metric-label">
              FOB 出口
              <span className="pe-metric-label-en">FOB Export (USD/t)</span>
            </div>
            <div className="pe-metric-value">${di.fob.toLocaleString()}</div>
          </div>

          <div className="pe-metric-card">
            <div className="pe-metric-label">
              较2024年10月涨幅
              <span className="pe-metric-label-en">vs Oct 2024 Baseline</span>
            </div>
            <div className="pe-metric-value" style={{ color: 'var(--pe-green)' }}>
              +{di.vsOct2024Pct}%
            </div>
          </div>
        </div>

        {/* 供需数据 */}
        <div className="pe-grid-2">
          <div className="pe-metric-card">
            <div className="pe-metric-label">
              供应量 Supply
              <span className="pe-metric-label-en">万吨 / 10 kt</span>
            </div>
            <div className="pe-metric-value">{di.supply} 万吨</div>
          </div>
          <div className="pe-metric-card">
            <div className="pe-metric-label">
              需求量 Demand
              <span className="pe-metric-label-en">万吨 / 10 kt</span>
            </div>
            <div className="pe-metric-value" style={{ color: 'var(--pe-red)' }}>{di.demand} 万吨</div>
          </div>
        </div>

        {/* 市场快评 */}
        {di.news.length > 0 && (
          <div className="pe-news-card" style={{ marginTop: '1rem' }}>
            {di.news.map((item, i) => (
              <div key={i} className="pe-news-item">
                <div className="pe-news-dot" />
                <div className="pe-news-body">
                  <p className="pe-news-text">{item.text}</p>
                  {item.textEn && <p className="pe-news-text-en">{item.textEn}</p>}
                  <div className="pe-news-meta">
                    <span className="pe-news-tag">{item.tag}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          PANEL 3: 国际行情 / International Market
          ══════════════════════════════════════════ */}
      <section style={{ marginBottom: '2rem' }}>
        <p className="pe-section-label">国际行情 · Global Market (USD/t)</p>

        <div className="pe-grid-4" style={{ marginBottom: '1rem' }}>
          <div className="pe-metric-card">
            <div className="pe-metric-label">
              美国 CIF
              <span className="pe-metric-label-en">USA CIF</span>
            </div>
            <div className="pe-metric-value">${intl.us.toLocaleString()}</div>
            <div className="pe-metric-change">
              {intl.usChange > 0
                ? <span className="pe-change-up">↑ +{intl.usChange}% MoM</span>
                : <span className="pe-change-down">↓ {intl.usChange}% MoM</span>
              }
            </div>
          </div>

          <div className="pe-metric-card">
            <div className="pe-metric-label">
              欧洲 CIF
              <span className="pe-metric-label-en">Europe CIF (DE)</span>
            </div>
            <div className="pe-metric-value">${intl.europe.toLocaleString()}</div>
            <div className="pe-metric-change">
              {intl.euChange > 0
                ? <span className="pe-change-up">↑ +{intl.euChange}% MoM</span>
                : <span className="pe-change-down">↓ {intl.euChange}% MoM</span>
              }
            </div>
          </div>

          <div className="pe-metric-card">
            <div className="pe-metric-label">
              中国 FOB
              <span className="pe-metric-label-en">China FOB Qingdao</span>
            </div>
            <div className="pe-metric-value">${intl.chinafob.toLocaleString()}</div>
            <div className="pe-metric-change">
              {intl.cnChange >= 0
                ? <span className="pe-change-up">↑ +{intl.cnChange}% MoM</span>
                : <span className="pe-change-down">↓ {intl.cnChange}% MoM</span>
              }
            </div>
          </div>

          <div className="pe-metric-card">
            <div className="pe-metric-label">
              东南亚 CIF
              <span className="pe-metric-label-en">SE Asia CIF</span>
            </div>
            <div className="pe-metric-value">${intl.sea.toLocaleString()}</div>
            <div className="pe-metric-change">
              {intl.seaChange >= 0
                ? <span className="pe-change-up">↑ +{intl.seaChange}% MoM</span>
                : <span className="pe-change-down">↓ {intl.seaChange}% MoM</span>
              }
            </div>
          </div>
        </div>

        {/* 国际市场价格对比表 */}
        <div className="pe-table-wrap">
          <table>
            <thead>
              <tr>
                <th>市场 · Market</th>
                <th>价格 USD/t</th>
                <th>月变化 · MoM</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="pe-td-main">美国 USA</div><div className="pe-td-sub">CIF</div></td>
                <td>${intl.us.toLocaleString()}</td>
                <td className={intl.usChange > 0 ? 'td-up' : 'td-down'}>
                  {intl.usChange > 0 ? '+' : ''}{intl.usChange}%
                </td>
              </tr>
              <tr>
                <td><div className="pe-td-main">欧洲 Europe</div><div className="pe-td-sub">CIF Germany</div></td>
                <td>${intl.europe.toLocaleString()}</td>
                <td className={intl.euChange > 0 ? 'td-up' : 'td-down'}>
                  {intl.euChange > 0 ? '+' : ''}{intl.euChange}%
                </td>
              </tr>
              <tr>
                <td><div className="pe-td-main">中国 China</div><div className="pe-td-sub">FOB Qingdao</div></td>
                <td>${intl.chinafob.toLocaleString()}</td>
                <td className={intl.cnChange >= 0 ? 'td-up' : 'td-down'}>
                  {intl.cnChange >= 0 ? '+' : ''}{intl.cnChange}%
                </td>
              </tr>
              <tr>
                <td><div className="pe-td-main">东南亚 SE Asia</div><div className="pe-td-sub">CIF</div></td>
                <td>${intl.sea.toLocaleString()}</td>
                <td className={intl.seaChange >= 0 ? 'td-up' : 'td-down'}>
                  {intl.seaChange >= 0 ? '+' : ''}{intl.seaChange}%
                </td>
              </tr>
            </tbody>
          </table>
          <p className="pe-table-note">价格单位：美元/吨（USD/t）· 月环比变化 Month-over-Month</p>
        </div>

        {/* 市场快评 */}
        {intl.news.length > 0 && (
          <div className="pe-news-card" style={{ marginTop: '1rem' }}>
            {intl.news.map((item, i) => (
              <div key={i} className="pe-news-item">
                <div className="pe-news-dot" />
                <div className="pe-news-body">
                  <p className="pe-news-text">{item.text}</p>
                  {item.textEn && <p className="pe-news-text-en">{item.textEn}</p>}
                  <div className="pe-news-meta">
                    <span className="pe-news-tag">{item.tag}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 术语说明 ── */}
      <div className="pe-glossary">
        <span><strong>EXW</strong> 出厂价，含增值税</span>
        <span><strong>FOB</strong> 离岸价（Free on Board）</span>
        <span><strong>CIF</strong> 到岸价（Cost, Insurance &amp; Freight）</span>
        <span><strong>WoW</strong> 周环比（Week-on-Week）</span>
        <span><strong>MoM</strong> 月环比（Month-on-Month）</span>
      </div>

      {/* ── CTA ── */}
      <div className="pe-cta" style={{ marginTop: '2rem' }}>
        <div>
          <h3>获取最新报价 · Get Current Pricing</h3>
          <p>
            查看最新行情或联系我们获取精准报价。
            <br />View live prices or contact us for a tailored quote.
          </p>
        </div>
        <Link
          href="/"
          style={{
            background: 'var(--pe-green)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            padding: '10px 22px',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(15,110,86,0.25)',
            display: 'inline-block',
          }}
        >
          查看最新行情 →
        </Link>
      </div>
    </main>
  )
}
