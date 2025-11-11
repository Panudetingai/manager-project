"use client";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { LoaderIcon } from "lucide-react";

export default function ChatboxLoading() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="relative size-full max-h-[70vh] h-[70vh] flex flex-col justify-center items-center gap-4">
        <div className="flex gap-2 items-center">
          <LoaderIcon className="w-6 h-6 text-muted-foreground animate-spin" />
          <Shimmer duration={3} spread={3} className="text-lg">
            Loading conversation...
          </Shimmer>
        </div>
      </div>
    </div>
  );
}
