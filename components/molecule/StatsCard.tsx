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
        "aspect-square",
        className
      )}
    >
      <div className="mb-1.5">
        <Icon
          name={icon}
          size={48}
          color="#FFA008"
          className="shrink-0"
        />
      </div>
      <h3 className="text-white body-sm-mobile mb-1.5">
        {label}
      </h3>
      <div className="w-full h-1 bg-[#CBCBCB] mb-1.5 rounded-full" />
      <p className="text-secondary-orange-bright subtitle-sm font-bold!">
        {value}
      </p>
    </div>
  );
};
