import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// TODO: Define different types in separate files for better organization and maintainability

export interface MenuItem {
  name: string;
  description: string;
  price?: string;
  category?: string;
  allergens?: string[];
  calories?: string;
  prepTime?: string;
}
