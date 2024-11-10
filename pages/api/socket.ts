import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";

import { NextApiResponseServerIO } from "@/lib/socket";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (res.socket.server.io) {
    console.log("Socket server already running");
    res.end();

    return;
  }

  const io = new ServerIO(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  res.socket.server.io = io;
  console.log("Socket server initialized");
  res.end();
}
