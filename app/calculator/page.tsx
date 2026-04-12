import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = 'https://www.pentaprice.com'

export const metadata: Metadata = {
  title: '化工计算工具箱 · Chemical Calculators | PentaPrice',
  description:
    '季戊四醇相关化工计算工具：润滑油四酯收率计算器、抗氧剂1010投料计算器、醇酸树脂配方设计工具。免费在线使用，数据实时同步当周PE市场价格。',
  keywords: [
    '季戊四醇计算器', 'pentaerythritol calculator', '润滑油四酯计算',
    '抗氧剂1010投料', '醇酸树脂配方', 'PE chemical calculator',
  ],
  alternates: { canonical: `${SITE_URL}/calculator` },
  openGraph: {
    title: '化工计算工具箱 · Chemical Calculators | PentaPrice',
    description: '润滑油四酯收率 · 抗氧剂1010投料 · 醇酸树脂配方 — 三款免费在线计算工具',
    url: `${SITE_URL}/calculator`,
    siteName: 'PentaPrice',
    locale: 'zh_CN',
    type: 'website',
  },
}

const TOOLS = [
  {
    href: '/calculator/lubricant',
    icon: '🛢️',
    title: '润滑油四酯收率计算器',
    titleEn: 'Lubricant Ester Yield Calculator',
    desc: '季戊四醇与脂肪酸酯化反应：计算四酯理论产量、脂肪酸用量、脱水量及PE原料成本。支持C5/C8/C9/C10及混合酸。',
    descEn: 'Compute tetraester yield, fatty acid requirement, water removal, and PE feedstock cost for POE synthetic lubricant production.',
    tags: ['润滑油', '多元醇酯', 'POE', 'C8 C10'],
    badge: '已上线',
    badgeColor: '#1D9E75',
  },
  {
    href: '/calculator/antioxidant',
    icon: '🧪',
    title: '抗氧剂1010投料计算器',
    titleEn: 'Antioxidant 1010 Batch Calculator',
    desc: '根据目标产量反算季戊四醇和MDHP中间体投料量，计算副产甲醇及PE原料成本（Irganox 1010合成工艺）。',
    descEn: 'Back-calculate PE and MDHP input for target Antioxidant 1010 (Irganox 1010) output, with methanol byproduct and feedstock cost.',
    tags: ['抗氧剂', 'Irganox 1010', 'MDHP', '塑料稳定剂'],
    badge: '已上线',
    badgeColor: '#1D9E75',
  },
  {
    href: '/calculator/alkyd',
    icon: '🎨',
    title: '醇酸树脂配方设计工具',
    titleEn: 'Alkyd Resin Design Tool',
    desc: '输入目标油长和产量，自动计算季戊四醇/甘油、苯酐、植物油用量，显示配方构成比例和预估酸值。',
    descEn: 'Design alkyd resin formulations: compute PE/glycerol, phthalic anhydride, and oil quantities for your target oil length and batch size.',
    tags: ['醇酸树脂', '涂料', '油长', '苯酐'],
    badge: '已上线',
    badgeColor: '#1D9E75',
  },
]

export default function CalculatorIndexPage() {
  return (
    <main className="pe-main">
      {/* 导航 */}
      <div style={{ marginBottom: '1rem' }}>
        <Link
          href="/"
          style={{
            color: 'var(--pe-green)',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          ← 返回价格行情
        </Link>
      </div>

      {/* Hero */}
      <div className="pe-hero" style={{ marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              background: 'var(--pe-green-light)',
              color: 'var(--pe-green-dark)',
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: '1px solid var(--pe-green-mid)',
            }}>
              免费工具 · Free Tools
            </span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', color: 'var(--pe-text-main)' }}>
            化工计算工具箱
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--pe-text-muted)', margin: 0 }}>
            Chemical Calculators · 季戊四醇产业链专业计算工具，数据实时同步当周市场行情
          </p>
        </div>
      </div>

      {/* 工具卡片网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        {TOOLS.map(tool => (
          <Link
            key={tool.href}
            href={tool.href}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div className="pe-card" style={{
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, transform 0.15s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(29,158,117,0.18)'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = ''
                ;(e.currentTarget as HTMLDivElement).style.transform = ''
              }}
            >
              {/* 头部 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '32px', lineHeight: 1 }}>{tool.icon}</span>
                <span style={{
                  background: tool.badgeColor + '20',
                  color: tool.badgeColor,
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  border: `1px solid ${tool.badgeColor}40`,
                }}>
                  {tool.badge}
                </span>
              </div>

              {/* 标题 */}
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: 'var(--pe-text-main)' }}>
                {tool.title}
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--pe-text-hint)', margin: '0 0 12px', fontStyle: 'italic' }}>
                {tool.titleEn}
              </p>

              {/* 描述 */}
              <p style={{ fontSize: '13px', color: 'var(--pe-text-muted)', margin: '0 0 16px', lineHeight: 1.6, flex: 1 }}>
                {tool.desc}
              </p>

              {/* 标签 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {tool.tags.map(tag => (
                  <span key={tag} style={{
                    background: 'var(--pe-green-light)',
                    color: 'var(--pe-green-dark)',
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '10px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--pe-green)',
                fontSize: '13px',
                fontWeight: 600,
              }}>
                立即使用 →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 说明 */}
      <div className="pe-card" style={{ padding: '1rem 1.25rem', background: 'var(--pe-surface)' }}>
        <p style={{ fontSize: '12px', color: 'var(--pe-text-hint)', margin: 0, lineHeight: 1.7 }}>
          📌 所有计算工具免费使用，无需注册。计算结果自动引用当周季戊四醇市场价格，仅供工程参考。
          实际生产投料应结合原料检测报告和工艺优化结果。如需当周原料报价，欢迎
          <Link href="/" style={{ color: 'var(--pe-green)', marginLeft: '2px' }}>返回首页查看行情</Link>
          或直接联系我们。
        </p>
      </div>
    </main>
  )
}
