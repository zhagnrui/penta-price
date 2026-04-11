import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pentaerythritol Price Tracker | 季戊四醇价格行情',
  description: '季戊四醇单季/双季国内外价格行情，每周更新。Pentaerythritol weekly price tracker.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
