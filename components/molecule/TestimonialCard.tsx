"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps {
  imageSrc: string;
  imageAlt?: string;
  name: string;
  role: string;
  quote: string;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  imageSrc,
  imageAlt = "",
  name,
  role,
  quote,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl shadow-lg p-6 md:p-8 flex  md:flex-row gap-6 md:gap-8",
        className
      )}
    >
      <div className="flex flex-col items-center md:items-start shrink-0 md:w-1/3">
        <div className="relative w-22 h-22 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 shrink-0">
          <Image
            src={imageSrc}
            alt={imageAlt || name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 86px, 160px"
          />
        </div>
        <p className="text-black body-sm-mobile md:text-base font-noto-sans text-center md:text-left w-22 h-22 md:w-40 md:h-40">
          {role}
        </p>
      </div>
      <div className="flex flex-col flex-1 md:w-2/3">
        <h3 className="text-black subtitle md:text-2xl font-bold font-montserrat mb-3 md:mb-4">
          {name}
        </h3>
        <p className="text-black body-sm-mobile md:text-base leading-relaxed font-noto-sans">
          &quot;{quote}&quot;
        </p>
      </div>
    </div>
  );
};
