import type { NextApiRequest, NextApiResponse } from "next";

import { nanoid } from "nanoid";

import { ChatLib } from "@/lib/utils/chat";
import { Message } from "@/types";
import { AIService } from "@/lib/ai/service-factory";
import { Logger } from "@/lib/utils/logger";
import { redis } from "@/lib/database/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logger = new Logger("api/chat");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  logger.debug("Chat API request", { body: req.body });

  try {
    const { message, menuId } = req.body;

    if (!menuId) {
      logger.error("Menu ID required");

      return res.status(400).json({ message: "Menu ID required" });
    }

    const menuData = await redis.getJson(`menu:${menuId}:details`);

    if (!menuData) {
      logger.error("Menu not found", { menuId });

      return res.status(404).json({ message: "Menu not found" });
    }

    const userMessage: Message = {
      id: nanoid(),
      content: message,
      role: "user" as const,
      timestamp: new Date(),
    };

    logger.debug("Adding user message", { userMessage });

    await ChatLib.addMessage(menuId, userMessage);

    const messageHistory = await ChatLib.getRecentMessages(menuId);

    logger.debug("Sending chat request", { messageHistory });

    const provider = AIService.createService(
      "claude",
      process.env.ANTHROPIC_API_KEY || "",
    );

    logger.debug("Chat provider created", { provider });

    const aiResponse = await provider.chat({
      menuData,
      messages: messageHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      maxTokens: 500,
    });

    const assistantMessage: Message = {
      id: nanoid(),
      content: aiResponse.content,
      role: "assistant" as const,
      timestamp: new Date(),
    };

    await ChatLib.addMessage(menuId, assistantMessage);

    return res.status(200).json({ response: aiResponse.content });
  } catch (error) {
    logger.error("Chat API error", { error });

    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
