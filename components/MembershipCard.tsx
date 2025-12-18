"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface MembershipCardProps {
  imageSrc: string;
  imageAlt?: string;
  title?: string;
  className?: string;
  onClick?: () => void;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  imageSrc,
  imageAlt = "",
  title = "Membership",
  className,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl p-4 w-full max-w-[188px] max-h-[164px]",
        "shadow-lg",
        "bg-primary-light",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="relative w-full h-[138px] rounded-xl">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(17, 25, 71, 0.3) 0%, rgba(17, 25, 71, 0.5) 50%, rgba(17, 25, 71, 0.8) 80%, #111947 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end">
          <h3 className="text-white text-center mb-1.5 text-xl! font-bold! leading-6.5! font-montserrat!">
            {title}
          </h3>
          <div className="w-[93%] max-w-[152px] h-[4px] rounded-full bg-secondary-orange-bright" />
        </div>
      </div>
    </div>
  );
};
