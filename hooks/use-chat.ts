import type { MenuItem } from "@/types";

import { useState, useEffect, useCallback, useRef } from "react";
import { nanoid } from "nanoid";

import { useLocale } from "@/providers";
import { Message } from "@/components/menu/chat-modal/types";

interface ChatState {
  messages: Message[];
  inputMessage: string;
  isOpen: boolean;
  isLoading: boolean;
}

interface ChatActions {
  setIsOpen: (isOpen: boolean) => void;
  setInputMessage: (message: string) => void;
  clearChat: () => void;
  handleSendMessage: (customMessage?: string) => Promise<void>;
}

const API_ENDPOINTS = {
  MESSAGES: (menuId: string) => `/api/messages?menuId=${menuId}`,
  CHAT: "/api/chat",
} as const;

export function useMenuChat(
  menuId: string,
  menuData: MenuItem[],
  chatOpen?: boolean,
): ChatState & ChatActions {
  const { t } = useLocale();
  const abortControllerRef = useRef<AbortController>();

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

  const fetchWithTimeout = async (
    url: string,
    options: RequestInit = {},
    timeout = 8000,
  ) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const controller = abortControllerRef.current;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!menuId) return;

    try {
      const data = await fetchWithTimeout(API_ENDPOINTS.MESSAGES(menuId));

      if (data?.length > 0) {
        setState((prev) => ({
          ...prev,
          messages: data,
        }));
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request cancelled");

        return;
      }
      console.error("Failed to fetch messages:", error);
    }
  }, [menuId]);

  useEffect(() => {
    fetchMessages();

    return () => {
      abortControllerRef.current?.abort();
      setState(createInitialState());
    };
  }, [menuId, fetchMessages, createInitialState]);

  const createMessage = useCallback(
    (content: string, role: "user" | "assistant"): Message => ({
      id: nanoid(),
      content,
      role,
      timestamp: new Date(),
    }),
    [],
  );

  const clearChat = async () => {
    try {
      await fetchWithTimeout(API_ENDPOINTS.MESSAGES(menuId), {
        method: "DELETE",
      });

      setState(createInitialState());
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

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
      const data = await fetchWithTimeout(API_ENDPOINTS.CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          menuId,
        }),
      });

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
    clearChat,
  };
}
