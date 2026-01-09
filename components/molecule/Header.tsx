"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Icon } from "../atom/Icon";
import { LanguagePopup } from "../atom/LanguagePopup";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "..";

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const languagePopupRef = useRef<HTMLDivElement>(null);
  const globeButtonRef = useRef<HTMLButtonElement>(null);

  const menuItems = [
    { label: t("aboutUs"), href: "/aboutUs" },
    { label: t("ourTeam"), href: "/ourTeam" },
    { label: t("programs"), href: "/programs" },
    { label: t("contactUs"), href: "/contactUs" },
  ];

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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguagePopup = () => {
    setIsLanguagePopupOpen(!isLanguagePopupOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const isActive = (href: string) => {
    const cleanPathname = pathname?.replace(`/${locale}`, "") || "/";
    return cleanPathname === href || cleanPathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "w-full relative z-50 p-6 bg-primary-default",
        className
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20 xl:px-[92px] xl:py-[12px] lg:px-[10px] lg:py-[10px]">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/svg/logoMobile.svg"
                alt="ENTER UP Logo"
                width={96}
                height={52}
                className="mb-2 lg:w-[118px] lg:h-[64px]"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
            <ul className="flex items-center gap-8 xl:gap-12">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-white! subtitle tracking-wide transition-opacity hover:opacity-80",
                      isActive(item.href) && "opacity-100",
                      !isActive(item.href) && "opacity-90"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="relative h-8 w-8 pl-px flex items-center justify-center">
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
                  className="absolute top-9.5 -right-9.5 mt-3 z-50 animate-fade-in-down"
                >
                  <LanguagePopup onLanguageChange={() => setIsLanguagePopupOpen(false)} />
                </div>
              )}
            </div>
            <button
              onClick={toggleMenu}
              className="lg:hidden hover:opacity-80 transition-opacity"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Icon name="linesHoriz" size={36} color="#FFFFFF" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "lg:hidden fixed left-0 right-0 top-[88px] md:top-[104px] overflow-hidden transition-all duration-300 ease-in-out z-100",
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div
            className="bg-white dark:bg-primary-default shadow-lg"
          >
            {menuItems.map((item, index) => (
              <div key={item.href} className="w-full flex flex-col items-center">
                {index > 0 && (
                  <div
                    className="w-[calc(100%-48px)] h-px bg-primary-default dark:bg-white"
                  />
                )}
                <Link
                  href={item.href}
                  onClick={handleMenuItemClick}
                  className="w-full py-5 px-4 text-primary-default dark:text-white font-montserrat text-center font-bold text-lg md:text-xl hover:opacity-80 transition-opacity block"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
