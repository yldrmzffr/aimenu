import type { MenuItem } from "@/types";

import { useState } from "react";

export function useMenuData() {
  const [menuItems] = useState<MenuItem[]>([
    {
      name: "Grilled Salmon",
      description:
        "Fresh Atlantic salmon with seasonal vegetables, served with lemon butter sauce",
      price: "€24.99",
      category: "Main Course",
      allergens: ["Fish", "Dairy"],
      calories: "450 kcal",
      prepTime: "20 min",
    },
    {
      name: "Beef Tenderloin",
      description:
        "Premium cut served with truffle mushroom sauce and roasted potatoes",
      price: "€29.99",
      category: "Main Course",
      allergens: ["Dairy"],
      calories: "580 kcal",
      prepTime: "25 min",
    },
  ]);

  return { menuItems };
}
