"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconProps } from "../atom/Icon";

export interface StatsCardProps {
  icon: IconProps["name"];
  label: string;
  value: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-w-[114px]",
        " md:min-w-[280px] md:rounded-lg md:py-8 md:px-6 md:max-w-[540px] md:w-full",
        className
      )}
    >
      <div className="mb-1.5 md:mb-6">
        <Icon
          name={icon}
          size={48}
          color="#FFA008"
          className="shrink-0 md:w-20! md:h-20!"
        />
      </div>
      <h3 className="text-white body-sm-mobile mb-1.5 md:text-subtitle! md:leading-subtitle! md:mb-4 md:text-center">
        {label}
      </h3>
      <div className="w-full h-1 bg-[#CBCBCB] mb-1.5 md:mb-6 rounded-full md:h-1.5 md:w-full" />
      <p className="text-secondary-orange-bright subtitle-sm font-bold! md:text-title! md:leading-title! md:font-bold">
        {value}
      </p>
    </div>
  );
};
