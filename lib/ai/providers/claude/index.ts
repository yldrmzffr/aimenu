import Anthropic from "@anthropic-ai/sdk";

import { BaseAIProvider } from "@/lib/ai/base-provider";
import { MenuAnalysisResponse, MenuAnalysisOptions } from "@/types";
import { PdfAnalysisStrategy } from "@/lib/ai/providers/claude/file-analysis/pdf-analysis";
import { ImageAnalysisStrategy } from "@/lib/ai/providers/claude/file-analysis/image-analysis";
import { FileAnalysisStrategy } from "@/lib/ai/providers/claude/file-analysis/file-analysis";
import { MenuAnalysisPrompt } from "@/lib/ai/prompts/menu-analysis-prompt";
import { csvToJson } from "@/lib//utils/cvs-json-parser";
import { ClaudeChatStrategy } from "@/lib/ai/chat/providers/claude-chat";

export class Claude extends BaseAIProvider {
  private fileAnalysisStrategies: Map<string, FileAnalysisStrategy>;
  private readonly defaultMaxTokens = 1024;
  private readonly defaultTemperature = 0.2;

  constructor(apiKey: string) {
    const anthropic = new Anthropic({ apiKey });
    const chatStrategy = new ClaudeChatStrategy(anthropic);

    super(chatStrategy);

    const strategies: [string, FileAnalysisStrategy][] = [
      ["application/pdf", new PdfAnalysisStrategy(anthropic)],
      ["image/jpeg", new ImageAnalysisStrategy(anthropic)],
      ["image/png", new ImageAnalysisStrategy(anthropic)],
    ];

    this.fileAnalysisStrategies = new Map(strategies);
  }

  getPrompt(language: string): string {
    return new MenuAnalysisPrompt().generate(language);
  }

  async analyzeMenu({
    fileBase64,
    mimeType,
    language,
    maxTokens = this.defaultMaxTokens,
    temperature = this.defaultTemperature,
  }: MenuAnalysisOptions): Promise<MenuAnalysisResponse> {
    try {
      const strategy = this.fileAnalysisStrategies.get(mimeType);

      if (!strategy) {
        throw new Error(`Unsupported file type: ${mimeType}`);
      }

      const response = await strategy.analyzeFile({
        fileBase64,
        maxTokens,
        temperature,
        prompt: this.getPrompt(language),
        mimeType,
      });

      const text = response.content[0].text;
      const menuItems = csvToJson(text);

      return {
        menuItems,
      };
    } catch (error) {
      throw error;
    }
  }
}
