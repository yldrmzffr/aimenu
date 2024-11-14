import { FileAnalysisOptions } from "@/types";
import { FileAnalysisStrategy } from "@/lib/ai/providers/claude/file-analysis/file-analysis";

export class ImageAnalysisStrategy implements FileAnalysisStrategy {
  constructor(private anthropic: any) {}

  async analyzeFile({
    mimeType,
    fileBase64,
    maxTokens,
    temperature,
    prompt,
  }: FileAnalysisOptions) {
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
