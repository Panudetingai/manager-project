'use client'
import { createContext, useContext, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const socket = useMemo(() => io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!, {
      path: "/socket.io/",
      auth: { userId },
      autoConnect: false,
      transports: ["websocket"]
    }), [userId]);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext) as Socket;
}
