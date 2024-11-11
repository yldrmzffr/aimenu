import type { MenuItem } from "@/types";

import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { MessageCircle, ChevronDown } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

import { useLocale } from "@/components/locale-provider";

interface MenuItemCardProps {
  item: MenuItem;
  onAskBot: (question: string) => void;
}

export function MenuItemCard({ item, onAskBot }: MenuItemCardProps) {
  const { t } = useLocale();

  const askQuestions = [
    {
      key: "details",
      title: t("generalInfo"),
      question: `${t("tellMeAbout")} ${item.name}?`,
      icon: "💡",
    },
    {
      key: "ingredients",
      title: t("ingredients"),
      question: `${item.name} ${t("ingredients")}?`,
      icon: "🥗",
    },
    {
      key: "preparation",
      title: t("preparation"),
      question: `${t("howToPrepare")} ${item.name}?`,
      icon: "👨‍🍳",
    },
    {
      key: "nutrition",
      title: t("nutrition"),
      question: `${t("nutritionInfo")} ${item.name}?`,
      icon: "🍎",
    },
    {
      key: "dietary",
      title: t("dietaryInfo"),
      question: `${t("dietaryInfo")} ${item.name}?`,
      icon: "🌱",
    },
  ];

  return (
    <Card
      isPressable
      className="w-full hover:shadow-lg transition-all duration-200"
    >
      <CardBody className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-xl tracking-tight">
                  {item.name}
                </h3>
                <span className="font-bold text-lg text-primary">
                  {item.price}
                </span>
              </div>
              <p className="text-sm text-default-500 mt-1 leading-relaxed">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Chip
                  className="bg-primary/10 text-primary font-medium"
                  size="sm"
                  variant="flat"
                >
                  {item.category}
                </Chip>
                {item.calories && (
                  <Chip className="font-medium" size="sm" variant="flat">
                    {item.calories}
                  </Chip>
                )}
                {item.prepTime && (
                  <Chip className="font-medium" size="sm" variant="flat">
                    {item.prepTime}
                  </Chip>
                )}
              </div>

              {item.allergens && item.allergens.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.allergens.map((allergen: string) => (
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
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Button
              className="w-full sm:w-auto text-sm font-medium"
              color="primary"
              startContent={<MessageCircle size={18} />}
              variant="flat"
              onClick={() => onAskBot(askQuestions[0].question)}
            >
              {t("askAboutDish")}
            </Button>

            <Dropdown
              className="z-0"
              classNames={{
                base: "z-0",
                content: "z-0",
              }}
              placement="bottom-end"
            >
              <DropdownTrigger>
                <Button
                  className="w-full sm:w-auto text-sm font-medium"
                  endContent={<ChevronDown className="text-small" />}
                  variant="light"
                >
                  {t("exploreMore")}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Quick questions"
                className="w-full sm:min-w-[280px]"
                itemClasses={{
                  base: "py-2 px-4 data-[hover=true]:bg-default-100",
                  description: "text-default-500 font-normal",
                }}
                onAction={(key) => {
                  const question = askQuestions.find((q) => q.key === key);

                  if (question) onAskBot(question.question);
                }}
              >
                {askQuestions.map((item) => (
                  <DropdownItem
                    key={item.key}
                    className="gap-2"
                    description={item.question}
                    startContent={
                      <span aria-hidden="true" className="text-xl">
                        {item.icon}
                      </span>
                    }
                  >
                    <span className="font-medium">{item.title}</span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
