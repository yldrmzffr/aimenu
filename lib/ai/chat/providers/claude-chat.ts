import Anthropic from "@anthropic-ai/sdk";

import { ChatOptions, ChatResponse } from "../types";

import { ChatStrategy } from "@/lib/ai/chat/chat-strategy";
import { MenuChatPrompt } from "@/lib/ai/prompts/menu-chat-prompt";

export class ClaudeChatStrategy extends ChatStrategy {
  constructor(
    private anthropic: Anthropic,
    prompt?: MenuChatPrompt,
  ) {
    super(prompt);
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    const response = await this.anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
      system: this.getSystemPrompt(options.menuData),
      messages: options.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const content = (response.content[0] as any).text;

    return {
      content,
    };
  }
}
