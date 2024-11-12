import type { MenuItem, Message } from "@/types";

import { useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";

import { useLocale } from "@/components/locale-provider";

interface ChatState {
  messages: Message[];
  inputMessage: string;
  isOpen: boolean;
  isLoading: boolean;
}

interface ChatActions {
  setIsOpen: (isOpen: boolean) => void;
  setInputMessage: (message: string) => void;
  handleSendMessage: (customMessage?: string) => Promise<void>;
}

export function useMenuChat(
  menuId: string,
  menuData: MenuItem[],
): ChatState & ChatActions {
  const { t } = useLocale();

  const createInitialState = useCallback(
    (): ChatState => ({
      messages: [
        {
          id: nanoid(),
          content: t("chatWelcomeMessage"),
          role: "assistant",
          timestamp: new Date(),
        },
      ],
      inputMessage: "",
      isOpen: false,
      isLoading: false,
    }),
    [t],
  );

  const [state, setState] = useState<ChatState>(createInitialState());

  const fetchMessages = useCallback(async () => {
    if (!menuId) return;

    try {
      const response = await fetch(`/api/messages?menuId=${menuId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.messages?.length > 0) {
        setState((prev) => ({
          ...prev,
          messages: data.messages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, [menuId]);

  useEffect(() => {
    const loadMessages = async () => {
      await fetchMessages();
    };

    loadMessages();

    // Clean up function to reset state when component unmounts
    return () => {
      setState(createInitialState());
    };
  }, [menuId, fetchMessages, createInitialState]);

  const createMessage = (
    content: string,
    role: "user" | "assistant",
  ): Message => ({
    id: nanoid(),
    content,
    role,
    timestamp: new Date(),
  });

  const handleSendMessage = async (customMessage?: string) => {
    const messageContent = customMessage || state.inputMessage;

    if (!messageContent.trim()) return;

    const userMessage = createMessage(messageContent, "user");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      inputMessage: "",
      isOpen: true,
      isLoading: true,
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          menuId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = createMessage(data.response, "assistant");

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Chat API error:", error);

      const errorMessage = createMessage(t("chatErrorMessage"), "assistant");

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));
    }
  };

  const setIsOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isOpen }));
  }, []);

  const setInputMessage = useCallback((inputMessage: string) => {
    setState((prev) => ({ ...prev, inputMessage }));
  }, []);

  return {
    ...state,
    setIsOpen,
    setInputMessage,
    handleSendMessage,
  };
}
