import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/i18n'

// 1️⃣ Initialize next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
})

// 2️⃣ Combined middleware function
export async function proxy(req: NextRequest) {
  // Run i18n middleware first
  const intlResponse = intlMiddleware(req)
  if (intlResponse) return intlResponse

  // Extract token and pathname
  const token = req.cookies.get('token')
  const { pathname } = req.nextUrl

  // 3️⃣ Protect /dashboard routes
  const protectedPaths = ['/admin', '/driver', '/fleet'];
  const isProtected = protectedPaths.some(p => pathname.endsWith(p));

  if (isProtected && !token) {
    const locale = pathname.split('/')[1] || defaultLocale;
    const url = req.nextUrl.clone()
    url.pathname = `/${locale}/(auth)/login`
    return NextResponse.redirect(url)
  }

  // Continue request normally
  return NextResponse.next()
}

// 4️⃣ Unified matcher
export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|manifest.json|favicon.ico|.*\\..*).*)',
  ],
}
