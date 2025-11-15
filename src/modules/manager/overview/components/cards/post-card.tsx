"use client";
import { MessageResponse } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPostManagerFeatureApi } from "@/modules/feature/(post-manager)/server/api";
import {
  useChatStoreAffiliate,
  useChatStorePost,
} from "@/modules/feature/store/ai-service/chatStore";
import { AIToolsPostsOutput } from "@/modules/feature/types/ai-service/ai-service-type";
import { useWorkspaceState } from "@/modules/manager/store/workspace-state";
import { useQuery } from "@tanstack/react-query";
import { Plus, SendHorizonal } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

function PostCard({
  images,
  title,
  content,
  category,
  provider,
}: Partial<AIToolsPostsOutput>) {
  const [imageIndex, setImageIndex] = useState(0);
  const { setShow, setShowType, Show, showType } = useChatStoreAffiliate();
  const { workspaceId } = useWorkspaceState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setPostData } = useChatStorePost();

  const handleDotClick = (idx: number) => {
    if (!images) return;
    setImageIndex(idx);
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const childCount = images.length;
      const scrollTo = (scrollWidth / childCount) * idx;
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (!images) return;
    if (scrollRef.current && images?.length > 0) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const scrollWidth = scrollRef.current.scrollWidth;
      const childCount = images.length;
      const idx = Math.round((scrollLeft / scrollWidth) * childCount);
      setImageIndex(idx);
    }
  };

  const post = useQuery({
    queryKey: [
      "create-post-ai-service",
      { title, content, category, images, provider },
    ],
    queryFn: async () => {
      return await getPostManagerFeatureApi(workspaceId);
    },
    enabled: !Show && !showType,
  });

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
        Show && showType === "Posts" ? "w-3/4" : "w-full"
      }`}
      onClick={() => {
        setShow(true);
        setShowType("Posts");
        setPostData({ images, title, content, category, provider });
      }}
    >
      <CardHeader>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="snap-x flex gap-2 overflow-x-scroll scroll-none"
        >
          {images &&
            images.map((image, index) => (
              <div key={index} className="snap-center w-full">
                <motion.img
                  src={image}
                  alt={`Post Image ${index + 1}`}
                  className={`w-full min-w-[18rem] h-62 object-cover rounded-md mb-4 transition-transform duration-500 ease-in-out`}
                />
              </div>
            ))}
        </div>
        {images && images.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-2">
            {(images).map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  imageIndex === idx
                    ? "bg-primary scale-110"
                    : "bg-muted-foreground opacity-50"
                }`}
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <h3 className="text-md font-semibold line-clamp-2">
            {title
              ? title
              : "Introducing Our Latest Product: Revolutionizing Your Workflow"}
          </h3>
          <MessageResponse className="text-sm text-muted-foreground line-clamp-3">
            {content
              ? content
              : "Discover how our new product can revolutionize your workflow and boost your efficiency to new heights."}
          </MessageResponse>
        </div>
      </CardContent>
      <CardFooter className="border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.img
            className="w-6 h-6 rounded-full"
            src="https://images.seeklogo.com/logo-png/60/2/groq-icon-logo-png_seeklogo-605779.png"
            alt="Groq"
          />
          <span className="text-muted-foreground font-medium">{provider}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">12 comments</span>
          <span className="text-xs text-muted-foreground">24 likes</span>
          <Button variant="ghost" size="sm">
            Share
            <SendHorizonal size={8} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function PostCardHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function PostTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">{children}</h2>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="rounded-full cursor-pointer" size={"icon-sm"}>
            <Plus />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-primary">
          Create a new post
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function PostBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 h-screen overflow-y-auto scroll-smooth scroll-custom">
      {children}
    </div>
  );
}

function PostContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

export { PostBody, PostCard, PostCardHeader, PostContent, PostTitle };

