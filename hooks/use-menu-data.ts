import type { MenuItem } from "@/types";

import { useState } from "react";

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
    {
      name: "Tiramisu",
      description: "Coffee-soaked ladyfingers, mascarpone cream, cocoa",
      price: "€7.99",
      category: "Dessert",
      allergens: ["Gluten", "Eggs", "Dairy"],
      calories: "450 kcal",
      prepTime: "10 min",
    },
    {
      name: "Lasagna",
      description: "Layers of pasta, bolognese sauce, bechamel, mozzarella",
      price: "€16.99",
      category: "Pasta",
      allergens: ["Gluten", "Dairy"],
      calories: "1050 kcal",
      prepTime: "30 min",
    },
  ]);

  return { menuItems };
}
