import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface UseSocketReturn {
  socket: Socket | undefined;
  isConnected: boolean;
}

export function useSocket(): UseSocketReturn {
  const socketRef = useRef<Socket>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInitializer = async () => {
      try {
        await fetch("/api/socket");

        const socket = io({
          path: "/api/socket",
          transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
          console.log("Socket connected");
          setIsConnected(true);
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
          setIsConnected(false);
        });

        socket.on("connect_error", (err) => {
          console.log("Socket connection error:", err);
          setIsConnected(false);
        });

        socketRef.current = socket;
      } catch (error) {
        console.error("Socket initialization error:", error);
        setIsConnected(false);
      }
    };

    socketInitializer();

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
