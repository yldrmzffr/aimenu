import { BaseAIProvider } from "@/lib/ai/base-provider";
import { MenuAnalysisPrompt } from "@/lib/ai/prompts/menu-analysis-prompt";

export class Openai implements BaseAIProvider {
  constructor(private apiKey: string) {}

  async analyzeMenu(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  getPrompt(language: string): string {
    return new MenuAnalysisPrompt().generate(language);
  }
}
