"use client";
import { useEffect } from "react";
import AffiliatePost from "../(post-manager)/components/affiiate-post";
import { useChatStoreAffiliate } from "../store/ai-service/chatStore";
export default function AffiliateBox() {
  const { Show, showType, setShow, setShowType } = useChatStoreAffiliate();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      setShow(false);
      setShowType("none");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Show && showType === "Posts") {
    return <AffiliatePost />;
  }
}
