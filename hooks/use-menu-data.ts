import type { MenuItem } from "@/types";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";

import { useLocale } from "@/components/locale-provider";

export function useMenuData(menuId: string | undefined) {
  const router = useRouter();
  const { t } = useLocale();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!menuId) return;

    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/menu/${menuId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        if (!data || !data.items) {
          router.push("/start");
          toast.error(t("menuItemsNotFound"));
        }

        setMenuItems(data.items);
      } catch (err) {
        router.push("/start");
        toast.error(t("menuItemsNotFound"));
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [menuId]);

  return { menuItems, isLoading, error };
}
