"use server";

import SocketServer from "@/lib/socket";
import { NotificationType } from "@/modules/manager/components/app-notify";
import { User } from "@supabase/supabase-js";

export async function sendInvitationNotify(user: User) {
  const io = SocketServer("1234");
  io.emit("send-invitation", {
    id: (io.id || "unknown-socket-id") + Date.now(),
    user_info: {
      id: user.id,
      avatar: user.user_metadata.avatar_url || "",
      username: user.user_metadata.full_name || "Unknown User",
    },
    title: "Workspace Invitation",
    type: "request",
    detail: `You have been invited to join a workspace. Please check your invitations.`,
    date: new Date(),
    is_read: false,
  } as NotificationType);
}
