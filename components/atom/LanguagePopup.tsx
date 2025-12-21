"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n/request";
import { cn } from "@/lib/utils";

export interface LanguagePopupProps {
  className?: string;
  onLanguageChange?: () => void;
}

export const LanguagePopup: React.FC<LanguagePopupProps> = ({
  className,
  onLanguageChange,
}) => {
  const locale = useLocale() as "en" | "hy";
  const router = useRouter();
  const fullPathname = usePathname(); // Full pathname from Next.js (includes locale)
  const [hoveredLanguage, setHoveredLanguage] = useState<"en" | "hy" | null>(
    null
  );

  const handleLanguageClick = (newLocale: "en" | "hy") => {
    if (newLocale === locale) {
      // If clicking the same language, just close the popup
      onLanguageChange?.();
      return;
    }
    
    // Strip locale prefix from the full pathname
    let cleanPathname = fullPathname || "/";
    for (const loc of locales) {
      if (cleanPathname.startsWith(`/${loc}`)) {
        cleanPathname = cleanPathname.replace(`/${loc}`, "") || "/";
        break;
      }
    }
    
    // Use next-intl's router to navigate with clean pathname and new locale
    router.push(cleanPathname, { locale: newLocale });
    // Close the popup after navigation
    onLanguageChange?.();
  };

  const topSectionColor = "#1C2440";

  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute -top-4.5 left-1/2 -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: "18px solid transparent",
          borderRight: "18px solid transparent",
          borderBottom: `18px solid ${topSectionColor}`,
        }}
      />
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: "#1C2440" }}
      >
        <button
          className={cn(
            "w-full px-6 py-3 text-white text-center font-noto-sans text-sm leading-5",
            "transition-colors duration-200"
          )}
          style={{
            backgroundColor:
              hoveredLanguage === "en" || locale === "en"
                ? "#F8A517"
                : "#1C2440",
            borderBottom:
              hoveredLanguage === "en" || locale === "en"
                ? "1px solid rgba(28, 36, 64, 0.3)"
                : "1px solid rgba(255, 255, 255, 0.1)",
          }}
          onMouseEnter={() => setHoveredLanguage("en")}
          onMouseLeave={() => setHoveredLanguage(null)}
          onClick={() => handleLanguageClick("en")}
        >
          English
        </button>
        <button
          className={cn(
            "w-full px-6 py-3 text-white text-center font-noto-sans text-sm leading-5",
            "transition-colors duration-200"
          )}
          style={{
            backgroundColor:
              hoveredLanguage === "hy" || locale === "hy"
                ? "#F8A517"
                : "#1C2440",
          }}
          onMouseEnter={() => setHoveredLanguage("hy")}
          onMouseLeave={() => setHoveredLanguage(null)}
          onClick={() => handleLanguageClick("hy")}
        >
          Հայերեն
        </button>
      </div>
    </div>
  );
};
