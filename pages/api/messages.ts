import type { NextApiRequest, NextApiResponse } from "next";

import * as redis from "@/lib/redis";
import { Message } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { menuId } = req.query;

  if (!menuId) return res.status(400).json({ message: "Menu ID required" });

  const key = `menu:${menuId}:chat`;
  const messages = await redis.getJson<Message[]>(key);

  if (!messages) return res.status(404).json({ message: "Messages not found" });

  return res.status(200).json(messages || []);
}
