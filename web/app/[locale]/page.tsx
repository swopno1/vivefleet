import { use } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { LandingPage } from '@/components/landing-page'

export default function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)

  return <LandingPage />
}
