import { useState, useRef } from "react";

import { UploadCard } from "@/components/start/upload-card";
import { CameraModal } from "@/components/start/camera-modal";
import DefaultLayout from "@/layouts/default";
import { useLocale } from "@/components/locale-provider";
import LanguageButton from "@/components/start/language-button";
import Analyzing from "@/components/analyzing";

export default function IndexPage() {
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const { t } = useLocale();

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

  if (isLoading) {
    return <Analyzing title={t("analyzingTitle")} />;
  }

  return (
    <DefaultLayout>
      <div className="flex justify-center items-center min-h-[80vh] w-full px-4">
        <div className="w-full max-w-3xl space-y-6">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold header animated">{t("title")}</h1>
            <p className="text-lg text-default-600">{t("description")}</p>
          </div>

          <UploadCard setIsLoading={setIsLoading} />
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
