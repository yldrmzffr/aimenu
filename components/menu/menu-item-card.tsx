import type { MenuItem } from "@/types";

import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Bot } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  onAskBot: (question: string) => void;
}

export function MenuItemCard({ item, onAskBot }: MenuItemCardProps) {
  return (
    <Card
      isPressable
      className="w-full hover:shadow-lg transition-shadow duration-200"
    >
      <CardBody className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-xl">{item.name}</h3>
              <span className="font-bold text-lg text-primary">
                {item.price}
              </span>
            </div>
            <p className="text-sm text-default-500 mt-1">{item.description}</p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Chip
                className="bg-primary/10 text-primary"
                size="sm"
                variant="flat"
              >
                {item.category}
              </Chip>
              {item.calories && (
                <Chip size="sm" variant="flat">
                  {item.calories}
                </Chip>
              )}
              {item.prepTime && (
                <Chip size="sm" variant="flat">
                  {item.prepTime}
                </Chip>
              )}
            </div>

            {item.allergens && item.allergens.length > 0 && (
              <div className="flex gap-1 mt-3">
                {item.allergens.map((allergen: string) => (
                  <Chip
                    key={allergen}
                    className="bg-warning-50 text-warning-600"
                    size="sm"
                    variant="flat"
                  >
                    {allergen}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          <Button
            isIconOnly
            className="text-primary"
            variant="light"
            onClick={() => onAskBot(`Tell me more about ${item.name}`)}
          >
            <Bot size={24} />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
