import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = 'https://penta-price.vercel.app'

export const metadata: Metadata = {
  title: 'Pentaerythritol Price Tracker | 季戊四醇价格行情周报',
  description:
    '实时追踪单季/双季季戊四醇国内出厂价、FOB出口价及全球行情，每周更新。' +
    'Pentaerythritol weekly price tracker — mono & di-PE, China domestic EXW + international FOB/CIF.',
  keywords: [
    'pentaerythritol price', '季戊四醇价格', 'dipentaerythritol price',
    '双季戊四醇行情', 'penta price 2026', 'PE price China',
    'FOB Qingdao pentaerythritol', '季戊四醇出口价',
  ],
  authors: [{ name: 'Penta Price Team' }],
  openGraph: {
    title: 'Pentaerythritol Price Tracker | 季戊四醇价格行情',
    description: '单季/双季季戊四醇国内+国际价格，每周更新。Weekly mono & di-PE prices.',
    url: SITE_URL,
    siteName: 'Penta Price Tracker',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Pentaerythritol Price Tracker',
    description: 'Weekly mono & di-PE prices — China domestic + global FOB/CIF.',
  },
  alternates: { canonical: SITE_URL },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <footer className="pe-footer">
          <div className="pe-footer-inner">
            <div className="pe-footer-brand">
              <span className="pe-footer-logo">季戊四醇价格行情 · Pentaerythritol Price Tracker</span>
              <span className="pe-footer-tagline">专业化工原料价格数据服务 · Professional Chemical Price Intelligence</span>
            </div>
            <div className="pe-footer-contact">
              <a href="mailto:ryan139@gmail.com" className="pe-footer-email">
                📧 ryan139@gmail.com
              </a>
              <span className="pe-footer-note">询盘 &amp; 合作 · Inquiries &amp; partnerships</span>
            </div>
            <div className="pe-footer-copy">
              <span>© {new Date().getFullYear()} Penta Price Tracker. 数据仅供参考 · For reference only.</span>
              <span>每周四更新 · Updated every Thursday</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
