"use client";
import AffiliatePost from "../(post-manager)/components/affiiate-post";
import { useChatStoreAffiliate } from "../store/ai-service/chatStore";
export default function AffiliateBox() {
  const {showType } = useChatStoreAffiliate();

  return <AffiliatePost />;
  // if (showType === "Posts") {
  // }
}
