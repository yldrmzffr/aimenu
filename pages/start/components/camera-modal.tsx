import { Modal, ModalContent, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

import { useLocale } from "@/components/locale-provider";

type CameraModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCapture: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
};

export function CameraModal({
  isOpen,
  onClose,
  onCapture,
  videoRef,
}: CameraModalProps) {
  const { t } = useLocale();

  return (
    <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
      <ModalContent>
        <ModalBody>
          <div className="relative aspect-video w-full">
            {/*
              <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full"
            />
             */}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            {t("cancel")}
          </Button>
          <Button color="primary" onPress={onCapture}>
            {t("capture")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
