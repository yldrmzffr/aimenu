import { BaseAIProvider } from "@/lib/ai/base-provider";
import { OpenAIChatStrategy } from "@/lib/ai/chat/providers/openai-chat";
import { MenuAnalysisOptions, MenuAnalysisResponse } from "@/lib/ai/types";

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
