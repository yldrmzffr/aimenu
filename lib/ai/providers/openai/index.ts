import { BaseAIProvider } from "@/lib/ai/base-provider";
import { MenuAnalysisOptions, MenuAnalysisResponse } from "@/types";

export class Openai extends BaseAIProvider {
  async analyzeMenu(
    options: MenuAnalysisOptions,
  ): Promise<MenuAnalysisResponse> {
    throw new Error("Method not implemented.");
  }

  getPrompt(language: string): string {
    throw new Error("Method not implemented.");
  }
}
