import fs from "fs/promises";

import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import formidable, { Part } from "formidable";

import { setJsonEx } from "@/lib/redis";
import { analyzeMenuWithClaude } from "@/lib/menu";

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

    const base64Data = await fileToBase64(file.filepath);

    const menuAnalysis = await analyzeMenuWithClaude({
      fileBase64: base64Data,
      mimeType: file.mimetype as "image/jpeg" | "image/png" | "application/pdf",
      language,
    });

    const menuId = uuidv4();

    const menuData = {
      id: menuId,
      items: menuAnalysis.menuItems,
      fileType: file.mimetype,
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
