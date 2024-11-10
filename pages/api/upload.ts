import { NextApiRequest } from "next";
import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";

import { NextApiResponseServerIO } from "@/lib/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);
    const file = files.image?.[0];

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const menuId = uuidv4();

    if (res.socket.server.io) {
      const io = res.socket.server.io;

      io.emit("upload-progress", {
        status: "processing",
        menuId,
        progress: 100,
      });
    }

    res.status(200).json({
      success: true,
      menuId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
}
