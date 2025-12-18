"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";
import { LanguagePopup } from "./LanguagePopup";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface HeaderProps {
  className?: string;
}

const menuItems = ["About Us", "Our Team", "Programs", "Contact Us"];

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const languagePopupRef = useRef<HTMLDivElement>(null);
  const globeButtonRef = useRef<HTMLButtonElement>(null);

  // Close language popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languagePopupRef.current &&
        globeButtonRef.current &&
        !languagePopupRef.current.contains(event.target as Node) &&
        !globeButtonRef.current.contains(event.target as Node)
      ) {
        setIsLanguagePopupOpen(false);
      }
    };

    if (isLanguagePopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguagePopupOpen]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // You can add theme switching logic here if needed
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguagePopup = () => {
    setIsLanguagePopupOpen(!isLanguagePopupOpen);
  };

  const handleMenuItemClick = (item: string) => {
    // Handle menu item click
    console.log(`Clicked: ${item}`);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "w-full relative z-50 p-6",
        className
      )}
      style={{ backgroundColor: "#050927" }}
    >
      <div className="container mx-auto px-4">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
          <Image
            src="/svg/logoMobile.svg"
            alt="ENTER UP Logo"
            width={96}
            height={52}
            className="mb-2"
          />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative w-15 h-7 rounded-full flex items-center transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "#1C2440",
                padding: "4px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
              aria-label="Toggle theme"
            >
              {/* Inactive sun icon on left (when dark mode) */}
              {isDarkMode && (
                <div 
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-0 transition-opacity duration-300"
                  style={{ opacity: 0.5 }}
                >
                  <Icon
                    name="sun"
                    size={22}
                    color="#999999"
                    className="shrink-0"
                  />
                </div>
              )}

              {/* Inactive moon icon on right (when light mode) */}
              {!isDarkMode && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 z-0 transition-opacity duration-300"
                  style={{ 
                    left: "calc(2px + 24px + 14px)",
                    opacity: 0.5,
                  }}
                >
                  <Icon
                    name="moon"
                    size={22}
                    color="#999999"
                    className="shrink-0"
                  />
                </div>
              )}

              {/* Sliding white circular handle with active icon */}
              <div
                className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out z-10"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)",
                  // Light mode: 2px from left, Dark mode: 2px (left) + 22px (icon width) + 14px (gap) = 38px
                  transform: isDarkMode ? "translateX(38px)" : "translateX(2px)",
                }}
              >
                {!isDarkMode ? (
                  // Light mode: Orange sun with white center inside white circle
                  <div className="relative flex items-center justify-center">
                    <Icon
                      name="sun"
                      size={22}
                      color="#FFA008"
                      className="shrink-0 relative z-10 transition-transform duration-300"
                    />
                    {/* White center overlay */}
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-20 transition-opacity duration-300"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                  </div>
                ) : (
                  // Dark mode: Moon icon in dark blue inside white circle
                  <Icon
                    name="moon"
                    size={22}
                    color="#1C2440"
                    className="shrink-0 transition-transform duration-300"
                  />
                )}
              </div>
            </button>

            {/* Globe Icon with Language Popup */}
            <div className="relative">
              <button
                ref={globeButtonRef}
                onClick={toggleLanguagePopup}
                className="p-2 hover:opacity-80 transition-opacity"
                aria-label="Change language"
              >
                <Icon name="globe" size={24} color="#FFFFFF" />
              </button>
              {isLanguagePopupOpen && (
                <div
                  ref={languagePopupRef}
                  className="absolute top-full -right-8 mt-2 z-50 animate-fade-in-down"
                >
                  <LanguagePopup />
                </div>
              )}
            </div>

            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="p-2 hover:opacity-80 transition-opacity"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Icon name="linesHoriz" size={24} color="#FFFFFF" />
            </button>
          </div>
        </div>

        {/* Animated Menu Dropdown */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div
            className="py-4"
            style={{ backgroundColor: "#050927" }}
          >
            {menuItems.map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 && (
                  <div
                    className="w-full h-px my-2"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  />
                )}
                <button
                  onClick={() => handleMenuItemClick(item)}
                  className="w-full py-3 px-4 text-white font-montserrat text-center font-bold text-lg md:text-xl hover:opacity-80 transition-opacity"
                >
                  {item}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
