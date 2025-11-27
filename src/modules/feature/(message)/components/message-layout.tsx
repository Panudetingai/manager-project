import React from "react";

interface MessageLayoutProps {
  children: React.ReactNode;
}

export default function MessageLayout({ children }: MessageLayoutProps) {
  return <div>{children}</div>;
}
