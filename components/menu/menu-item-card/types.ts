import { translations } from "@/translations";

export interface MenuItemHeaderProps {
  name: string;
  price?: string;
  description: string;
}

export interface MenuItemTagsProps {
  category?: string;
  calories?: string;
  prepTime?: string;
}

export interface MenuItemAllergensProps {
  allergens?: string[];
}

export interface MenuItemActionsProps {
  onAskBot: (question: string) => void;
  itemName: string;
  t: (key: keyof typeof translations.en) => string;
}

export interface QuickQuestion {
  key: string;
  title: string;
  question: string;
  icon: string;
}
