export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  content: string;
}

export interface ChatOptions {
  menuData: unknown;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}
