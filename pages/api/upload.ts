import fs from "fs/promises";

import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import formidable, { Part } from "formidable";

import { setJsonEx } from "@/lib/database/redis";
import { AIProvider } from "@/types";
import { AIService } from "@/lib/ai/service-factory";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];

async function fileToBase64(filepath: string): Promise<string> {
  const fileData = await fs.readFile(filepath);

  return fileData.toString("base64");
}

// Disable the default body parser to allow parsing multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({
      filter: (part: Part): boolean => {
        if (!part.mimetype) return false;

        return ALLOWED_MIME_TYPES.includes(part.mimetype);
      },
    });

    const [fields, files] = await form.parse(req);
    const file = files.image?.[0];
    const language = fields.language?.[0] || "en";

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!file.mimetype) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    const fileBase64 = await fileToBase64(file.filepath);

    const provider: AIProvider = AIService.createService(
      "claude",
      process.env.ANTHROPIC_API_KEY || "",
    );

    const mimeType = file.mimetype as
      | "application/pdf"
      | "image/jpeg"
      | "image/png";

    const menuAnalysis = await provider.analyzeMenu({
      fileBase64,
      mimeType,
      language,
    });

    console.log("Menu analysis:", menuAnalysis);

    const menuId = uuidv4();

    const menuData = {
      id: menuId,
      items: menuAnalysis.menuItems,
      fileType: file.mimetype,
      createdAt: new Date(),
    };

    console.log("Menu data:", menuData);

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
