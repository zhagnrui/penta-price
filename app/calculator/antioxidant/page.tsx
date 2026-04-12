import type { Metadata } from 'next'
import Link from 'next/link'
import AntioxidantCalc from '@/components/AntioxidantCalc'

const SITE_URL = 'https://www.pentaprice.com'
const PAGE_URL = `${SITE_URL}/calculator/antioxidant`

export const metadata: Metadata = {
  title: '抗氧剂1010投料计算器 · Antioxidant 1010 Batch Calculator | PentaPrice',
  description:
    '抗氧剂1010（Irganox 1010）投料量计算器：根据目标产量自动计算季戊四醇和MDHP中间体用量、副产甲醇及PE原料成本。免费在线工具。',
  keywords: [
    '抗氧剂1010投料',
    'antioxidant 1010 calculator',
    'Irganox 1010',
    '季戊四醇抗氧剂',
    'PE consumption calculator',
    'MDHP中间体',
    'PentaPrice calculator',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: '抗氧剂1010投料计算器 · Antioxidant 1010 Batch Calculator | PentaPrice',
    description:
      '抗氧剂1010（Irganox 1010）合成投料计算器 — 免费在线工具，根据目标产量计算PE和MDHP用量、副产甲醇及原料成本。',
    url: PAGE_URL,
    siteName: 'PentaPrice',
    locale: 'zh_CN',
    type: 'website',
  },
}

export default function AntioxidantCalculatorPage() {
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
        <span style={{ color: 'var(--pe-text-hint)', fontSize: '12px' }}>抗氧剂1010</span>
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
            抗氧剂1010投料计算器
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--pe-text-muted)', margin: 0 }}>
            Antioxidant 1010 Batch Calculator · 季戊四醇与MDHP中间体合成Irganox 1010投料估算
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
        <p style={{ fontSize: '13px', color: 'var(--pe-text-muted)', margin: '0 0 8px', lineHeight: 1.6 }}>
          抗氧剂1010（Irganox 1010）通过季戊四醇（PE）与4分子
          MDHP（3,5-二叔丁基-4-羟基苯基丙酸甲酯）发生酯交换反应制备，
          副产4分子甲醇：
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
            marginBottom: '10px',
          }}
        >
          PE + 4 MDHP → 抗氧剂1010 + 4 CH₃OH
        </div>

        {/* 分子量参考表 */}
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--pe-text-muted)', margin: '0 0 6px' }}>
          分子量参考 · MW Reference
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '6px',
            fontSize: '12px',
          }}
        >
          {[
            { name: 'PE（季戊四醇）', formula: 'C₅H₁₂O₄', mw: '136.15' },
            { name: 'MDHP（中间体）', formula: 'C₁₇H₂₆O₃', mw: '292.42' },
            { name: '抗氧剂1010', formula: 'C₇₃H₁₀₈O₁₂', mw: '1177.63' },
            { name: '甲醇（副产）', formula: 'CH₃OH', mw: '32.04' },
          ].map(item => (
            <div
              key={item.name}
              style={{
                background: 'var(--pe-card-bg)',
                border: '1px solid var(--pe-border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '7px 10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--pe-text)', fontSize: '11.5px' }}>{item.name}</div>
                <div style={{ color: 'var(--pe-text-hint)', fontSize: '10.5px' }}>{item.formula}</div>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--pe-green-dark)', whiteSpace: 'nowrap' }}>
                {item.mw} g/mol
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '11.5px', color: 'var(--pe-text-hint)', margin: '8px 0 0', fontStyle: 'italic' }}>
          Antioxidant 1010 (Irganox 1010) is a hindered phenolic antioxidant widely used in polyolefins, synthetic rubbers, and engineering plastics.
        </p>
      </div>

      {/* ── Calculator ── */}
      <AntioxidantCalc />

      {/* ── 术语说明 ── */}
      <div className="pe-glossary" style={{ marginTop: '1.5rem' }}>
        <span>
          <strong>MDHP</strong> 甲基-3-(3,5-二叔丁基-4-羟基苯基)丙酸酯，抗氧剂1010合成关键中间体
        </span>
        <span>
          <strong>摩尔过量</strong> 实际投入MDHP相对理论计量值的比例，1.05表示过量5%，确保PE完全转化
        </span>
        <span>
          <strong>综合收率</strong> 从原料投入到成品产出的总体质量收率，含反应损耗和后处理损失
        </span>
        <span>
          <strong>副产甲醇</strong> 酯交换反应产生，需减压蒸馏回收，通常作为溶剂循环利用
        </span>
        <span>
          <strong>MW</strong> 分子量 Molecular Weight (g/mol)
        </span>
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
