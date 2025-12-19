"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icon } from "../atom/Icon";
import { LanguagePopup } from "../atom/LanguagePopup";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "..";

export interface HeaderProps {
  className?: string;
}

const menuItems = [
  { label: "About Us", href: "/aboutUs" },
  { label: "Our Team", href: "/ourTeam" },
  { label: "Programs", href: "/programs" },
  { label: "Contact Us", href: "/contactUs" },
];

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const languagePopupRef = useRef<HTMLDivElement>(null);
  const globeButtonRef = useRef<HTMLButtonElement>(null);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguagePopup = () => {
    setIsLanguagePopupOpen(!isLanguagePopupOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "w-full relative z-50 p-6 bg-primary-default",
        className
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2">
          <Image
            src="/svg/logoMobile.svg"
            alt="ENTER UP Logo"
            width={96}
            height={52}
            className="mb-2"
          />
          </div>
          <div className="flex items-center gap-4">
             <ThemeToggle/>
            <div className="relative h-8 w-8 flex items-center justify-center">
              <button
                ref={globeButtonRef}
                onClick={toggleLanguagePopup}
                className="hover:opacity-80 transition-opacity"
                aria-label="Change language"
              >
                <Icon name="globe" size={26} color="#FFFFFF" />
              </button>
              {isLanguagePopupOpen && (
                <div
                  ref={languagePopupRef}
                  className="absolute top-9.5 -right-9.5 mt-2 z-50 animate-fade-in-down"
                >
                  <LanguagePopup />
                </div>
              )}
            </div>
            <button
              onClick={toggleMenu}
              className="hover:opacity-80 transition-opacity"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Icon name="linesHoriz" size={36} color="#FFFFFF" />
            </button>
          </div>
        </div>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div
            className="bg-primary-default"
          >
            {menuItems.map((item, index) => (
              <React.Fragment key={item.href}>
                {index > 0 && (
                  <div
                    className="w-full h-px my-2 bg-white"
                  />
                )}
                <Link
                  href={item.href}
                  onClick={handleMenuItemClick}
                  className="w-full py-3 px-4 text-white font-montserrat text-center font-bold text-lg md:text-xl hover:opacity-80 transition-opacity block"
                >
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
