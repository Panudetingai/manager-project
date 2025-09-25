"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUserClient } from "@/lib/supabase/getUser-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "../../../utils/supabase/client";
import { useWorkspaceState } from "../manager/store/workspace-state";
import { inviteMember, InviteMemberparams } from "./server/action/invite";

type Props = {
  isopen: boolean;
  setisopen: (isopen: boolean) => void;
};

export default function ModalInvite({ isopen, setisopen }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();
  const { workspaceId } = useWorkspaceState();
  const { data: user } = useUserClient();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["searchmember", searchTerm],
    queryFn: async () => {
      const { data } = await supabase
        .from("account")
        .select("id, email, username, avatar_url")
        .ilike("email", `%${searchTerm}%`)
        .or(`username.ilike.%${searchTerm}%`)
        .not("id", "eq", user?.id || "")
        .limit(5);

      return data;
    },
    staleTime: 2000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      workspace_owner_id,
      user_owner_id,
    }: InviteMemberparams) => {
      return await inviteMember({ workspace_owner_id, user_owner_id });
    },
  });

  const handleInvite = (id: string) => {
    if (!workspaceId) return;
    mutate(
      {
        workspace_owner_id: workspaceId,
        user_owner_id: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getmembers"] });
          toast.success("Member invited successfully");
          setisopen(false);
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to invite member");
        },
      }
    );
  };

  return (
    <Dialog open={isopen} onOpenChange={() => setisopen(!isopen)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite new member to your workspace
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="search for a member..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex flex-col gap-2 h-52">
          {/* List member search result */}
          {users && users.length > 0 ? (
            <>
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 w-full p-2 rounded-md">
                    <Avatar>
                      <AvatarImage
                        src={user.avatar_url || ""}
                        alt={user.username || "user"}
                      />
                      <AvatarFallback>user</AvatarFallback>
                    </Avatar>
                    <div className="text-muted-foreground text-sm">
                      {user.username}
                    </div>
                  </div>
                  <Button
                    className="rounded-sm cursor-pointer"
                    disabled={isPending}
                    size={"sm"}
                    onClick={() => handleInvite(user.id)}
                  >
                    {isPending ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Inviting...
                      </>
                    ) : (
                      <>
                        <UserPlusIcon />
                        Invite
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No users found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
