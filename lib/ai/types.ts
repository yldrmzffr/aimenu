import { ChatOptions, ChatResponse } from "@/lib/ai/chat/types";
import { MenuItem } from "@/types";

export interface MenuAnalysisResponse {
  menuItems: MenuItem[];
}

export interface AIProvider {
  analyzeMenu: (options: MenuAnalysisOptions) => Promise<MenuAnalysisResponse>;
  getPrompt: (language: string) => string;
  chat: (options: ChatOptions) => Promise<ChatResponse>;
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
  language: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}
