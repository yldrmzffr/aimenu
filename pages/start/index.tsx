import { useState } from "react";

import { UploadCard } from "@/components/start/upload-card";
import DefaultLayout from "@/layouts/default";
import { useLocale } from "@/providers";
import LanguageButton from "@/components/start/language-button";
import Analyzing from "@/components/analyzing";

export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useLocale();

  if (isLoading) {
    return <Analyzing title={t("analyzingTitle")} />;
  }

  return (
    <DefaultLayout>
      <div className="flex justify-center items-center min-h-[80vh] w-full px-4">
        <div className="w-full max-w-3xl space-y-6">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold header animated">{t("title")}</h1>
            <p className="text-lg text-default-600">{t("description")}</p>
          </div>

          <UploadCard setIsLoading={setIsLoading} />
          <div className="text-center text-default-500 text-sm">
            <LanguageButton />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
