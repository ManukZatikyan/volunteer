"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface MarketingProfileCardProps {
  imageSrc: string;
  imageAlt?: string;
  name: string;
  description: string;
  imagePosition?: "left" | "right";
  className?: string;
}

export const MarketingProfileCard: React.FC<MarketingProfileCardProps> = ({
  imageSrc,
  imageAlt = "",
  name,
  description,
  imagePosition = "left",
  className,
}) => {
  const isImageLeft = imagePosition === "left";

  return (
    <div
      className={cn(
        "flex flex-row gap-6  w-full",
        "items-center",
        className
      )}
    >
      <div
        className={cn(
          "relative  h-[210px]! w-[146px]! aspect-[4/3] rounded-xl overflow-hidden",
          "shrink-0",
          isImageLeft ? "order-1" : "order-2"
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt || name}
          fill
          className="object-cover"
        />
      </div>

      <div
        className={cn(
          "flex flex-col justify-center w-full",
          isImageLeft ? "order-2" : "order-1"
        )}
      >
        <h3 className="text-white subtitle-sm font-semibold! mb-3 md:mb-6">
          {name}
        </h3>
        <p className="text-white body-sm-mobile">
          {description}
        </p>
      </div>
    </div>
  );
};
