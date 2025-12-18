"use client";

import React, { useState } from "react";
import { ProfileCardHorizontal } from "./ProfileCardHorizontal";
import { ProfileCard } from "./ProfileCard";
import { cn } from "@/lib/utils";

export interface AnimatedProfileCardProps {
  imageSrc: string;
  imageAlt?: string;
  name: string;
  biography: string;
  expandedBiography?: string;
  buttonText?: string;
  expandedButtonText?: string;
  className?: string;
  onExpand?: () => void;
  handleCollapse?: () => void;
}

export const AnimatedProfileCard: React.FC<AnimatedProfileCardProps> = ({
  imageSrc,
  imageAlt = "",
  name,
  biography,
  expandedBiography,
  buttonText = "Read more",
  expandedButtonText = "Discover more",
  className,
  onExpand,
  handleCollapse: handleCollapseProp,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(true);
    onExpand?.();
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    handleCollapseProp?.();
  };

  // Use expanded biography if provided, otherwise use regular biography
  const displayBiography = isExpanded && expandedBiography 
    ? expandedBiography 
    : biography;

  return (
    <div
      className={cn(
        "relative w-full",
        className
      )}
    >
      <div
        className={cn(
          "transition-all duration-700 ease-in-out",
          isExpanded 
            ? "opacity-0 scale-95 absolute inset-0 pointer-events-none z-0" 
            : "opacity-100 scale-100 relative z-10"
        )}
      >
        <ProfileCardHorizontal
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          name={name}
          biography={biography}
          buttonText={buttonText}
          onClick={handleExpand}
        />
      </div>
      
      <div
        className={cn(
          "transition-all duration-700 ease-in-out",
          isExpanded 
            ? "opacity-100 scale-100 relative z-10" 
            : "opacity-0 scale-95 absolute inset-0 pointer-events-none z-0"
        )}
      >
        <ProfileCard
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          name={name}
          biography={displayBiography}
          buttonText={expandedButtonText}
          onClick={handleCollapse}
        />
      </div>
    </div>
  );
};
