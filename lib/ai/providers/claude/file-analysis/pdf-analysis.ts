import { FileAnalysisStrategy } from "./file-analysis";

import { FileAnalysisOptions } from "@/types";
import { Logger } from "@/lib/utils/logger";

export class PdfAnalysisStrategy implements FileAnalysisStrategy {
  private readonly logger = new Logger("PdfAnalysisStrategy");
  constructor(private anthropic: any) {}

  async analyzeFile({
    fileBase64,
    maxTokens,
    temperature,
    prompt,
  }: FileAnalysisOptions) {
    this.logger.debug("Analyzing pdf file with claude", {
      maxTokens,
      temperature,
    });

    return this.anthropic.beta.messages.create({
      betas: ["pdfs-2024-09-25"],
      model: "claude-3-5-sonnet-20241022",
      max_tokens: maxTokens,
      temperature: temperature,
      system: prompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
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
