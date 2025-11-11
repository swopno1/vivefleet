'use client'

import PwaComponents from '@/components/pwa/PwaComponents'
import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('HomePage')

  return (
    <div>
      <main className="p-4">
        <h1>{t('title')}</h1>
        <PwaComponents />
      </main>
    </div>
  )
}
