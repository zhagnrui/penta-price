import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALES, DEFAULT_LOCALE, isValidLocale } from '@/lib/i18n/config'

// Paths that should never be locale-prefixed
const PUBLIC_PATHS = /^\/(api|_next\/static|_next\/image|favicon|robots\.txt|sitemap\.xml|og-image|apple-touch-icon|favicon-32x32)/

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public/static assets
  if (PUBLIC_PATHS.test(pathname)) return NextResponse.next()

  // Check if the URL already starts with a supported locale
  const segments = pathname.split('/')
  const maybeLocale = segments[1]

  if (isValidLocale(maybeLocale)) {
    // Already locale-prefixed — pass through
    return NextResponse.next()
  }

  // Detect preferred locale from Accept-Language header
  const acceptLang = request.headers.get('accept-language') ?? ''
  const preferred = detectLocale(acceptLang)

  // Check for a saved locale cookie (user manually switched)
  const cookieLang = request.cookies.get('pe-locale')?.value
  const locale = (cookieLang && isValidLocale(cookieLang)) ? cookieLang : preferred

  // Redirect / → /zh, /calculator → /zh/calculator, etc.
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

function detectLocale(acceptLang: string): typeof LOCALES[number] {
  if (!acceptLang) return DEFAULT_LOCALE
  // Parse e.g. "de-DE,de;q=0.9,en;q=0.8,zh;q=0.7"
  const tags = acceptLang
    .split(',')
    .map(part => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.split('-')[0].toLowerCase(), q: parseFloat(q ?? '1') }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of tags) {
    if (isValidLocale(tag)) return tag
  }
  return DEFAULT_LOCALE
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next internals
     * - static assets
     */
    '/((?!api|_next/static|_next/image|favicon|robots\\.txt|sitemap\\.xml|og-image|apple-touch-icon|favicon-32x32).*)',
  ],
}
