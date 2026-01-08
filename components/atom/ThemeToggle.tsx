"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface ThemeToggleProps {
  className?: string;
  onThemeChange?: (theme: "light" | "dark") => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  onThemeChange,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  const applyTheme = (newTheme: "light" | "dark") => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme;
    setTimeout(() => {
      setTheme(initialTheme);
    }, 100);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const isDark = theme === "dark";
  const sliderTranslateX = isDark ? "40px" : "0px"; 

  if (!mounted) {
    return (
      <div
        className={cn("rounded-full", className)}
        style={{
          width: "76px",
          height: "36px",
          backgroundColor: "#212942",
        }}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center rounded-full cursor-pointer",
        className
      )}
      style={{
        width: "76px",
        height: "36px",
        padding: "4px",
        backgroundColor: "#111947",
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: "4px",
            width: "28px",
            height: "28px",
          }}
        >
          <Icon
            name="sun"
            size={22}
            style={{ color: "#F8B400"}}
          />
        </div>
      )}
      {!isDark && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            right: "4px",
            width: "28px",
            height: "28px",
          }}
        >
          <Icon
            name="moon"
            size={28}
            style={{ color: "#CED4DA" }}
          />
        </div>
      )}
      <div
        className="absolute rounded-full transition-transform duration-300 ease-in-out"
        style={{
          width: "28px",
          height: "28px",
          backgroundColor: isDark ? "#FFFFFF" : "#F8B400",
          transform: `translateX(${sliderTranslateX})`,
          left: "4px",
          top: "4px",
          zIndex: 10,
        }}
      >
        {isDark ? (
          <div className="absolute inset-0 flex items-center justify-center">
              <Icon
            name="moon"
            size={28}
            style={{ color: "#050927" }}
          />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon
            name="sun"
            size={22}
            style={{ color: "#FFFFFF"}}
          />
          
          </div>
        )}
      </div>
    </button>
  );
};
