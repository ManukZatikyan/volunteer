"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ContentCardProps {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  content?: string;
  contentFontSize?: string;
  className?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  imageSrc,
  imageAlt = "",
  children,
  content,
  contentFontSize = "body-sm-mobile",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 overflow-hidden p-6",
        className
      )}
    >
      {imageSrc && (
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl h-[192px]!">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            className="object-cover h-[192px]! w-full!"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw "
          />
        </div>
      )}
      <div className="flex flex-col gap-3">
        <h2 className="text-white subtitle font-bold">
          {title}
        </h2>
        <div
          className={cn(
            "text-white flex flex-col gap-3 font-montserrat! [&_p]:mb-3 [&_ul]:list-disc [&_ul]:list-outside [&_ul]:pl-6  [&_li]:leading-relaxed [&_li]:pl-1",
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
