import type { NextApiRequest, NextApiResponse } from "next";

import * as redis from "@/lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  try {
    const key = `menu:${id}:details`;
    const menuItems = await redis.getJson(key);

    res.status(200).json(menuItems || []);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}
