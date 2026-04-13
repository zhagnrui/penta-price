// Root page — the proxy.ts redirects / → /zh (or preferred locale)
// This file is a safety fallback; it should rarely render.
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/zh')
}
