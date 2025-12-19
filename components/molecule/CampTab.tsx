"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface CampTabItem {
  id: string;
  label: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface CampTabProps {
  items: CampTabItem[];
  defaultActiveId?: string;
  onTabChange?: (id: string) => void;
  className?: string;
}

export const CampTab: React.FC<CampTabProps> = ({
  items,
  defaultActiveId,
  onTabChange,
  className,
}) => {
  const [activeId, setActiveId] = useState<string>(
    defaultActiveId || items[0]?.id || ""
  );

  const handleTabClick = (id: string) => {
    setActiveId(id);
    onTabChange?.(id);
  };

  return (
    <div
      className={cn(
        "w-full overflow-x-auto",
        "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent",
        className
      )}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#9CA3AF transparent",
      }}
    >
      <div
        className="flex gap-4 px-4 md:px-6"
        style={{ minWidth: "max-content" }}
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "relative flex flex-col t overflow-hidden p-3 rounded-3xl pb-10!",
                "min-w-[188px] md:min-w-[320px]",
                "transition-all duration-200",
                isActive ? "bg-primary-light" : "bg-transparent"
              )}
              aria-label={`Select ${item.label}`}
            >
              <div className="relative w-full h-[112px] rounded-xl">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt || item.label}
                  fill
                  className="object-cover rounded-xl"
                />

                <div className={cn("absolute bottom-0 left-0 right-0 h-[112px] bg-gradient-to-t to-transparent rounded-xl",
                      isActive ? "from-primary-light/90 via-primary-light/80" : "from-primary-default/90 via-primary-light/80t"
                )} />
              </div>
              <div className="absolute bottom-3 left-3 right-0 px-4 py-3 md:px-6 md:py-4">
                <div className="relative">
                  <div className="text-white text-button! leading-button! font-montserrat! font-semibold! text-left relative inline-block">
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FFA62B] rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
