"use client";
import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { Languages } from "@/translations";

type Props = {
  onSelectLanguage: (lang: string) => void;
};

export function LanguageModal({ onSelectLanguage }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("locale");

    if (!savedLanguage) {
      setIsOpen(true);
    }
  }, []);

  const handleSelectLanguage = (lang: string) => {
    onSelectLanguage(lang);
    setIsOpen(false);
  };

  return (
    <Modal
      hideCloseButton
      isDismissable={false}
      isOpen={isOpen}
      size="md"
      onClose={() => setIsOpen(false)}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Please select your language
        </ModalHeader>
        <ModalBody className="pb-6">
          <div className="grid grid-cols-2 gap-3">
            {Languages.map((lang) => (
              <Button
                key={lang.key}
                className="h-auto min-h-[100px] py-4"
                variant="bordered"
                onClick={() => handleSelectLanguage(lang.key)}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-sm text-center">{lang.full}</div>
                </div>
              </Button>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
