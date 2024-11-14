import { Button } from "@nextui-org/button";
import { X } from "lucide-react";

import { ChatHeaderProps } from "@/components/menu/chat-modal/types";

export function ChatHeader({ title, subtitle, onClose }: ChatHeaderProps) {
  return (
    <div className="flex justify-between items-center border-b z-10 bg-background p-4">
      <div>
        <p className="text-lg font-bold">{title}</p>
        <p className="text-small text-default-500">{subtitle}</p>
      </div>
      <Button
        isIconOnly
        className="absolute sm:static right-2 top-2"
        variant="light"
        onClick={onClose}
      >
        <X size={20} />
      </Button>
    </div>
  );
}
