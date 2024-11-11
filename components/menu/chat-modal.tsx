import type { Message } from "@/types";

import { useRef, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Send, X } from "lucide-react";

import { useLocale } from "@/components/locale-provider";

interface ChatModalProps {
  isOpen: boolean;
  messages: Message[];
  inputMessage: string;
  onClose: () => void;
  onSend: (message?: string) => void;
  onInputChange: (value: string) => void;
}

export function ChatModal({
  isOpen,
  messages,
  inputMessage,
  onClose,
  onSend,
  onInputChange,
}: ChatModalProps) {
  const { t } = useLocale();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Modal
      hideCloseButton
      className="sm:!max-w-[600px] md:!max-w-[800px] sm:!h-[600px] sm:!m-4"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent className="h-[100dvh] sm:h-full relative">
        <ModalHeader className="flex justify-between items-center border-b sticky top-0 bg-background z-10">
          <div>
            <p className="text-lg font-bold">{t("menuAssistant")}</p>
            <p className="text-small text-default-500">
              {t("askAnythingAboutMenu")}
            </p>
          </div>
          <Button
            isIconOnly
            className="fixed sm:static right-2 top-2"
            variant="light"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
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
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t sticky bottom-0 bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder={t("askAboutMenu")}
                  radius="full"
                  value={inputMessage}
                  variant="bordered"
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      onSend();
                    }
                  }}
                />
                <Button
                  isIconOnly
                  color="primary"
                  radius="full"
                  onClick={() => onSend()}
                >
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
