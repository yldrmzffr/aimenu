import { Input } from "@nextui-org/input";
import { Search } from "lucide-react";

import { useLocale } from "@/providers";

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MenuSearch({ value, onChange }: MenuSearchProps) {
  const { t } = useLocale();

  return (
    <Input
      className="w-[200px]"
      placeholder={t("search")}
      radius="full"
      startContent={<Search size={18} />}
      value={value}
      variant="bordered"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
