"use client";

import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/site-header";

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("HomePage");

  return (
    <div>
      <SiteHeader />
      <main className="p-4">
        <h1>{t("title")}</h1>
      </main>
    </div>
  );
}
