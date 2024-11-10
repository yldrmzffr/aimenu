import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { BiCloudUpload } from "react-icons/bi";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

import { useLocale } from "@/components/locale-provider";
import { useSocket } from "@/hooks/use-socket";

export function UploadCard() {
  const { isConnected } = useSocket();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLocale();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setLoading(true);

    if (!isConnected) {
      toast.error(t("socketConnectionError"));
      setLoading(false);

      return;
    }

    try {
      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();

      router.push(`/menu/${data.menuId}/detail`);
    } catch (error) {
      toast.error(t("uploadFailed"));
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-default-200">
      <CardBody className="py-12">
        <div className="flex flex-col items-center gap-4">
          <BiCloudUpload className="text-primary" size={40} />
          <h3 className="text-xl font-semibold">{t("uploadTitle")}</h3>
          <p className="text-default-500">{t("formats")}</p>

          <div className="flex flex-col w-full gap-2 max-w-[200px]">
            <Button
              color="primary"
              isLoading={loading}
              size="lg"
              startContent={<BiCloudUpload />}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {t("selectImage")}
            </Button>
            {/*
              <Button color="secondary" size="lg" startContent={<BiCamera />}>
              {t("takePhoto")}
              </Button>
            */}
          </div>

          <input
            accept="image/*"
            className="hidden"
            id="fileInput"
            type="file"
            onChange={handleImageUpload}
          />
          <p className="text-xs text-default-400">{t("maxSize")}</p>
        </div>
      </CardBody>
    </Card>
  );
}
