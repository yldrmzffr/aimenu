import { ChatOptions, ChatResponse } from "./chat/types";

import { MenuAnalysisOptions, MenuAnalysisResponse } from "@/types";
import { ChatStrategy } from "@/lib/ai/chat/chat-strategy";

export abstract class BaseAIProvider {
  constructor(protected readonly chatStrategy: ChatStrategy) {}

  abstract analyzeMenu(
    options: MenuAnalysisOptions,
  ): Promise<MenuAnalysisResponse>;
  abstract getPrompt(language: string): string;

  async chat(options: ChatOptions): Promise<ChatResponse> {
    return this.chatStrategy.chat(options);
  }
}
