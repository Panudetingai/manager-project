import { io, Socket } from "socket.io-client";

export default function SocketServer(userId: string): Socket {
  if (!process.env.NEXT_PUBLIC_SOCKET_IO_URL) {
    throw new Error("NEXT_PUBLIC_SOCKET_IO_URL is not defined");
  }

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL, {
    path: "/socket.io/",
    auth: { userId: userId },
    protocols: ["http", "https"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("Connected to socket server with ID:", socket.id);
  });
  return socket;
}
