import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { Languages } from "@/translations";
import { useLocale } from "@/providers";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (locale: string) => void;
}

export const LanguageModal = ({
  isOpen,
  onClose,
  onSelectLanguage,
}: LanguageModalProps) => {
  const { availableLocales } = useLocale();

  return (
    <Modal
      hideCloseButton
      backdrop="blur"
      isOpen={isOpen}
      size="md"
      onClose={onClose}
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
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">{flag}</span>
                  <div className="text-sm text-center">{full}</div>
                </div>
              </Button>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
