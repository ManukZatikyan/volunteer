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
        "md:h-auto md:max-h-[192px] md:max-w-[400px] md:rounded-t-xl",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 md:rounded-t-md overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 program-card-gradient dark:from-primary-default/50 dark:via-primary-default/50 dark:to-primary-default"></div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-default via-primary-default to-primary-default/90 hidden md:block"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4 md:hidden">
        <h3 className="text-primary-default dark:text-white body-sm-mobile text-center font-semibold!">
          {title}
        </h3>
      </div>
      <div className="absolute bottom-0 left-0 right-0 hidden md:flex items-end justify-start pb-1 pt-20">
        <h3 className="text-white text-headline leading-headline font-bold text-center w-full">
          {title}
        </h3>
      </div>
    </div>
  );
};
