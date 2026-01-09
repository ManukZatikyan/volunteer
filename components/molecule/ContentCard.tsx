"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ContentCardProps {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "start" | "end";
  children?: React.ReactNode;
  content?: string;
  contentFontSize?: string;
  className?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  imageSrc,
  imageAlt = "",
  imagePosition = "start",
  children,
  content,
  contentFontSize = "body-sm-mobile",
  className,
}) => {
  const isImageStart = imagePosition === "start";

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-6 md:gap-8 xl:gap-12 overflow-hidden p-6",
        "md:items-start",
        className
      )}
    >
      {imageSrc && (
        <div
          className={cn(
            "relative w-full aspect-4/3 overflow-hidden rounded-xl h-[192px]!",
            "md:w-[400px]! md:h-[300px]! lg:w-[500px]! lg:h-[350px]!  2xl:w-[686px]! 2xl:h-[406px]! md:shrink-0",
            isImageStart ? "order-1 md:order-1" : "order-2 md:order-2"
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className="object-cover h-[192px]! w-full! md:h-full! md:w-full!"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 400px, 686px"
          />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-3 md:flex-1",
          isImageStart ? "order-2 md:order-2" : "order-1 md:order-1"
        )}
      >
        <h2 className="text-white subtitle md:text-2xl xl:text-3xl font-bold md:mb-4 xl:mb-6">
          {title}
        </h2>
        <div
          className={cn(
            "text-white flex flex-col gap-3 font-montserrat! [&_p]:mb-3 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:pl-6  [&_li]:leading-relaxed [&_li]:pl-1",
            "md:text-base xl:text-lg md:leading-6 xl:leading-7",
            contentFontSize
          )}
          {...(content
            ? { dangerouslySetInnerHTML: { __html: content } }
            : { children })}
        />
      </div>
    </div>
  );
};
