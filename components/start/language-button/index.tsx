import { Button } from "@nextui-org/button";

import { getLanguage } from "@/translations";
import { useLocale } from "@/providers";

export default function LanguageButton() {
  const { locale, setIsModalOpen } = useLocale();
  const language = getLanguage(locale);

  return (
    <Button
      color="default"
      size="sm"
      variant="light"
      onClick={() => setIsModalOpen(true)}
    >
      <span className="text-xl">{language.flag}</span>
      <p className="text-sm">{language.full}</p>
    </Button>
  );
}
