"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n/request";

export function FooterThemeScript() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.remove("footer-purple", "footer-black");
    
    // Remove locale prefix from pathname for checking
    let pathWithoutLocale = pathname || "";
    for (const locale of locales) {
      if (pathWithoutLocale.startsWith(`/${locale}`)) {
        pathWithoutLocale = pathWithoutLocale.replace(`/${locale}`, "") || "/";
        break;
      }
    }
    
    if (pathWithoutLocale.includes("/centerUpJunior")) {
      document.body.classList.add("footer-purple");
    } else if (pathWithoutLocale.includes("/futureUp")) {
      document.body.classList.add("footer-black");
    }
    
    // Get page name from pathname (with locale prefix for data attribute)
    const pageName = pathname?.split("/").filter(Boolean).slice(1).pop() || "home";
    document.body.setAttribute("data-page", pageName);
  }, [pathname]);

  return null;
}

