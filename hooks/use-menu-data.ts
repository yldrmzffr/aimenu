import type { MenuItem } from "@/types";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";

export function useMenuData(menuId: string | undefined) {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!menuId) return;

    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/menu/${menuId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Bir hata oluştu");
        }

        if (!data || !data.items) {
          router.push("/start");
          toast.error("Menü bulunamadı");
        }

        setMenuItems(data.items);
      } catch (err) {
        router.push("/start");
        toast.error("Menü bulunamadı");
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [menuId]);

  return { menuItems, isLoading, error };
}
