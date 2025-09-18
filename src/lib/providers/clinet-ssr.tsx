"use client";

import { useEffect, useState } from "react";

interface ClientSSRProps {
  children: React.ReactNode;
}

export default function ClientSSR({ children }: ClientSSRProps) {
  const [Mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!Mounted) {
    return null;
  }

  return { children };
}
