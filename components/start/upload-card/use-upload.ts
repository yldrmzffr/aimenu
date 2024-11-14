import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { useLocale } from "@/providers";
import { translations } from "@/translations";

interface UploadResponse {
  success: boolean;
  menuId?: string;
  error?: string;
}

interface UploadState {
  isUploading: boolean;
  handleImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
  t: (key: keyof typeof translations.en) => string;
}

async function uploadImageToServer(
  file: File,
  locale: string,
): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("language", locale);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
}

export function useUpload(
  setIsLoading: (loading: boolean) => void,
): UploadState {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { t, locale } = useLocale();

  const updateLoadingState = (loading: boolean) => {
    setIsUploading(loading);
    setIsLoading(loading);
  };

  const handleSuccess = (menuId: string) => {
    toast.success(t("analysisComplete"));
    router.push(`/menu/${menuId}`);
  };

  const handleError = (error: unknown) => {
    console.error("Upload error:", error);
    toast.error(t("uploadFailed"));
  };

  const validateFile = (file: File | undefined): file is File => {
    if (!file) {
      return false;
    }

    return true;
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!validateFile(file)) return;

    updateLoadingState(true);
    toast.info(t("analyzing"));

    try {
      const response = await uploadImageToServer(file, locale);

      if (response.success && response.menuId) {
        handleSuccess(response.menuId);
      } else {
        throw new Error(response.error || "Analysis failed");
      }
    } catch (error) {
      handleError(error);
    } finally {
      updateLoadingState(false);
    }
  };

  return {
    isUploading,
    handleImageUpload,
    t,
  };
}
