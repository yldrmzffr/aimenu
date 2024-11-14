import { Card, CardBody } from "@nextui-org/card";

import { useLocale } from "@/providers";
import { MenuItem } from "@/types";
import { MenuItemHeader } from "@/components/menu/menu-item-card/header";
import { MenuItemTags } from "@/components/menu/menu-item-card/tag";
import { MenuItemActions } from "@/components/menu/menu-item-card/actions";
import { MenuItemAllergens } from "@/components/menu/menu-item-card/allergens";

interface MenuItemCardProps {
  item: MenuItem;
  onAskBot: (question: string) => void;
}
export function MenuItemCard({ item, onAskBot }: MenuItemCardProps) {
  const { t } = useLocale();

  return (
    <Card
      isPressable
      className="w-full hover:shadow-lg transition-all duration-200"
    >
      <CardBody className="p-4">
        <div className="flex flex-col justify-between h-full min-h-[150px]">
          <div className="flex flex-col gap-2">
            <MenuItemHeader
              description={item.description}
              name={item.name}
              price={item.price}
            />

            <div className="min-h-[32px]">
              {(item.category || item.calories || item.prepTime) && (
                <MenuItemTags
                  calories={item.calories}
                  category={item.category}
                  prepTime={item.prepTime}
                />
              )}
            </div>

            <div className="min-h-[32px]">
              {item.allergens && item.allergens.length > 0 && (
                <MenuItemAllergens allergens={item.allergens} />
              )}
            </div>
          </div>

          <div className="mt-auto pt-0">
            <MenuItemActions itemName={item.name} t={t} onAskBot={onAskBot} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
