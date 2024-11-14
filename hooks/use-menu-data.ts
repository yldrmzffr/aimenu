import type { MenuItem } from "@/types";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";

import { useLocale } from "@/components/locale-provider";

interface MenuState {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
}

const API_ENDPOINTS = {
  MENU: (menuId: string) => `/api/menu/${menuId}`,
} as const;

const ROUTES = {
  START: "/start",
} as const;

const TIMEOUT_DURATION = 1000 * 30; // 30 seconds

export function useMenuData(menuId: string | undefined) {
  const router = useRouter();
  const { t } = useLocale();
  const abortControllerRef = useRef<AbortController>();

  const [state, setState] = useState<MenuState>({
    menuItems: [],
    isLoading: true,
    error: null,
  });

  const fetchWithTimeout = useCallback(
    async (
      url: string,
      options: RequestInit = {},
      timeout = TIMEOUT_DURATION,
    ) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const controller = abortControllerRef.current;
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "API request failed");
        }

        return data;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    [],
  );

  const fetchMenuItems = useCallback(async () => {
    if (!menuId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetchWithTimeout(API_ENDPOINTS.MENU(menuId));

      if (!data?.items) {
        throw new Error("Menu items not found");
      }

      setState((prev) => ({
        ...prev,
        menuItems: data.items,
        isLoading: false,
      }));
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request cancelled");

        return;
      }

      router.push(ROUTES.START);
      toast.error(t("menuItemsNotFound"));

      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      }));
    }
  }, [menuId, router, t, fetchWithTimeout]);

  useEffect(() => {
    fetchMenuItems();

    return () => {
      abortControllerRef.current?.abort();
      setState({
        menuItems: [],
        isLoading: true,
        error: null,
      });
    };
  }, [fetchMenuItems]);

  return {
    menuItems: state.menuItems,
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchMenuItems,
  };
}
