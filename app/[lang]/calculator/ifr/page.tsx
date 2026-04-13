import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import IFRCalc from '@/components/IFRCalc'

const SITE_URL = 'https://www.pentaprice.com'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  const dict = await getDictionary(lang)
  const tool = dict.calcIndex.tools.ifr
  return {
    title: `${tool.title} | PentaPrice`,
    description: tool.desc,
    keywords: [
      'intumescent fire retardant', '膨胀型防火涂料', 'APP:PER:MEL ratio',
      'ammonium polyphosphate', '聚磷酸铵', 'pentaerythritol carbon source',
      'IFR coating formulation', 'GB 14907', '钢结构防火涂料',
    ],
    alternates: {
      canonical: `${SITE_URL}/${lang}/calculator/ifr`,
      languages: {
        zh: `${SITE_URL}/zh/calculator/ifr`,
        en: `${SITE_URL}/en/calculator/ifr`,
        de: `${SITE_URL}/de/calculator/ifr`,
      },
    },
  }
}

export default async function IFRPage({ params }: Props) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const tool = dict.calcIndex.tools.ifr

  return (
    <main className="pe-main">
      <div style={{ marginBottom: '1rem' }}>
        <Link href={`/${lang}/calculator`} style={{ color: 'var(--pe-green)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          {dict.calc.backToCalc}
        </Link>
      </div>

      <div className="pe-hero" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>🔥</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', color: 'var(--pe-text-main)' }}>
            {tool.title}
          </h1>
          <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--pe-text-hint)', margin: '2px 0 8px' }}>
            {tool.titleEn}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--pe-text-muted)', margin: 0, maxWidth: '680px' }}>
            {tool.desc}
          </p>
        </div>
      </div>

      {/* 核心原理说明 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '1.5rem',
      }}>
        {[
          { color: '#1D9E75', icon: '🟠', title: 'APP — 酸源', titleEn: 'Acid source', desc: '聚磷酸铵受热分解，释放磷酸，催化 PER 脱水成炭', tag: 'Ammonium Polyphosphate' },
          { color: '#BA7517', icon: '🟡', title: 'PER — 碳源', titleEn: 'Carbon source', desc: '季戊四醇脱水碳化，形成致密炭层骨架，阻止热量传导', tag: 'Pentaerythritol' },
          { color: '#378ADD', icon: '🔵', title: 'MEL — 气源', titleEn: 'Blowing agent', desc: '三聚氰胺分解释放氮气，驱动炭层膨胀，降低导热系数', tag: 'Melamine' },
        ].map(item => (
          <div key={item.tag} style={{
            background: '#fff',
            border: `1px solid ${item.color}30`,
            borderTop: `3px solid ${item.color}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
          }}>
            <div style={{ fontSize: '16px', marginBottom: '4px' }}>{item.icon} <strong style={{ color: item.color, fontSize: '13px' }}>{item.title}</strong></div>
            <div style={{ fontSize: '10px', color: 'var(--pe-text-hint)', fontStyle: 'italic', marginBottom: '6px' }}>{item.titleEn} · {item.tag}</div>
            <div style={{ fontSize: '11px', color: 'var(--pe-text-muted)', lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <IFRCalc lang={lang} dict={dict} />
    </main>
  )
}
