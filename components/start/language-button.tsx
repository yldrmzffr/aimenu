import { useRouter } from "next/router";
import { Link } from "@nextui-org/link";

import { getLanguage } from "@/translations";
import { useLocale } from "@/components/locale-provider";

export default function LanguageButton() {
  const { locale } = useLocale();
  const router = useRouter();

  const language = getLanguage(locale);

  return (
    <Link
      color="primary"
      size="sm"
      onClick={() => {
        // Todo: Refactor this to use the locale provider
        localStorage.removeItem("locale");
        router.reload();
      }}
    >
      {language.flag} {language.full}
    </Link>
  );
}
