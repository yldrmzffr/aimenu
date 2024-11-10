import type { MenuItem } from "@/types";

import { useState } from "react";

import { useSocket } from "@/hooks/use-socket";

export function useMenuData(menuId: string | undefined) {
  const [menuItems] = useState<MenuItem[]>([
    {
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, basil, olive oil",
      price: "€12.99",
      category: "Pizza",
      allergens: ["Gluten", "Dairy"],
      calories: "850 kcal",
      prepTime: "15 min",
    },
    {
      name: "Spaghetti Carbonara",
      description: "Eggs, pecorino cheese, pancetta, black pepper",
      price: "€14.99",
      category: "Pasta",
      allergens: ["Gluten", "Eggs", "Dairy"],
      calories: "950 kcal",
      prepTime: "20 min",
    },
  ]);
  const { isConnected } = useSocket();

  return { menuItems, isConnected };
}
