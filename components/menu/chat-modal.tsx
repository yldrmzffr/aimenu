import type { Message } from "@/types";

import { useRef, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Send, X } from "lucide-react";
import { Spinner } from "@nextui-org/spinner";

import { useLocale } from "@/components/locale-provider";

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
        <ModalHeader className="flex justify-between items-center border-b z-10 bg-background">
          <div>
            <p className="text-lg font-bold">{t("menuAssistant")}</p>
            <p className="text-small text-default-500">
              {t("askAnythingAboutMenu")}
            </p>
          </div>
          <Button
            isIconOnly
            className="absolute sm:static right-2 top-2"
            variant="light"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </ModalHeader>

        <ModalBody className="p-0 flex flex-col overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-2 space-y-4"
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
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

          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                disabled={isLoading}
                placeholder={t("askAboutMenu")}
                radius="full"
                value={inputMessage}
                variant="bordered"
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />
              <Button
                isIconOnly
                color="primary"
                isLoading={isLoading}
                radius="full"
                onClick={handleSubmit}
              >
                {!isLoading && <Send size={20} />}
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
