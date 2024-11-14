import { ChatOptions, ChatResponse } from "../types";

import { ChatStrategy } from "@/lib/ai/chat/chat-strategy";

export class OpenAIChatStrategy extends ChatStrategy {
  async chat(options: ChatOptions): Promise<ChatResponse> {
    throw new Error("Method not implemented.");
  }
}
