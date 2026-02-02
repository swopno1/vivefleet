"use client";

import { usePWA } from "@/hooks/usePWA";

export default function PwaProvider({ children }: { children: React.ReactNode }) {
  usePWA();
  return <>{children}</>;
}
