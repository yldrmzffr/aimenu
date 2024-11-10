import { useState, useRef } from "react";

import { UploadCard } from "./components/upload-card";
import { CameraModal } from "./components/camera-modal";

import DefaultLayout from "@/layouts/default";
import { useLocale } from "@/components/locale-provider";
import LanguageButton from "@/pages/start/components/language-button";

export default function IndexPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const { t } = useLocale();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      console.log("Selected file:", file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setIsCameraModalOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraModalOpen(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-image.jpg", {
              type: "image/jpeg",
            });

            console.log("Captured image:", file);
          }
        }, "image/jpeg");
      }

      stopCamera();
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-center items-center min-h-[80vh] w-full px-4">
        <div className="w-full max-w-3xl space-y-6">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold header animated">{t("title")}</h1>
            <p className="text-lg text-default-600">{t("description")}</p>
          </div>

          <UploadCard
            onImageUpload={handleImageUpload}
            onStartCamera={startCamera}
          />
          <div className="text-center text-default-500 text-sm">
            <LanguageButton />
          </div>
        </div>
      </div>

      <CameraModal
        isOpen={isCameraModalOpen}
        videoRef={videoRef}
        onCapture={captureImage}
        onClose={stopCamera}
      />
    </DefaultLayout>
  );
}
