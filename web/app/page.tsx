import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <h1 className="text-5xl font-bold text-blue-600">{t("title")}</h1>
        </div>
      </main>
    </div>
  );
}
