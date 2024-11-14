import Anthropic from "@anthropic-ai/sdk";

import { ChatOptions, ChatResponse } from "../types";

import { ChatStrategy } from "@/lib/ai/chat/chat-strategy";
import { MenuChatPrompt } from "@/lib/ai/prompts/menu-chat-prompt";
import { Logger } from "@/lib/utils/logger";

export class ClaudeChatStrategy extends ChatStrategy {
  private readonly logger = new Logger("ClaudeChatStrategy");

  constructor(
    private anthropic: Anthropic,
    prompt?: MenuChatPrompt,
  ) {
    super(prompt);
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    this.logger.debug("Chatting with Claude", { options });
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

    this.logger.debug("Chat response", { content });

    return {
      content,
    };
  }
}
