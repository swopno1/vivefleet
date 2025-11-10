import { use } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params) // ✅ unwrap with React.use()
  setRequestLocale(locale)
  const t = useTranslations('HomePage')

  console.log('Home Page 123')

  return (
    <div>
      <main className="p-4">
        <h1>{t('title')}</h1>
      </main>
    </div>
  )
}
