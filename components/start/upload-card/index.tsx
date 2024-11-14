import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { BiCloudUpload } from "react-icons/bi";

import { useUpload } from "./use-upload";

const FILE_INPUT_ID = "fileInput";

interface UploadCardProps {
  setIsLoading: (loading: boolean) => void;
}

export function UploadCard({ setIsLoading }: UploadCardProps) {
  const { isUploading, handleImageUpload, t } = useUpload(setIsLoading);

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
              isLoading={isUploading}
              size="lg"
              startContent={!isUploading && <BiCloudUpload />}
              onClick={() => document.getElementById(FILE_INPUT_ID)?.click()}
            >
              {t("selectImage")}
            </Button>
          </div>

          <input
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
            className="hidden"
            id={FILE_INPUT_ID}
            type="file"
            onChange={handleImageUpload}
          />
          <p className="text-xs text-default-400">{t("maxSize")}</p>
        </div>
      </CardBody>
    </Card>
  );
}
