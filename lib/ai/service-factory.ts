import { AIProvider } from "@/types";
import { Openai } from "@/lib/ai/providers/openai";
import { Claude } from "@/lib/ai/providers/claude";

export class AIService {
  static createService(type: "claude" | "openai", apiKey: string): AIProvider {
    switch (type) {
      case "claude":
        return new Claude(apiKey);
      case "openai":
        return new Openai(apiKey);
      default:
        throw new Error(`Unsupported AI service type: ${type}`);
    }
  }
}
