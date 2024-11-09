"use client";

import DefaultLayout from "@/layouts/default";
import { useLocale } from "@/components/locale-provider";

export default function IndexPage() {
  const { t } = useLocale();

  return (
    <DefaultLayout>
      <div>{t("title")}</div>
      <div>{t("description")}</div>
    </DefaultLayout>
  );
}
