import { Button } from "@nextui-org/button";
import { MessageCircle } from "lucide-react";

import { MenuItemActionsProps } from "@/components/menu/menu-item-card/types";
import {
  getQuickQuestions,
  MenuItemQuickQuestions,
} from "@/components/menu/menu-item-card/quick-questions";

export function MenuItemActions({
  itemName,
  onAskBot,
  t,
}: MenuItemActionsProps) {
  const questions = getQuickQuestions(itemName, t);

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        className="w-full sm:w-auto text-sm font-medium"
        color="primary"
        startContent={<MessageCircle size={18} />}
        variant="flat"
        onClick={() => onAskBot(questions[0].question)}
      >
        {t("askAboutDish")}
      </Button>

      <MenuItemQuickQuestions itemName={itemName} t={t} onAskBot={onAskBot} />
    </div>
  );
}
