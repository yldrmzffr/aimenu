import { Modal, ModalContent } from "@nextui-org/modal";
import { useEffect } from "react";

import { ChatHeader } from "./header";
import { ChatMessages } from "./messages";
import { ChatInput } from "./input";

import { useLocale } from "@/providers";
import { Message } from "@/components/menu/chat-modal/types";

interface ChatModalProps {
  isOpen: boolean;
  messages: Message[];
  inputMessage: string;
  isLoading?: boolean;
  onClose: () => void;
  onSend: (message?: string) => void;
  onInputChange: (value: string) => void;
  clearChat: () => void;
}

export function ChatModal({
  isOpen,
  messages,
  inputMessage,
  isLoading = false,
  onClose,
  onSend,
  onInputChange,
  clearChat,
}: ChatModalProps) {
  const { t } = useLocale();

  const handleSubmit = () => {
    if (inputMessage.trim() && !isLoading) {
      onSend();
    }
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isOpen) {
        event.preventDefault();
        onClose();
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    if (isOpen) {
      window.history.pushState(null, "", window.location.pathname);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  return (
    <Modal
      hideCloseButton
      backdrop="blur"
      classNames={{
        base: "sm:!max-w-[600px] md:!max-w-[800px] sm:!h-[600px] sm:!m-4 animate-soft-glow",
        wrapper: "items-end sm:items-center ",
      }}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent className="h-screen max-h-[100dvh] sm:h-full flex flex-col">
        <ChatHeader
          clearChat={clearChat}
          subtitle={t("askAnythingAboutMenu")}
          title={t("menuAssistant")}
          onClose={onClose}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <ChatMessages isLoading={isLoading} messages={messages} />

          <ChatInput
            inputMessage={inputMessage}
            isLoading={isLoading}
            placeholder={t("askAboutMenu")}
            onInputChange={onInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </ModalContent>
    </Modal>
  );
}
