import { Chip } from "@nextui-org/chip";

import { MenuItemTagsProps } from "@/components/menu/menu-item-card/types";

export function MenuItemTags({
  category,
  calories,
  prepTime,
}: MenuItemTagsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip
        className="bg-primary/10 text-primary font-medium"
        size="sm"
        variant="flat"
      >
        {category}
      </Chip>
      {calories && (
        <Chip className="font-medium" size="sm" variant="flat">
          {calories}
        </Chip>
      )}
      {prepTime && (
        <Chip className="font-medium" size="sm" variant="flat">
          {prepTime}
        </Chip>
      )}
    </div>
  );
}
