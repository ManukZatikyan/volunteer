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
        "relative flex flex-col rounded-3xl p-3 w-full h-full min-w-[188px] max-w-[250px] max-h-[164px] sm:min-w-[250px] sm:max-w-[400px] sm:max-h-[336px] sm:p-6",
        "shadow-lg",
        "bg-primary-light",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="relative w-full h-[138px] sm:h-[336px] rounded-xl">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <div
          className="absolute inset-0 membership-card-gradient"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-end w-full">
          <h3 className="text-white w-full text-start mb-1.5 text-xl! font-bold! leading-6.5! font-montserrat! px-3 xl:text-subtitle! xl:leading-subtitle!">
            {title}
          </h3>
          <div className="w-full h-[4px] rounded-full bg-secondary-orange-bright" />
        </div>
      </div>
    </div>
  );
};
