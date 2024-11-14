import { AIProvider, MenuAnalysisOptions, MenuAnalysisResponse } from "@/types";

export abstract class BaseAIProvider implements AIProvider {
  abstract analyzeMenu(
    options: MenuAnalysisOptions,
  ): Promise<MenuAnalysisResponse>;
  abstract getPrompt(language: string): string;
}
