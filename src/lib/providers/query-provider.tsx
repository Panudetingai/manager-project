'use client'
import { useEffect, useState } from "react";

type ClientSSRProps = { children: React.ReactNode };

export default function ClientSSR({ children }: ClientSSRProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <>{children}</>;
}