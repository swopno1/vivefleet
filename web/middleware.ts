import { NextRequest, NextResponse } from 'next/server';
import { locales } from './i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = 'en'; // default locale

    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    );
  }

  // Protect dashboard route
  const token = request.cookies.get('token')?.value;
  if (pathname.endsWith('/dashboard') && !token) {
    const locale = pathname.split('/')[1] || 'en';
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
