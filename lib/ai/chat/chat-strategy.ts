import { MenuChatPrompt } from "../prompts/menu-chat-prompt";

import { ChatOptions, ChatResponse } from "@/lib/ai/chat/types";

export abstract class ChatStrategy {
  constructor(
    protected readonly prompt: MenuChatPrompt = new MenuChatPrompt(),
  ) {}

  protected getSystemPrompt(menuData: unknown): string {
    return this.prompt.generate(menuData);
  }

  abstract chat(options: ChatOptions): Promise<ChatResponse>;
}
