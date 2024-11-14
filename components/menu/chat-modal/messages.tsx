import { useRef, useEffect } from "react";
import { Spinner } from "@nextui-org/spinner";

import { ChatMessage } from "./message";

import { Message } from "@/types";

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatMessages({
  messages,
  isLoading = false,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;

      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto overscroll-contain px-4 py-2 space-y-4"
    >
      {messages.map((message, index) => (
        <ChatMessage key={message.id} index={index} message={message} />
      ))}
      {isLoading && (
        <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-1">
          <div className="bg-default-100 rounded-2xl px-4 py-2">
            <Spinner color="default" size="sm" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
}
