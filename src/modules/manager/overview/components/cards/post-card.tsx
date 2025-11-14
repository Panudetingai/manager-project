"use client";
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
import { Plus, SendHorizonal } from "lucide-react";
import { motion } from "motion/react";

const ImageStc = [
  {
    src: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
    alt: "Post Image 1",
  },
  {
    src: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Post Image 2",
  },
  {
    src: "https://images.pexels.com/photos/1181306/pexels-photo-1181306.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Post Image 3",
  },
  {
    src: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Post Image 4",
  },
  {
    src: "https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Post Image 5",
  },
];

function PostCard() {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <div
          className={`w-full grid gap-2 ${
            ImageStc.length === 1
              ? "grid-cols-1"
              : ImageStc.length === 2
              ? "grid-cols-2"
              : "grid-cols-2"
          }`}
          style={{
            gridTemplateRows: ImageStc.length > 2 ? "repeat(2, 1fr)" : "1fr",
            overflow: "hidden",
          }}
        >
          {ImageStc.slice(0, 3).map((image, index) => (
            <motion.img
              key={index}
              src={image.src}
              alt={image.alt}
              className={`object-cover w-full h-full rounded hover:opacity-75 ${
                ImageStc.length === 1 ? "" : "aspect-square"
              }`}
              style={{
                height:
                  ImageStc.length === 1
                    ? "100%"
                    : ImageStc.length === 2
                    ? "100%"
                    : "100%",
              }}
            />
          ))}
          {ImageStc.length > 4 && (
            <div className="relative bg-muted/80 flex items-center justify-center text-lg font-semibold rounded">
              <span>+{ImageStc.length - 4}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <h3 className="text-md font-semibold line-clamp-2">
            Introducing Our Latest Product: The Ultimate Productivity
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            Discover how our new product can revolutionize your workflow and
            boost your efficiency to new heights.
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.img
            className="w-6 h-6 rounded-full"
            src="https://images.seeklogo.com/logo-png/60/2/groq-icon-logo-png_seeklogo-605779.png"
            alt="Groq"
          />
          <span className="text-muted-foreground font-medium">Groq</span>
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

