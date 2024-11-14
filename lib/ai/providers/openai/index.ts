import { BaseAIProvider } from "@/lib/ai/base-provider";
import { MenuAnalysisOptions, MenuAnalysisResponse } from "@/types";
import { OpenAIChatStrategy } from "@/lib/ai/chat/providers/openai-chat";

export class Openai extends BaseAIProvider {
  constructor(apiKey: string) {
    const chatStrategy = new OpenAIChatStrategy();

    super(chatStrategy);
  }

  async analyzeMenu(
    options: MenuAnalysisOptions,
  ): Promise<MenuAnalysisResponse> {
    throw new Error("Method not implemented.");
  }

  getPrompt(language: string): string {
    throw new Error("Method not implemented.");
  }
}
