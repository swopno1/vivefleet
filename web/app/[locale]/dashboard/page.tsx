
import { getTranslator } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Dashboard from './Dashboard';

export default async function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslator(locale, 'DashboardPage');

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
      <Dashboard />
    </main>
  );
}
