import fs from "fs/promises";

import { parse } from "csv-parse/sync";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import Anthropic from "@anthropic-ai/sdk";

import { setJsonEx } from "@/lib/redis";
import { MenuItem } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function imageToBase64(filepath: string): Promise<string> {
  const fileData = await fs.readFile(filepath);

  return fileData.toString("base64");
}

export function csvToJson(csvString: string): MenuItem[] {
  try {
    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ",",
      trim: true,
    }) as Record<string, string>[];

    return records.map(
      (record): MenuItem => ({
        name: record.name,
        description: record.description,
        category: record.category,
        price: record.price || undefined,
        allergens: record.allergens ? record.allergens.split(";") : [],
        calories: record.calories || undefined,
        prepTime: record.prep_time || undefined,
      }),
    );
  } catch (error) {
    console.error("CSV parsing error:", error);

    return [];
  }
}

interface MenuAnalysisResponse {
  menuItems: MenuItem[];
}

async function analyzeMenuWithClaude(
  imageBase64: string,
  language: string,
): Promise<MenuAnalysisResponse> {
  try {
    const systemPrompt = `You are a professional menu analysis expert with extensive experience in restaurant operations and food service industry.
      Analyze the provided menu image and extract detailed menu items data.
      
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
      
      Example output format (in ${language.toUpperCase()}):
      name,description,price,category,allergens,calories,prep_time
      "Margherita Pizza","Mozarella peyniri, taze fesleğen ve domates sos ile",€12,"Ana Yemek","süt;gluten",,
      "Sezar Salata","Marul, kruton, parmesan peyniri ve sezar sos",€8,"Başlangıç","süt;gluten;yumurta",320,
      
      Return only the CSV formatted data without any additional text or explanations.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      temperature: 0.2,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageBase64,
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

    const text = (response.content[0] as any).text;
    const result = csvToJson(text);

    console.log("Claude analysis result:", result);

    return { menuItems: result };
  } catch (error) {
    console.error("Claude analysis error:", error);
    throw new Error("Menu analysis failed");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);
    const file = files.image?.[0];
    const language = fields.language?.[0] || "en";

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const base64Image = await imageToBase64(file.filepath);

    const menuAnalysis = await analyzeMenuWithClaude(base64Image, language);

    const menuId = uuidv4();

    const menuData = {
      id: menuId,
      items: menuAnalysis.menuItems,
      createdAt: new Date(),
    };

    const redisKey = `menu:${menuId}:details`;

    await setJsonEx(
      redisKey,
      menuData,
      60 * 60 * 10, // 10 hours
    );

    res.status(200).json({
      success: true,
      menuId,
      menuData,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
}
