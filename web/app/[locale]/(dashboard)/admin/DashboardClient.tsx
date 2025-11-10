'use client'

import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'

import data from './data.json'
import { useTranslations } from 'next-intl'

export default function DashboardClient() {
  const t = useTranslations('AdminPage')

  return (
    <>
      <div className="px-4 lg:px-6">
        <h1>{t('title')}</h1>
      </div>

      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  )
}
