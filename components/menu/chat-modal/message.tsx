import { ChatMessageProps } from "@/components/menu/chat-modal/types";

export function ChatMessage({ message, index }: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } animate-in fade-in-0 slide-in-from-bottom-1 duration-200`}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-default-100"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
