"use client";

import { useEffect, useState } from "react";

interface ClientSSRProps {
  children: React.ReactNode;
}

export default function ClientSSR({ children }: ClientSSRProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
