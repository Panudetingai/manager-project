import { io } from "socket.io-client";

export default function SocketClient() {
  if (!process.env.NEXT_PUBLIC_SOCKET_IO_URL) {
    throw new Error("NEXT_PUBLIC_SOCKET_IO_URL is not defined");
  }

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!, {
    withCredentials: false,
  });
  return socket;
}
