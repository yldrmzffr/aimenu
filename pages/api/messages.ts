import type { NextApiRequest, NextApiResponse } from "next";

import { redis } from "@/lib/database/redis";
import { Message } from "@/types";
import { Logger } from "@/lib/utils/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logger = new Logger("api/messages");

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  logger.debug("Fetching chat messages", { query: req.query });

  const { menuId } = req.query;

  if (!menuId) {
    logger.error("Menu ID required");

    return res.status(400).json({ message: "Menu ID required" });
  }

  const key = `menu:${menuId}:chat`;
  const messages = await redis.getJson<Message[]>(key);

  logger.debug("Chat messages fetched", { key, messages });

  if (!messages) {
    logger.error("Failed to fetch chat messages", { key });

    return res.status(500).json({ error: "An error occurred" });
  }

  return res.status(200).json(messages || []);
}
