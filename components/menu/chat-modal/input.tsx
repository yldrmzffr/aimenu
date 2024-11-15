import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Send } from "lucide-react";

import { ChatInputProps } from "@/components/menu/chat-modal/types";

export function ChatInput({
  isLoading,
  inputMessage,
  onInputChange,
  onSubmit,
  placeholder,
}: ChatInputProps) {
  return (
    <div className="p-4 border-t bg-background">
      <div className="flex gap-2">
        <Input
          disabled={isLoading}
          placeholder={placeholder}
          radius="md"
          value={inputMessage}
          variant="bordered"
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
        />
        <Button
          isIconOnly
          color="primary"
          isLoading={isLoading}
          radius="md"
          onClick={onSubmit}
        >
          {!isLoading && <Send size={20} />}
        </Button>
      </div>
    </div>
  );
}
