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
        "relative group w-full aspect-4/3 overflow-hidden cursor-pointer",
        "h-[72px] md:h-auto md:max-h-[192px] md:max-w-[400px] rounded-t-xl",
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
      <div className="absolute inset-0 flex items-center justify-center p-4 md:hidden ">
        <h3 className="text-primary-default dark:text-white! body-sm-mobile text-center font-semibold!">
          {title}
        </h3>
      </div>
      <div
        className="absolute inset-0 hidden md:flex items-center justify-center pt-32 pb-1 transition-[padding-top,padding-bottom] duration-500 ease-in-out group-hover:pt-0 group-hover:pb-0"
      >
        <div className="absolute inset-0 bg-text-dark-blue opacity-0 transition-opacity duration-500 group-hover:opacity-30" />
        <h3 className="relative z-10 text-white text-headline font-bold text-center w-full">
          {title}
        </h3>
      </div>
    </div>
  );
};
