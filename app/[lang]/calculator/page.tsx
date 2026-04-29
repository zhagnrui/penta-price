import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'

const SITE_URL = 'https://www.pentaprice.com'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return {
    title: dict.meta.calcTitle,
    description: dict.meta.calcDesc,
    alternates: {
      canonical: `${SITE_URL}/${lang}/calculator`,
      languages: {
        zh: `${SITE_URL}/zh/calculator`,
        en: `${SITE_URL}/en/calculator`,
        de: `${SITE_URL}/de/calculator`,
      },
    },
  }
}

const TOOL_KEYS = ['lubricant', 'antioxidant', 'alkyd', 'ifr', 'ifrPro', 'ifrCost'] as const

// URL slugs (camelCase keys → kebab-case paths where needed)
const TOOL_HREFS: Record<string, string> = {
  lubricant:   'lubricant',
  antioxidant: 'antioxidant',
  alkyd:       'alkyd',
  ifr:         'ifr',
  ifrPro:      'ifr-pro',
  ifrCost:     'ifr-cost',
}

const TOOL_ICONS: Record<string, string> = {
  lubricant:   '🛢️',
  antioxidant: '🧪',
  alkyd:       '🎨',
  ifr:         '🔥',
  ifrPro:      '🔬',
  ifrCost:     '📊',
}

// Card style variants
type CardVariant = 'default' | 'pro' | 'cost'
const TOOL_VARIANT: Record<string, CardVariant> = {
  lubricant:   'default',
  antioxidant: 'default',
  alkyd:       'default',
  ifr:         'default',
  ifrPro:      'pro',
  ifrCost:     'cost',
}

export default async function CalculatorIndexPage({ params }: Props) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const ci = dict.calcIndex

  return (
    <main className="pe-main">
      {/* 导航 */}
      <div style={{ marginBottom: '1rem' }}>
        <Link
          href={`/${lang}`}
          style={{ color: 'var(--pe-green)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
        >
          {ci.backToHome}
        </Link>
      </div>

      {/* Hero */}
      <div className="pe-hero" style={{ marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              background: 'var(--pe-green-light)', color: 'var(--pe-green-dark)',
              fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
              letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid var(--pe-green-mid)',
            }}>
              {ci.freeBadge}
            </span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px', color: 'var(--pe-text-main)' }}>
            {ci.title}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--pe-text-muted)', margin: 0 }}>
            {ci.subtitle}
          </p>
        </div>
      </div>

      {/* 工具卡片网格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {TOOL_KEYS.map(key => {
          const tool = ci.tools[key]
          const variant = TOOL_VARIANT[key]
          const href = `/${lang}/calculator/${TOOL_HREFS[key]}`

          const isPro  = variant === 'pro'
          const isCost = variant === 'cost'
          const isSpecial = isPro || isCost

          const specialStyle = isPro
            ? { background: 'linear-gradient(135deg, #0F6E56, #1D9E75)' }
            : { background: 'linear-gradient(135deg, #92400e, #b45309)' }   // amber for cost

          return (
            <Link key={key} href={href} style={{ textDecoration: 'none', display: 'block' }}>
              <div
                className={isSpecial ? '' : 'pe-card pe-calc-tool-card'}
                style={isSpecial ? {
                  ...specialStyle,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                } : {}}
              >
                {/* decorative circle */}
                {isSpecial && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '100px', height: '100px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)',
                  }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: '32px', lineHeight: 1 }}>{TOOL_ICONS[key]}</span>
                  {isPro ? (
                    <span style={{
                      background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '10px', fontWeight: 700,
                      padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(6px)',
                    }}>
                      ⭐ Pro
                    </span>
                  ) : isCost ? (
                    <span style={{
                      background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '10px', fontWeight: 700,
                      padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(6px)',
                    }}>
                      💰 成本版
                    </span>
                  ) : (
                    <span style={{
                      background: '#1D9E7520', color: '#1D9E75', fontSize: '10px', fontWeight: 700,
                      padding: '3px 8px', borderRadius: '12px', border: '1px solid #1D9E7540',
                    }}>
                      {ci.activeBadge}
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: isSpecial ? '#fff' : 'var(--pe-text-main)' }}>
                  {tool.title}
                </h2>
                <p style={{ fontSize: '11px', color: isSpecial ? 'rgba(255,255,255,0.8)' : 'var(--pe-text-hint)', margin: '0 0 12px', fontStyle: 'italic' }}>
                  {tool.titleEn}
                </p>
                <p style={{ fontSize: '13px', color: isSpecial ? 'rgba(255,255,255,0.9)' : 'var(--pe-text-muted)', margin: '0 0 16px', lineHeight: 1.6, flex: 1 }}>
                  {tool.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {tool.tags.map(tag => (
                    <span key={tag} style={{
                      background: isSpecial ? 'rgba(255,255,255,0.2)' : 'var(--pe-green-light)',
                      color: isSpecial ? '#fff' : 'var(--pe-green-dark)',
                      fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isSpecial ? '#fff' : 'var(--pe-green)', fontSize: '13px', fontWeight: 600 }}>
                  {ci.useNow}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 说明 */}
      <div className="pe-card" style={{ padding: '1rem 1.25rem', background: 'var(--pe-surface)' }}>
        <p style={{ fontSize: '12px', color: 'var(--pe-text-hint)', margin: 0, lineHeight: 1.7 }}>
          {ci.footerNote}{' '}
          <Link href={`/${lang}`} style={{ color: 'var(--pe-green)', marginLeft: '2px' }}>
            {ci.footerLink}
          </Link>
          {ci.footerOr}
        </p>
      </div>
    </main>
  )
}
