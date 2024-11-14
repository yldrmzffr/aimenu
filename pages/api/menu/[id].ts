import type { NextApiRequest, NextApiResponse } from "next";

import { Logger } from "@/lib/utils/logger";
import { redis } from "@/lib/database/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logger = new Logger("menu/[id]");

  const { id } = req.query;

  logger.debug("Fetching menu details", { id });

  try {
    const key = `menu:${id}:details`;

    logger.debug("Fetching menu items from Redis", { key });

    const menuItems = await redis.getJson(key);

    logger.debug("Menu items fetched", { key, menuItems });

    res.status(200).json(menuItems || []);
  } catch (error) {
    logger.error("Failed to fetch menu items", { error });
    res.status(500).json({ error: "An error occurred" });
  }
}
