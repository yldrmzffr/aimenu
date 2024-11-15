"use client";

import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { Languages } from "@/translations";

interface LanguageModalProps {
  onSelectLanguage: (lang: string) => void;
}

export function LanguageModal({ onSelectLanguage }: LanguageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasLanguage = Boolean(localStorage.getItem("locale"));

    if (!hasLanguage) setIsOpen(true);
  }, []);

  return (
    <Modal
      hideCloseButton
      backdrop="blur"
      isDismissable={false}
      isOpen={isOpen}
      size="md"
      onClose={() => setIsOpen(false)}
    >
      <ModalContent>
        <ModalHeader>Please select your language</ModalHeader>
        <ModalBody className="pb-6">
          <div className="grid grid-cols-2 gap-3">
            {Languages.map(({ key, flag, full }) => (
              <Button
                key={key}
                className="h-auto min-h-[100px] py-4"
                variant="bordered"
                onClick={() => {
                  onSelectLanguage(key);
                  setIsOpen(false);
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{flag}</span>
                  <div className="text-sm text-center">{full}</div>
                </div>
              </Button>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
