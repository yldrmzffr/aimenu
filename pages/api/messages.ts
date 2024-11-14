import type { NextApiRequest, NextApiResponse } from "next";

import { redis } from "@/lib/database/redis";
import { Message } from "@/components/menu/chat-modal/types";
import { Logger } from "@/lib/utils/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logger = new Logger("api/messages");

  if (!["GET", "DELETE"].includes(req.method ?? "")) {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { menuId } = req.query;

  if (!menuId) {
    logger.error("Menu ID required");

    return res.status(400).json({ message: "Menu ID required" });
  }

  const key = `menu:${menuId}:chat`;

  if (req.method === "DELETE") {
    try {
      logger.debug("Deleting chat messages", { key });
      await redis.del(key);
      logger.debug("Chat messages deleted successfully", { key });

      return res
        .status(200)
        .json({ message: "Chat messages deleted successfully" });
    } catch (error) {
      logger.error("Failed to delete chat messages", { error });

      return res
        .status(500)
        .json({ error: "An error occurred while deleting messages" });
    }
  }

  logger.debug("Fetching chat messages", { query: req.query });
  const messages = await redis.getJson<Message[]>(key);

  logger.debug("Chat messages fetched", { key, messages });

  if (!messages) {
    logger.error("Failed to fetch chat messages", { key });

    return res.status(500).json({ error: "An error occurred" });
  }

  return res.status(200).json(messages || []);
}
