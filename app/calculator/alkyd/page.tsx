import type { Metadata } from 'next'
import Link from 'next/link'
import AlkydCalc from '@/components/AlkydCalc'

const SITE_URL = 'https://www.pentaprice.com'
const PAGE_URL = `${SITE_URL}/calculator/alkyd`

export const metadata: Metadata = {
  title: '醇酸树脂配方计算器 · Alkyd Resin Design Tool | PentaPrice',
  description:
    '醇酸树脂设计工具：输入目标产量、油长和原料类型，自动计算季戊四醇/甘油、苯酐、植物油用量及预估酸值。涂料行业免费在线计算工具。' +
    ' Alkyd resin formulation calculator — compute oil, phthalic anhydride, and polyol quantities plus estimated acid value for coatings applications.',
  keywords: [
    '醇酸树脂计算器',
    'alkyd resin calculator',
    '油长计算',
    '苯酐用量',
    '季戊四醇醇酸',
    'alkyd formulation',
    '醇酸树脂配方',
    'oil length calculator',
    'PentaPrice calculator',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: '醇酸树脂配方计算器 · Alkyd Resin Design Tool | PentaPrice',
    description: '醇酸树脂配方在线计算工具 — 输入油长、植物油类型和多元醇，快速估算各原料用量及预估酸值。',
    url: PAGE_URL,
    siteName: 'PentaPrice',
    locale: 'zh_CN',
    type: 'website',
  },
}

export default function AlkydCalculatorPage() {
  return (
    <main className="pe-main">
      {/* ── 导航面包屑 ── */}
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
        <span style={{ color: 'var(--pe-text-hint)', fontSize: '12px' }}>醇酸树脂</span>
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
            醇酸树脂配方计算器
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--pe-text-muted)', margin: 0 }}>
            Alkyd Resin Design Tool · 植物油 + 苯酐 + 多元醇 配方用量估算
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
        <p className="pe-section-label" style={{ marginBottom: '8px' }}>反应原理 · Chemistry</p>
        <p style={{ fontSize: '13px', color: 'var(--pe-text-muted)', margin: '0 0 10px', lineHeight: 1.65 }}>
          醇酸树脂由多元醇（季戊四醇或甘油）、二元酸酐（苯酐 PA）与植物油脂肪酸通过酯化/酯交换反应缩聚而成。
          植物油在聚合中提供长链脂肪酸，赋予树脂柔韧性和空气干燥能力；苯酐贡献芳香环骨架，提高硬度和光泽度。
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
            marginBottom: '8px',
          }}
        >
          多元醇 + 植物油 → 醇解中间体 + 苯酐 → 醇酸树脂 + H₂O ↑
        </div>
        <p style={{ fontSize: '11.5px', color: 'var(--pe-text-hint)', margin: 0, fontStyle: 'italic' }}>
          Alkyd resin is produced by polycondensation of a polyol, phthalic anhydride (PA), and a drying oil or fatty acid.
          Oil length determines application performance: short-oil alkyds cure fast under force-dry conditions; long-oil alkyds air-dry slowly with better flexibility.
        </p>
      </div>

      {/* ── Calculator ── */}
      <AlkydCalc />

      {/* ── 术语说明 · Glossary ── */}
      <div className="pe-glossary" style={{ marginTop: '1.5rem' }}>
        <span>
          <strong>油长 (Oil length)</strong> 植物油质量占树脂总质量的百分比，决定干燥方式和柔韧性
        </span>
        <span>
          <strong>酸值 (Acid value)</strong> 每克树脂中残余游离羧基所消耗KOH的毫克数（mgKOH/g），反映聚合完成度
        </span>
        <span>
          <strong>苯酐 (PA)</strong> 邻苯二甲酸酐，MW = 148.12 g/mol，醇酸树脂的核心二元酸单体
        </span>
        <span>
          <strong>醇解法</strong> 先将植物油与多元醇进行醇解，再与苯酐缩聚，为工业醇酸生产主流工艺
        </span>
        <span>
          <strong>碘值 (Iodine value)</strong> 反映油脂不饱和度，值越高干燥性越好（亚麻油 ≈ 185，椰子油 ≈ 10）
        </span>
      </div>

      {/* ── CTA ── */}
      <div className="pe-cta" style={{ marginTop: '1.5rem' }}>
        <div>
          <h3>需要季戊四醇采购报价？</h3>
          <p>
            查看当周市场行情，或直接联系我们获取出厂价。<br />
            Check current PE market prices or contact us for EXW quotes.
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
