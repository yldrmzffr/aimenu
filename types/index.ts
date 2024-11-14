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

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface MenuAnalysisResponse {
  menuItems: MenuItem[];
}

export interface AIProvider {
  analyzeMenu: (options: MenuAnalysisOptions) => Promise<MenuAnalysisResponse>;
  getPrompt: (language: string) => string;
}

export interface MenuAnalysisOptions {
  fileBase64: string;
  mimeType: "application/pdf" | "image/jpeg" | "image/png";
  language: string;
  maxTokens?: number;
  temperature?: number;
}

export interface FileAnalysisOptions {
  mimeType: "application/pdf" | "image/jpeg" | "image/png";
  fileBase64: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}
