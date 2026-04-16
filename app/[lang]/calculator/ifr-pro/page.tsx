import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import IFRBatchCalcV2 from '@/components/IFRBatchCalcV2'

const SITE_URL = 'https://www.pentaprice.com'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  const dict = await getDictionary(lang)
  const tool = dict.calcIndex.tools.ifrPro
  return {
    title: `${tool.title} | PentaPrice`,
    description: tool.desc,
    keywords: [
      'IFR Pro', 'advanced intumescent', 'performance prediction',
      '膨胀型防火涂料专业版', '性能预测', '学术计算',
      'stoichiometric analysis', 'LOI PHRR prediction',
    ],
    alternates: {
      canonical: `${SITE_URL}/${lang}/calculator/ifr-pro`,
      languages: {
        zh: `${SITE_URL}/zh/calculator/ifr-pro`,
        en: `${SITE_URL}/en/calculator/ifr-pro`,
        de: `${SITE_URL}/de/calculator/ifr-pro`,
      },
    },
  }
}

export default async function IFRProPage({ params }: Props) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const tool = dict.calcIndex.tools.ifrPro

  return (
    <main className="pe-main">
      <div style={{ marginBottom: '1rem' }}>
        <Link href={`/${lang}/calculator`} style={{ color: 'var(--pe-green)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          ← {dict.calc.backToCalc}
        </Link>
      </div>

      <div className="pe-hero" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #0F6E56, #1D9E75)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', color: '#fff' }}>
        <div>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔬</div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', color: '#fff' }}>
            {tool.title}
          </h1>
          <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', margin: '4px 0 10px' }}>
            {tool.titleEn}
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0, maxWidth: '680px', lineHeight: 1.6 }}>
            {tool.desc}
          </p>
        </div>
      </div>

      {/* 功能特性 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '12px',
        marginBottom: '2rem',
      }}>
        {[
          { icon: '🧪', title: '性能预测', subtitle: 'Performance Prediction', desc: 'LOI、PHRR、THRF三维模型' },
          { icon: '⚙️', title: '工艺风险评估', subtitle: 'Process Risk Assessment', desc: '混合、固化、涂装5大模块' },
          { icon: '📚', title: '学术支持', subtitle: 'Academic References', desc: '16+论文引用，全部DOI' },
          { icon: '🎯', title: '炭层评分', subtitle: 'Char Quality Scoring', desc: 'A–D等级，给出改进方向' },
        ].map(item => (
          <div key={item.title} style={{
            background: '#fff',
            border: '1px solid var(--pe-border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--pe-text)', marginBottom: '2px' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--pe-text-hint)', fontStyle: 'italic', marginBottom: '6px' }}>
              {item.subtitle}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--pe-text-muted)', lineHeight: 1.5 }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>

      {/* 使用指南 */}
      <div style={{
        padding: '16px 18px',
        background: '#F0FDF4',
        border: '2px solid var(--pe-green)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '2rem',
        fontSize: '13px',
        color: 'var(--pe-green-dark)',
        lineHeight: 1.7,
      }}>
        <strong>✅ Pro版本使用场景：</strong><br />
        · 需要详细性能预测的复杂配方优化<br />
        · 工程文档和专利申请需要学术支持<br />
        · 多批次COA对比分析<br />
        · 耐火等级达成的可靠性验证
      </div>

      {/* Pro 计算器 */}
      <IFRBatchCalcV2 />

      {/* 对标说明 */}
      <div style={{
        marginTop: '2rem',
        padding: '16px 18px',
        background: 'var(--pe-surface)',
        border: '1px solid var(--pe-border-light)',
        borderRadius: 'var(--radius-md)',
        fontSize: '12px',
        color: 'var(--pe-text-muted)',
        lineHeight: 1.7,
      }}>
        <strong style={{ color: 'var(--pe-text)' }}>ℹ️ 版本对比：</strong><br />
        <table style={{ width: '100%', marginTop: '8px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--pe-border-light)' }}>
              <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 600 }}>功能</th>
              <th style={{ textAlign: 'center', padding: '6px 0', fontWeight: 600 }}>基础版</th>
              <th style={{ textAlign: 'center', padding: '6px 0', fontWeight: 600 }}>标准版</th>
              <th style={{ textAlign: 'center', padding: '6px 0', fontWeight: 600, color: 'var(--pe-green)' }}>Pro版</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '11px' }}>
            <tr style={{ borderBottom: '1px solid var(--pe-border-light)' }}>
              <td style={{ padding: '6px 0' }}>固定比例查询</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>✓</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>–</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>–</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--pe-border-light)' }}>
              <td style={{ padding: '6px 0' }}>COA化学计量</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>–</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>✓</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>✓</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--pe-border-light)' }}>
              <td style={{ padding: '6px 0' }}>性能预测（LOI/PHRR/THRF）</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>–</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>–</td>
              <td style={{ textAlign: 'center', padding: '6px 0', color: 'var(--pe-green)', fontWeight: 600 }}>✓</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--pe-border-light)' }}>
              <td style={{ padding: '6px 0' }}>工艺风险评估</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>–</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>–</td>
              <td style={{ textAlign: 'center', padding: '6px 0', color: 'var(--pe-green)', fontWeight: 600 }}>✓</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--pe-border-light)' }}>
              <td style={{ padding: '6px 0' }}>学术论文引用</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>–</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>–</td>
              <td style={{ textAlign: 'center', padding: '6px 0', color: 'var(--pe-green)', fontWeight: 600 }}>✓</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0' }}>炭层质量评分</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>–</td>
              <td style={{ textAlign: 'center', padding: '6px 0' }}>✓</td>
              <td style={{ textAlign: 'center', padding: '6px 0', color: 'var(--pe-green)', fontWeight: 600 }}>✓ 升级版</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}
