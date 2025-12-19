"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function FooterThemeScript() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.remove("footer-purple", "footer-black");
    
    if (pathname?.includes("/centerUpJunior")) {
      document.body.classList.add("footer-purple");
    } else if (pathname?.includes("/futureUp")) {
      document.body.classList.add("footer-black");
    }
    
    const pageName = pathname?.split("/").filter(Boolean).pop() || "home";
    document.body.setAttribute("data-page", pageName);
  }, [pathname]);

  return null;
}

