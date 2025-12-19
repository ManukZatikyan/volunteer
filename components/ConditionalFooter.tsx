"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  if (pathname === "/contactUs" || pathname === "/programs") {
    return null;
  }
  
  return <Footer />;
}
