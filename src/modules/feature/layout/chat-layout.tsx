"use client";

import { AnimatePresence, motion } from "motion/react";
import AffiliateBox from "../(chat-ai)/affiliate-box";
import ChatBox from "../(chat-ai)/chat-box";
import { useChatStoreAffiliate } from "../store/ai-service/chatStore";

interface ChatlayoutProps {
  params?: {
    id: Promise<string>;
  };
}

export default function Chatlayout({ params }: ChatlayoutProps) {
  const { Show, showType } = useChatStoreAffiliate();

  const classFlex = {
    flex: Show && showType === "Posts" ? 1 : 2,
    flex1: Show && showType === "Posts" ? 1 : 1,
  };

  console.log("ShowType", Show, showType);

  return (
    <motion.div
      initial={{ opacity: 0, maxWidth: "56rem", flex: classFlex.flex }}
      animate={{ opacity: 1, maxWidth: Show ? "100%" : "56rem" }}
      className={`flex flex-col max-w-4 mx-auto w-full max-sm:w-full`}
    >
      <div className="flex w-full">
        <motion.div
          key="chat-box"
          initial={{ flex: 1 }}
          //   animate={{ flex: Show ? 1 : 2 }}
          //   transition={{ duration: 0.7 }}
          className="flex-1 duration-150 transition-all"
        >
          <ChatBox params={{ id: params?.id }} />
        </motion.div>
        {Show && showType === "Posts" && (
          <AnimatePresence>{<AffiliateBox />}</AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
