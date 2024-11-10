export type LANGUAGE = {
  key: string;
  label: string;
  full: string;
  flag: string;
};

export const Languages: LANGUAGE[] = [
  {
    key: "en",
    label: "EN",
    full: "English",
    flag: "🇬🇧",
  },
  {
    key: "tr",
    label: "TR",
    full: "Türkçe",
    flag: "🇹🇷",
  },
  {
    key: "zh",
    label: "ZH",
    full: "中文",
    flag: "🇨🇳",
  },
  {
    key: "ar",
    label: "AR",
    full: "العربية",
    flag: "🇸🇦",
  },
  {
    key: "ru",
    label: "RU",
    full: "русский",
    flag: "🇷🇺",
  },
];

export const getLanguage = (key: string) => {
  return Languages.find((lang) => lang.key === key) || Languages[0];
};
