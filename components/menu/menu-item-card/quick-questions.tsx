import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { ChevronDown } from "lucide-react";

import {
  MenuItemActionsProps,
  QuickQuestion,
} from "@/components/menu/menu-item-card/types";
import { translations } from "@/translations";

export function getQuickQuestions(
  itemName: string,
  t: (key: keyof typeof translations.en) => string,
): QuickQuestion[] {
  return [
    {
      key: "details",
      title: t("generalInfo"),
      question: `${t("tellMeAbout")} ${itemName}?`,
      icon: "💡",
    },
    {
      key: "ingredients",
      title: t("ingredients"),
      question: `${itemName} ${t("ingredients")}?`,
      icon: "🥗",
    },
    {
      key: "preparation",
      title: t("preparation"),
      question: `${t("howToPrepare")} ${itemName}?`,
      icon: "👨‍🍳",
    },
    {
      key: "nutrition",
      title: t("nutrition"),
      question: `${t("nutritionInfo")} ${itemName}?`,
      icon: "🍎",
    },
    {
      key: "dietary",
      title: t("dietaryInfo"),
      question: `${t("dietaryInfo")} ${itemName}?`,
      icon: "🌱",
    },
  ];
}

export function MenuItemQuickQuestions({
  itemName,
  onAskBot,
  t,
}: MenuItemActionsProps) {
  const questions = getQuickQuestions(itemName, t);

  return (
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
          const question = questions.find((q) => q.key === key);

          if (question) onAskBot(question.question);
        }}
      >
        {questions.map((item) => (
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
  );
}
