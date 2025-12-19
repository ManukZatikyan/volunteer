"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "..";
import {
  contentLinks,
  programLinks,
  contactInfo,
  socialMediaLinks,
  logo,
  description,
  copyright,
  sectionTitles,
} from "@/data/footer";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "w-full text-white border-t border-white bg-primary-default",
        "flex flex-col gap-6",
        className
      )}
    >
      <div className="flex gap-6 pt-6 px-9">
        <div className="flex flex-col gap-3">
          <h3 className="font-montserrat font-semibold text-base leading-6">
            {sectionTitles.content}
          </h3>
          <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
            {contentLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="hover:text-secondary-orange-bright transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-montserrat font-semibold text-base leading-6">
            {sectionTitles.programs}
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
              {programLinks.column1.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-secondary-orange-bright transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
              {programLinks.column2.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-secondary-orange-bright transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-between items-end px-9">
        <div className="flex flex-col gap-3">
          <h3 className="font-montserrat font-semibold text-base leading-6">
            {sectionTitles.getInTouch}
          </h3>
          <div className="flex flex-col gap-3 font-noto-sans font-normal text-base leading-6">
            <div className="flex items-center gap-3">
              <Icon name="phone" size={24} className="text-white" />
              <span>{contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="email" size={24} className="text-white" />
              <a
                href={contactInfo.email.href}
                className="hover:text-secondary-orange-bright transition-colors"
              >
                {contactInfo.email.text}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="location" size={24} className="text-white" />
              <span>{contactInfo.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {socialMediaLinks.map((social) => (
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
      <div className="px-9 w-full">
        <div className="w-full h-px bg-white" />
      </div>

      <div className="flex flex-col items-center gap-4 px-[18px]">
        <div className="flex flex-col items-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="mb-2"
          />
        </div>

        <p className="text-center font-noto-sans text-sm max-w-md leading-5">
          {description}
        </p>
      </div>

      <div className="text-center font-noto-sans text-sm pb-6 leading-5">
        {copyright}
      </div>
    </footer>
  );
};
