import { Modal, ModalContent } from "@nextui-org/modal";

import { ChatHeader } from "./header";
import { ChatMessages } from "./messages";
import { ChatInput } from "./input";

import { useLocale } from "@/providers";
import { Message } from "@/types";

interface ChatModalProps {
  isOpen: boolean;
  messages: Message[];
  inputMessage: string;
  isLoading?: boolean;
  onClose: () => void;
  onSend: (message?: string) => void;
  onInputChange: (value: string) => void;
}

export function ChatModal({
  isOpen,
  messages,
  inputMessage,
  isLoading = false,
  onClose,
  onSend,
  onInputChange,
}: ChatModalProps) {
  const { t } = useLocale();

  const handleSubmit = () => {
    if (inputMessage.trim() && !isLoading) {
      onSend();
    }
  };

  return (
    <Modal
      hideCloseButton
      className="sm:!max-w-[600px] md:!max-w-[800px] sm:!h-[600px] sm:!m-4"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent className="h-[100dvh] sm:h-full">
        <ChatHeader
          subtitle={t("askAnythingAboutMenu")}
          title={t("menuAssistant")}
          onClose={onClose}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
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
