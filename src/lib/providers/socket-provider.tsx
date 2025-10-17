'use client'
import { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const socket = useMemo(() => {
    if (!userId || !process.env.NEXT_PUBLIC_SOCKET_IO_URL) {
      return null;
    }
    return io(process.env.NEXT_PUBLIC_SOCKET_IO_URL, {
      path: "/socket.io/",
      auth: { userId },
      autoConnect: true,
    });
  }, [userId]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext) as Socket;
}
