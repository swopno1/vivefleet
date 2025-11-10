// web/i18n/request.ts

import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  // TODO: Enable locale validation once all locales are set up
  if (!locale || !locales.includes(locale)) {
    notFound()
  }

  const messages = (await import(`@/messages/${locale}.json`)).default

  return {
    locale: locale as string, // ✅ assert it's a string
    messages,
  }
})
