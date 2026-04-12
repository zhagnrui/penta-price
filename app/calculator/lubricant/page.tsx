import type { Metadata } from 'next'
import Link from 'next/link'
import LubricantCalc from '@/components/LubricantCalc'

const SITE_URL = 'https://www.pentaprice.com'
const PAGE_URL = `${SITE_URL}/calculator/lubricant`

export const metadata: Metadata = {
  title: '润滑油四酯收率计算器 · Lubricant Ester Yield Calculator | PentaPrice',
  description:
    '季戊四醇四酯收率计算器：输入PE用量、脂肪酸种类、摩尔比和纯度，自动计算理论产量、脂肪酸用量、脱水量及PE原料成本。' +
    'Pentaerythritol tetraester yield calculator for synthetic lubricant base oils — compute theoretical yield, acid requirement, and PE feedstock cost.',
  keywords: [
    '季戊四醇四酯计算器',
    'pentaerythritol tetraester yield calculator',
    '润滑油四酯收率',
    'synthetic lubricant ester calculator',
    'PE ester yield',
    '多元醇酯计算',
    'PentaPrice calculator',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: '润滑油四酯收率计算器 · Lubricant Ester Yield Calculator | PentaPrice',
    description: '季戊四醇四酯合成收率计算器 — 免费在线工具，计算理论产量、脂肪酸用量、PE原料成本。',
    url: PAGE_URL,
    siteName: 'PentaPrice',
    locale: 'zh_CN',
    type: 'website',
  },
}

export default function LubricantCalculatorPage() {
  return (
    <main className="pe-main">
      {/* ── 导航 ── */}
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
          ← 返回价格行情
        </Link>
        <span style={{ color: 'var(--pe-text-hint)', fontSize: '12px' }}>/</span>
        <span style={{ color: 'var(--pe-text-hint)', fontSize: '12px' }}>计算器</span>
        <span style={{ color: 'var(--pe-text-hint)', fontSize: '12px' }}>/</span>
        <span style={{ color: 'var(--pe-text-hint)', fontSize: '12px' }}>润滑油四酯</span>
      </div>

      {/* ── Hero ── */}
      <div className="pe-hero" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                background: 'var(--pe-green-light)',
                color: 'var(--pe-green-dark)',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '20px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: '1px solid var(--pe-green-mid)',
              }}
            >
              计算工具 · Calculator
            </span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 5px', lineHeight: 1.3 }}>
            润滑油四酯收率计算器
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--pe-text-muted)', margin: 0 }}>
            Pentaerythritol Tetraester Yield Calculator · 季戊四醇与脂肪酸酯化反应收率估算
          </p>
        </div>
        <div className="pe-hero-meta">
          <span
            style={{
              background: 'rgba(29,158,117,0.12)',
              color: 'var(--pe-green-dark)',
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: '20px',
              border: '1px solid var(--pe-green-mid)',
            }}
          >
            免费工具 · Free Tool
          </span>
        </div>
      </div>

      {/* ── 化学原理说明 ── */}
      <div
        className="pe-card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          background: 'var(--pe-surface)',
        }}
      >
        <p className="pe-section-label" style={{ marginBottom: '6px' }}>反应原理 · Chemistry</p>
        <p style={{ fontSize: '13px', color: 'var(--pe-text-muted)', margin: '0 0 6px', lineHeight: 1.6 }}>
          季戊四醇（MW = 136.15 g/mol）与4分子脂肪酸在催化剂作用下发生酯化反应，生成四酯（多元醇酯基础油）并脱出4分子水：
        </p>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: 'var(--pe-green-deep)',
            background: 'var(--pe-green-light)',
            border: '1px solid var(--pe-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            letterSpacing: '0.01em',
          }}
        >
          PE + 4 R-COOH → PE(OOCR)₄ + 4 H₂O
        </div>
        <p style={{ fontSize: '11.5px', color: 'var(--pe-text-hint)', margin: '6px 0 0', fontStyle: 'italic' }}>
          Pentaerythritol tetraester is the base oil for polyol ester (POE) synthetic lubricants used in aviation, refrigeration, and automotive applications.
        </p>
      </div>

      {/* ── Calculator ── */}
      <LubricantCalc />

      {/* ── 术语说明 ── */}
      <div className="pe-glossary" style={{ marginTop: '1.5rem' }}>
        <span><strong>MW</strong> 分子量 Molecular Weight (g/mol)</span>
        <span><strong>摩尔比</strong> 脂肪酸投料相对PE的摩尔过量比</span>
        <span><strong>理论收率</strong> 基于化学计量的最大产量</span>
        <span><strong>实际收率</strong> 理论量 × 0.95（经验系数）</span>
        <span><strong>EXW</strong> 出厂价，含增值税</span>
      </div>

      {/* ── CTA ── */}
      <div className="pe-cta" style={{ marginTop: '1.5rem' }}>
        <div>
          <h3>需要季戊四醇采购报价？</h3>
          <p>
            查看当周市场行情，或直接联系我们获取出厂价。<br />
            Check current market prices or contact us for EXW quotes.
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
          查看当周行情 →
        </Link>
      </div>
    </main>
  )
}
