"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "..";

export interface SocialLink {
  name: "instagram" | "linkedin" | "facebook" | "telegram";
  href: string;
  ariaLabel: string;
}

export interface MarketingProfileCardProps {
  imageSrc: string;
  imageAlt?: string;
  name: string;
  description: string;
  imagePosition?: "left" | "right";
  socialLinks?: SocialLink[];
  className?: string;
}

export const MarketingProfileCard: React.FC<MarketingProfileCardProps> = ({
  imageSrc,
  imageAlt = "",
  name,
  description,
  imagePosition = "left",
  socialLinks = [],
  className,
}) => {
  const isImageLeft = imagePosition === "left";

  return (
    <div
      className={cn(
        "flex flex-row gap-6  w-full",
        "items-center md:items-start",
        className
      )}
    >
      <div
        className={cn(
          "relative h-[210px]! w-[146px]! md:h-[350px]! md:w-[260px]! xl:h-[426px]! xl:w-[306px]!",
          "overflow-hidden shrink-0 rounded-xl",
          isImageLeft ? "order-1" : "order-2"
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt || name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 146px, (max-width: 1280px) 300px, 306px"
        />
      </div>

      <div
        className={cn(
          "flex flex-col justify-center w-full",
          isImageLeft ? "order-2" : "order-1"
        )}
      >
        <h3 className="text-white subtitle-sm md:text-3xl xl:text-headline! xl:leading-headline! font-bold! mb-3 md:mb-4 xl:mb-6">
          {name}
        </h3>
        <div className="hidden md:block w-full h-1 bg-secondary-orange-bright mb-6 rounded-full" />
        <p className="text-white body-sm-mobile md:text-base xl:text-body! xl:leading-body! mb-3 md:mb-6">
          {description}
        </p>
        {socialLinks.length > 0 && (
          <div className="flex gap-4 md:gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.ariaLabel}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Icon
                  name={social.name}
                  size={33}
                  className="text-white md:w-11! md:h-11!"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
