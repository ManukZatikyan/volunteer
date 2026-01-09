"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "..";
import { useMessages } from "next-intl";
import { Link } from "@/i18n/routing";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const messages = useMessages();
  const footer = messages.footer as any;

  return (
    <footer
      className={cn(
        "w-full text-white border-t border-text-white",
        "flex flex-col gap-6",
        "lg:gap-0",
        className
      )}
      style={{
        backgroundColor: "var(--footer-background, var(--background))",
      }}
    >
      <div className="flex gap-6 pt-6 px-9 lg:hidden">
        <div className="flex flex-col gap-3">
          <h3 className="font-montserrat font-semibold text-base leading-6">
            {footer?.sectionTitles?.content}
          </h3>
          <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
            {(footer?.contentLinks || []).map((link: any, index: number) => (
              <li key={index}>
                {link.href && link.href !== "#" ? (
                  <Link
                    href={link.href}
                    className="hover:text-secondary-orange-bright transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href || "#"}
                    className="hover:text-secondary-orange-bright transition-colors"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-montserrat font-semibold text-base leading-6">
            {footer?.sectionTitles?.programs}
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
              {(footer?.programLinks?.column1 || []).map((link: any, index: number) => (
                <li key={index}>
                  {link.href && link.href !== "#" ? (
                    <Link
                      href={link.href}
                      className="hover:text-secondary-orange-bright transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href || "#"}
                      className="hover:text-secondary-orange-bright transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
              {(footer?.programLinks?.column2 || []).map((link: any, index: number) => (
                <li key={index}>
                  {link.href && link.href !== "#" ? (
                    <Link
                      href={link.href}
                      className="hover:text-secondary-orange-bright transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href || "#"}
                      className="hover:text-secondary-orange-bright transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-between items-end px-9 lg:hidden">
        <div className="flex flex-col gap-3">
          <h3 className="font-montserrat font-semibold text-base leading-6">
            {footer?.sectionTitles?.getInTouch}
          </h3>
          <div className="flex flex-col gap-1.5 font-noto-sans font-normal text-base leading-6">
            <div className="flex items-center gap-3">
              <Icon name="phone" size={24} className="text-white" />
              <span>{footer?.contactInfo?.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="email" size={24} className="text-white" />
              <a
                href={footer?.contactInfo?.email?.href || `mailto:${footer?.contactInfo?.email?.text || footer?.contactInfo?.email}`}
                className="hover:text-secondary-orange-bright transition-colors"
              >
                {footer?.contactInfo?.email?.text || footer?.contactInfo?.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="location" size={24} className="text-white" />
              <span>{footer?.contactInfo?.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(footer?.socialMediaLinks || []).map((social: any) => (
            <a
              key={social.name}
              href={social.href}
              aria-label={social.ariaLabel}
            >
              <Icon
                name={social.name as any}
                size={36}
                className="text-white"
              />
            </a>
          ))}
        </div>
      </div>
      
      <div className="px-9 w-full lg:hidden">
        <div className="w-full h-px bg-text-white" />
      </div>

      <div className="flex flex-col items-center gap-4 px-[18px] lg:hidden">
        <div className="flex flex-col items-center">
        <Icon name="centerUpLogo" size={118} className="text-white" />
        </div>

        <p className="text-center font-noto-sans text-sm max-w-md leading-5">
          {footer?.description}
        </p>
      </div>

      <div className="text-center font-noto-sans text-sm pb-6 leading-5 lg:hidden">
        {footer?.copyright}
      </div>

      <div className="hidden lg:block">
        <div className="flex flex-row gap-33 py-12 px-9 xl:px-40 justify-between">
          <div className="flex flex-col gap-4 shrink-0 w-[280px] xl:w-[20vw]">
            <div className="flex flex-col gap-3">
              <Icon name="centerUpLogo" size={118} className="text-white" />
              <p className="font-noto-sans text-sm leading-5 text-white">
                {footer?.description}
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-24">
            <div className="flex flex-col gap-3">
              <h3 className="font-montserrat font-semibold text-base leading-6">
                {footer?.sectionTitles?.content}
              </h3>
              <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
                {(footer?.contentLinks || []).map((link: any, index: number) => (
                  <li key={index}>
                    {link.href && link.href !== "#" ? (
                      <Link
                        href={link.href}
                        className="hover:text-secondary-orange-bright transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href || "#"}
                        className="hover:text-secondary-orange-bright transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-montserrat font-semibold text-base leading-6">
                {footer?.sectionTitles?.programs}
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
                  {(footer?.programLinks?.column1 || []).map((link: any, index: number) => (
                    <li key={index}>
                      {link.href && link.href !== "#" ? (
                        <Link
                          href={link.href}
                          className="hover:text-secondary-orange-bright transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href || "#"}
                          className="hover:text-secondary-orange-bright transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
                  {(footer?.programLinks?.column2 || []).map((link: any, index: number) => (
                    <li key={index}>
                      {link.href && link.href !== "#" ? (
                        <Link
                          href={link.href}
                          className="hover:text-secondary-orange-bright transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href || "#"}
                          className="hover:text-secondary-orange-bright transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-[240px]">
            <h3 className="font-montserrat font-semibold text-base leading-6">
              {footer?.sectionTitles?.getInTouch}
            </h3>
            <div className="flex flex-col gap-1.5 font-noto-sans font-normal text-sm leading-6">
              <div className="flex items-center gap-3">
                <Icon name="phone" size={20} className="text-white" />
                <span>{footer?.contactInfo?.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="email" size={20} className="text-white" />
                <a
                  href={footer?.contactInfo?.email?.href || `mailto:${footer?.contactInfo?.email?.text || footer?.contactInfo?.email}`}
                  className="hover:text-secondary-orange-bright transition-colors"
                >
                  {footer?.contactInfo?.email?.text || footer?.contactInfo?.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="location" size={20} className="text-white" />
                <span>{footer?.contactInfo?.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-9 xl:px-30 w-full">
          <div className="w-full h-px bg-text-white" />
        </div>

        <div className="flex flex-row justify-between items-center px-9 xl:px-40 pt-9 pb-12">
          <div className="font-noto-sans text-sm leading-5 text-white">
            {footer?.copyright}
          </div>
          <div className="flex gap-4">
            {(footer?.socialMediaLinks || []).map((social: any) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.ariaLabel}
                className="hover:opacity-80 transition-opacity"
              >
                <Icon
                  name={social.name as any}
                  size={33}
                  className="text-white"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
