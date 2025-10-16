import { io, Socket } from "socket.io-client";

export default function SocketServer(userId: string): Socket {
  if (!process.env.NEXT_PUBLIC_SOCKET_IO_URL) {
    throw new Error("NEXT_PUBLIC_SOCKET_IO_URL is not defined");
  }

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL, {
    transports: ["websocket"],
    reconnectionDelayMax: 10000,
    path: "/socket.io/",
    auth: { userId },
    query: {
      "userId": userId  // ถ้าใช้ auth แล้ว อาจไม่ต้องใช้ query ก็ได้
    }
  });
  socket.on("connect", () => {
    console.log("Connected to socket server with ID:", socket.id);
  });
  return socket;
}
