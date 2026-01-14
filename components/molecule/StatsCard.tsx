"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [animatedValue, setAnimatedValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Extract numeric value (remove "+" and any non-numeric characters except numbers)
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const hasPlus = value.includes("+");

  useEffect(() => {
    if (hasAnimated || numericValue === 0) return;

    // Use Intersection Observer to trigger animation when card is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateValue();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [hasAnimated, numericValue]);

  const animateValue = () => {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;
    const endValue = numericValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
      setAnimatedValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedValue(endValue);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div
      ref={cardRef}
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
        {animatedValue.toLocaleString()}{hasPlus ? "+" : ""}
      </p>
    </div>
  );
};
