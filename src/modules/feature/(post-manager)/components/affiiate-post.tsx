"use client";

import { MessageResponse } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { useWorkspaceState } from "@/modules/manager/store/workspace-state";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { motion } from "motion/react";
import {
    useChatStoreAffiliate,
    useChatStorePost,
} from "../../store/ai-service/chatStore";
import { createPostManagerFeatureApi } from "../server/api";
export default function AffiliatePost() {
  const { setShow, Show, showType } = useChatStoreAffiliate();
  const posts = useChatStorePost();
  const { workspaceId } = useWorkspaceState();

  const mutate = useMutation({
    mutationFn: async () => {
      await createPostManagerFeatureApi({
        ...posts,
        workspaceId,
      });
    },
  });

  const classFlex = {
    flex: Show && showType === "Posts" ? 1 : 2,
    flex1: Show && showType === "Posts" ? 1 : 1,
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0, minWidth: 0, flex: classFlex.flex1 }}
      animate={{
        width: "100%",
        // minWidth: 320,
        opacity: 1,
      }}
      transition={{ duration: 0.7 }}
      className="ml-4 border border-border rounded-lg p-4 relative"
    >
      <Button
        variant={"ghost"}
        className="close-affiliate absolute top-2 right-2 rounded-full p-2 hover:bg-accent/50"
        onClick={() => setShow(false)}
      >
        <X />
      </Button>
      <div className="header">
        <h2 className="text-lg font-medium mb-4 line-clamp-1 w-2/4">
          {posts.title}
        </h2>
      </div>
      <div className="images">
        <div className="grid grid-cols-3 gap-1 w-full">
          {posts.images &&
            posts.images.map((image, idx) => (
              <motion.img
                key={idx}
                src={image}
                className="object-cover w-full h-42 rounded"
                alt={`Post Image ${idx + 1}`}
              />
            ))}
        </div>
      </div>
      <div className="h-[52vh] overflow-hidden overflow-y-scroll mt-4">
        <MessageResponse>{posts.content}</MessageResponse>
      </div>
      <div className="footer mt-4">
        <Button className="w-full" onClick={() => mutate.mutate()}>Create Post</Button>
      </div>
    </motion.div>
  );
}
