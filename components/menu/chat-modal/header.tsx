import { Button } from "@nextui-org/button";
import { Trash, X, Bot } from "lucide-react";

import { ChatHeaderProps } from "@/components/menu/chat-modal/types";

export function ChatHeader({
  title,
  subtitle,
  onClose,
  clearChat,
}: ChatHeaderProps) {
  return (
    <div className="flex justify-between items-center border-b z-10 bg-background p-4">
      <Bot className="ml-3 mr-5 size-9" />
      <div className="flex-1">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-small text-default-500">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        <Button isIconOnly color="danger" variant="light" onClick={clearChat}>
          <Trash size={20} />
        </Button>
        <Button isIconOnly variant="light" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}
