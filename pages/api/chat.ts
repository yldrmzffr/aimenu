import type { NextApiRequest, NextApiResponse } from "next";

import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";

import * as redis from "@/lib/database/redis";
import { ChatLib } from "@/lib/utils/chat";
import { Message } from "@/types";

const ANTHROPIC_CLIENT = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const generateSystemMessage = (menuData: unknown): string =>
  `
You are a restaurant menu assistant. Help customers with this menu data:
${JSON.stringify(menuData, null, 2)}

Rules:
- Give very short, direct answers
- Only provide information from the menu data
- Match customer's language
- Mention allergens when relevant
- Never guess unavailable information
- Keep responses professional and short (1-2 sentences)
- If any information (calorie, description, etc.) is missing, add your own professional opinion with "I recommend", "I suggest" etc.
`.trim();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message, menuId } = req.body;

    if (!menuId) return res.status(400).json({ message: "Menu ID required" });

    const menuData = await redis.getJson(`menu:${menuId}:details`);

    if (!menuData) return res.status(404).json({ message: "Menu not found" });

    const userMessage: Message = {
      id: nanoid(),
      content: message,
      role: "user" as const,
      timestamp: new Date(),
    };

    await ChatLib.addMessage(menuId, userMessage);

    const messageHistory = await ChatLib.getRecentMessages(menuId);

    const response = await ANTHROPIC_CLIENT.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      system: generateSystemMessage(menuData),
      messages: messageHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    console.log("Anthropic req:", messageHistory);

    const aiResponse = (response.content[0] as any).text;

    console.log("Anthropic res:", aiResponse);

    const assistantMessage: Message = {
      id: nanoid(),
      content: aiResponse,
      role: "assistant" as const,
      timestamp: new Date(),
    };

    await ChatLib.addMessage(menuId, assistantMessage);

    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("Chat API error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
