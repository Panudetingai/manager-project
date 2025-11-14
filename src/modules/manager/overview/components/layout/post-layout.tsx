import React from "react";

interface PostLayoutProps {
  children: React.ReactNode;
}

export default function PostLayout({ children }: PostLayoutProps) {
  return (
    <div className="flex flex-col gap-2 p-4 w-full shadow border rounded-md">
      {children}
    </div>
  );
}
