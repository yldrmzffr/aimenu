import { FileAnalysisStrategy } from "@/lib/ai/providers/claude/file-analysis/file-analysis";
import { Logger } from "@/lib/utils/logger";
import { FileAnalysisOptions } from "@/lib/ai/types";

export class ImageAnalysisStrategy implements FileAnalysisStrategy {
  private readonly logger = new Logger("ImageAnalysisStrategy");

  constructor(private anthropic: any) {}

  async analyzeFile({
    mimeType,
    fileBase64,
    maxTokens,
    temperature,
    prompt,
  }: FileAnalysisOptions) {
    this.logger.debug("Analyzing image file with claude", {
      mimeType,
      maxTokens,
      temperature,
    });

    return this.anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: maxTokens,
      temperature: temperature,
      system: prompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: fileBase64,
              },
            },
            {
              type: "text",
              text: "Please analyze this menu and extract the menu items.",
            },
          ],
        },
      ],
    });
  }
}
