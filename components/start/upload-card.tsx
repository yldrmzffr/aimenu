import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { BiCloudUpload, BiCamera } from "react-icons/bi";

import { useLocale } from "@/components/locale-provider";

type UploadCardProps = {
  onStartCamera: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function UploadCard({ onStartCamera, onImageUpload }: UploadCardProps) {
  const { t } = useLocale();

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
              size="lg"
              startContent={<BiCloudUpload />}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {t("selectImage")}
            </Button>
            <Button
              color="secondary"
              size="lg"
              startContent={<BiCamera />}
              onClick={onStartCamera}
            >
              {t("takePhoto")}
            </Button>
          </div>

          <input
            accept="image/*"
            className="hidden"
            id="fileInput"
            type="file"
            onChange={onImageUpload}
          />
          <p className="text-xs text-default-400">{t("maxSize")}</p>
        </div>
      </CardBody>
    </Card>
  );
}
