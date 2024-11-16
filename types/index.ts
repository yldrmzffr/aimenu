import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface MenuItem {
  name: string;
  description: string;
  price?: string;
  category?: string;
  allergens?: string[];
  calories?: string;
  prepTime?: string;
}
