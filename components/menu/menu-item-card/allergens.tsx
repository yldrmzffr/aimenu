import { Chip } from "@nextui-org/chip";

import { MenuItemAllergensProps } from "@/components/menu/menu-item-card/types";

export function MenuItemAllergens({ allergens }: MenuItemAllergensProps) {
  if (!allergens?.length) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {allergens.map((allergen: string) => (
        <Chip
          key={allergen}
          className="bg-warning-50 text-warning-600 font-medium"
          size="sm"
          variant="flat"
        >
          {allergen}
        </Chip>
      ))}
    </div>
  );
}
