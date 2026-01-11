"use client";

import { usePathname } from "@/i18n/routing";
import { Footer } from "@/components";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  if (pathname === "/contactUs" || pathname === "/programs" || pathname === "/registration" || pathname?.startsWith("/registration/")) {
    return null;
  }
  
  return <Footer />;
}
