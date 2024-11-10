import type { Message } from "@/types";

import { useState } from "react";

export function useChat(initialMessage: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: initialMessage,
      role: "assistant",
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = (customMessage?: string) => {
    const messageToSend = customMessage || inputMessage;

    if (!messageToSend.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsOpen(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Let me help you with that menu item.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return {
    messages,
    inputMessage,
    isOpen,
    setIsOpen,
    setInputMessage,
    handleSendMessage,
  };
}
