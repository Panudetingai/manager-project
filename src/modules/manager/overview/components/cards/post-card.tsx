"use client";
import { MessageResponse } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPostManagerFeatureApi } from "@/modules/feature/(post-manager)/server/api";
import { useWorkspaceState } from "@/modules/manager/store/workspace-state";
import { useQuery } from "@tanstack/react-query";
import { Plus, SendHorizonal } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

function PostCard() {
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { workspaceId } = useWorkspaceState();

  const posts = useQuery({
    queryKey: [],
    queryFn: async () => {
      return await getPostManagerFeatureApi(workspaceId);
    },
  });

 const handleDotClick = (postId: string, idx: number, images: string[]) => {
  setImageIndexes((prev) => ({ ...prev, [postId]: idx }));
  if (scrollRefs.current[postId]) {
    const scrollWidth = scrollRefs.current[postId].scrollWidth;
    const childCount = images.length;
    const scrollTo = (scrollWidth / childCount) * idx;
    scrollRefs.current[postId].scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  }
};


  const handleScroll = (postId: string, images: string[]) => {
    if (!images) return;
    if (scrollRefs.current[postId] && images?.length > 0) {
      const scrollLeft = scrollRefs.current[postId].scrollLeft;
      const scrollWidth = scrollRefs.current[postId].scrollWidth;
      const childCount = images.length;
      const idx = Math.round((scrollLeft / scrollWidth) * childCount);
      setImageIndexes((prev) => ({ ...prev, [postId]: idx }));
    }
  };

  if (posts.isPending) return <PostCardLoading />;
  if (!posts.data && !posts.isPending) return <PostCardEmpty />;

  console.log("post data Array", posts.data)
  return (
    <>
      {posts.data.map((post) => (
        <Card
          key={post.id}
          className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full`}
        >
          <CardHeader>
            <div
              ref={el => { scrollRefs.current[post.id] = el; }}
              onScroll={() =>
                Array.isArray(post.images) && handleScroll(post.id, post.images)
              }
              className="snap-x flex gap-2 overflow-x-scroll scroll-none"
            >
              {post.images &&
                Array.isArray(post.images) &&
                post.images.map((img, idx) => (
                  <div key={idx} className="snap-center w-full">
                    <motion.img
                      src={img}
                      alt={`Post Image ${idx + 1}`}
                      className={`w-full min-w-[18rem] h-62 object-cover rounded-md mb-4 transition-transform duration-500 ease-in-out`}
                    />
                  </div>
                ))}
            </div>
            {post.images && post.images.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-2">
                {Array.isArray(post.images) &&
                  post.images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        (imageIndexes[post.id] ?? 0) === idx
                          ? "bg-primary scale-110"
                          : "bg-muted-foreground opacity-50"
                      }`}
                      onClick={() =>
                        Array.isArray(post.images) &&
                        handleDotClick(post.id, idx, post.images)
                      }
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <h3 className="text-md font-semibold line-clamp-2">
                {post.title
                  ? post.title
                  : "Introducing Our Latest Product: Revolutionizing Your Workflow"}
              </h3>
              <MessageResponse className="text-sm text-muted-foreground line-clamp-3">
                {post.content
                  ? post.content
                  : "Discover how our new product can revolutionize your workflow and boost your efficiency to new heights."}
              </MessageResponse>
            </div>
          </CardContent>
          <CardFooter className="border-t flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">12 comments</span>
              <span className="text-xs text-muted-foreground">24 likes</span>
            </div>
              <Button variant="ghost" size="sm">
                Share
                <SendHorizonal size={8} />
              </Button>
          </CardFooter>
        </Card>
      ))}
    </>
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

function PostCardEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4">
      <h3 className="text-xl font-semibold">No Posts Available</h3>
      <p className="text-muted-foreground">
        There are currently no posts to display. Please check back later or
        create a new post.
      </p>
    </div>
  );
}

function PostCardLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4">
      {Array.from({length: 3}).map((_, idx) => (
        <Skeleton key={idx} className="w-full h-52 rounded-md" />
      ))}
    </div>
  )
}

export { PostBody, PostCard, PostCardEmpty, PostCardHeader, PostContent, PostTitle };

