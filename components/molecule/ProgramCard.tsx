"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ProgramCardProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  className?: string;
  onClick?: () => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  imageSrc,
  imageAlt = "",
  title,
  className,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "relative w-full aspect-4/3 rounded-t-xl overflow-hidden",
        "cursor-pointer transition-transform hover:scale-105 h-[72px]",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-default/50 via-primary-default/50 to-primary-default"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <h3 className="text-white body-sm-mobile text-center">
          {title}
        </h3>
      </div>
    </div>
  );
};
