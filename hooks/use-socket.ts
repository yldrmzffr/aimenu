import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");

      const socket = io({
        path: "/api/socket",
      });

      socket.on("connect", () => {
        console.log("Connected to socket");
      });

      socket.on("connect_error", (err) => {
        console.log("Socket connection error:", err);
      });

      socketRef.current = socket;
    };

    socketInitializer();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
}
