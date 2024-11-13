import Anthropic from "@anthropic-ai/sdk";

import { csvToJson } from "./parser";

import { MenuItem } from "@/types";

interface MenuAnalysisResponse {
  menuItems: MenuItem[];
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MENU_ANALYSIS_PROMPT = (
  language: string,
) => `You are a professional menu analysis expert with extensive experience in restaurant operations and food service industry.
      Analyze the provided menu image/PDF and extract detailed menu items data.
      
      Return data in CSV format with the following headers:
      name,description,price,category,allergens,calories,prep_time
      
      Formatting Rules:
      - First line must contain headers exactly as shown above
      - Use comma (,) as delimiter
      - Use semicolon (;) to separate multiple allergens
      - Leave empty fields blank between commas
      - Wrap text fields in double quotes if they contain commas, quotes, or special characters
      - Include currency symbol in prices (e.g. $, €, £)
      
      Data Processing Rules:
      - DO NOT generate or guess prep_time if not explicitly shown in the menu image
      - DO NOT generate or guess calories if not explicitly shown in the menu image
      - DO NOT generate or guess price if not explicitly shown in the menu image
      - If description/category is missing: You may add appropriate ones based on item context
      - If allergens are not explicitly listed: You may suggest based on ingredients
      - For any missing numerical fields (price, calories, prep_time): Leave completely empty (no "-")
      
      Translation Instructions:
      1. First identify and extract all menu items in original language
      2. Translate the following to ${language.toUpperCase()}:
         - Item names (if needed)
         - Descriptions
         - Categories
         - Allergens
      3. Use consistent terminology for translated categories and allergens
      4. Maintain original price format and currency symbol
      5. Keep numbers (calories) in original format
      
      Return only the CSV formatted data without any additional text or explanations.`;

interface AnalyzeMenuOptions {
  fileBase64: string;
  mimeType: "application/pdf" | "image/jpeg" | "image/png";
  language: string;
  maxTokens?: number;
  temperature?: number;
}

async function analyzePdfMenu({
  fileBase64,
  language,
  maxTokens = 1024,
  temperature = 0.2,
}: Omit<AnalyzeMenuOptions, "mimeType">) {
  return anthropic.beta.messages.create({
    betas: ["pdfs-2024-09-25"],
    model: "claude-3-5-sonnet-20241022",
    max_tokens: maxTokens,
    temperature: temperature,
    system: MENU_ANALYSIS_PROMPT(language),
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

async function analyzeImageMenu({
  fileBase64,
  mimeType,
  language,
  maxTokens = 1024,
  temperature = 0.2,
}: Omit<AnalyzeMenuOptions, "mimeType"> & {
  mimeType: "image/jpeg" | "image/png";
}) {
  return anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: maxTokens,
    temperature: temperature,
    system: MENU_ANALYSIS_PROMPT(language),
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

export class MenuAnalysisError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "MenuAnalysisError";
  }
}

export async function analyzeMenuWithClaude({
  fileBase64,
  mimeType,
  language,
  maxTokens = 1024,
  temperature = 0.2,
}: AnalyzeMenuOptions): Promise<MenuAnalysisResponse> {
  try {
    let response;

    if (mimeType === "application/pdf") {
      response = await analyzePdfMenu({
        fileBase64,
        language,
        maxTokens,
        temperature,
      });
    } else {
      response = await analyzeImageMenu({
        fileBase64,
        mimeType,
        language,
        maxTokens,
        temperature,
      });
    }

    if (!response?.content?.[0]) {
      throw new MenuAnalysisError("Invalid response from Claude");
    }

    const text = (response.content[0] as any).text;

    const result = csvToJson(text);

    if (!result || result.length === 0) {
      throw new MenuAnalysisError(
        "No menu items were extracted from the analysis",
      );
    }

    console.log(`Successfully analyzed menu with ${result.length} items`);

    return { menuItems: result };
  } catch (error) {
    console.error("Menu analysis error:", {
      error,
      mimeType,
      language,
      timestamp: new Date().toISOString(),
    });

    throw new MenuAnalysisError(
      "Failed to analyze menu",
      error instanceof Error ? error : undefined,
    );
  }
}

export const menuAnalyzer = {
  analyzeMenu: analyzeMenuWithClaude,
  createPrompt: MENU_ANALYSIS_PROMPT,
};
