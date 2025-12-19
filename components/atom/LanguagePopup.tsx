"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface LanguagePopupProps {
  className?: string;
  onLanguageChange?: (language: "en" | "hy") => void;
  defaultLanguage?: "en" | "hy";
}

export const LanguagePopup: React.FC<LanguagePopupProps> = ({
  className,
  onLanguageChange,
  defaultLanguage = "en",
}) => {
  const [hoveredLanguage, setHoveredLanguage] = useState<"en" | "hy" | null>(
    null
  );
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hy">(
    defaultLanguage
  );

  const handleLanguageClick = (language: "en" | "hy") => {
    setSelectedLanguage(language);
    onLanguageChange?.(language);
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
              hoveredLanguage === "en" || selectedLanguage === "en"
                ? "#F8A517"
                : "#1C2440",
            borderBottom:
              hoveredLanguage === "en" || selectedLanguage === "en"
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
              hoveredLanguage === "hy" || selectedLanguage === "hy"
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
