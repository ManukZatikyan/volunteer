"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../atom/Button";
import { useTranslations } from "next-intl";

export interface ProfileCardHorizontalProps {
  imageSrc: string;
  imageAlt?: string;
  name: string;
  biography: string;
  buttonText?: string;
  className?: string;
  onClick?: () => void;
}

export const ProfileCardHorizontal: React.FC<ProfileCardHorizontalProps> = ({
  imageSrc,
  imageAlt = "",
  name,
  biography,
  buttonText,
  className,
  onClick,
}) => {
  const t = useTranslations("common.buttons");
  const defaultButtonText = buttonText || t("readMore");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && contentRef.current && !isExpanded) {
        // Get the computed styles to check the actual max-height
        const computedStyle = window.getComputedStyle(contentRef.current);
        const maxHeight = computedStyle.maxHeight;
        
        // Temporarily remove max-height constraint to measure full text height
        const originalMaxHeight = contentRef.current.style.maxHeight;
        contentRef.current.style.maxHeight = 'none';
        
        // Force a reflow to get accurate measurements
        void contentRef.current.offsetHeight;
        
        // Get the actual scroll height of the text without constraints
        const textScrollHeight = textRef.current.scrollHeight;
        
        // Restore the max-height
        contentRef.current.style.maxHeight = originalMaxHeight;
        
        // Get the client height of the container with max-h-[180px] constraint
        const containerClientHeight = contentRef.current.clientHeight;
        
        // Check if text overflows the container
        // Use a threshold of 3px to account for rounding and line-height differences
        const hasOverflow = textScrollHeight > containerClientHeight + 3;
        setShowReadMore(hasOverflow);
      } else {
        setShowReadMore(false);
      }
    };

    // Use requestAnimationFrame and setTimeout to ensure DOM is fully rendered with styles
    let timeoutId: NodeJS.Timeout;
    const rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(checkOverflow, 200);
    });

    // Also check after a longer delay to catch any late layout changes
    const longTimeoutId = setTimeout(checkOverflow, 500);

    window.addEventListener("resize", checkOverflow);
    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      if (longTimeoutId) clearTimeout(longTimeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [biography, isExpanded]);

  const handleReadMore = () => {
    setIsExpanded(true);
  };

  return (
    <div
      className={cn(
        "relative flex flex-row gap-3 rounded-3xl w-full max-w-[400px] md:max-w-none p-4 md:p-0",
        "shadow-lg md:shadow-none",
        "bg-primary-light md:bg-transparent",
        "md:rounded-none md:gap-6",
        "max-h-[420px]",
        className
      )}
    >
      <div className="relative w-1/2 min-w-[180px] md:w-auto md:min-w-[250px] xl:min-w-[300px] h-[243px] md:h-[350px] xl:h-[420px] rounded-xl md:bg-gray-200 md:dark:bg-gray-700 overflow-hidden flex-shrink-0">
        <Image
          src={imageSrc}
          alt={imageAlt || name}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 250px, 300px"
          priority
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0 h-full max-h-[420px] overflow-hidden">
        <h3 className="text-white text-2xl md:text-3xl xl:text-4xl font-bold leading-7.5 font-montserrat mb-3 flex-shrink-0">
          {name}
        </h3>
        <div className="w-full h-1 bg-secondary-orange-bright mb-3 rounded-full flex-shrink-0" />
        <div
          ref={contentRef}
          className={cn(
            "flex-1 min-h-0 overflow-hidden",
            !isExpanded && "max-h-[180px]"
          )}
        >
          <p
            ref={textRef}
            className={cn(
              "text-white text-sm md:text-base xl:text-lg leading-5 md:leading-6 xl:leading-7 font-noto-sans",
              isExpanded && "overflow-y-auto h-full pr-2"
            )}
          >
            {biography}
          </p>
        </div>
        {(showReadMore && !isExpanded) && (
          <div className="flex justify-start mt-auto flex-shrink-0">
            <Button
              variant="white"
              onClick={handleReadMore}
              className="px-6 py-2 cursor-pointer"
            >
              {defaultButtonText}
            </Button>
          </div>
        )}
        {!showReadMore && onClick && (
          <div className="flex justify-start mt-auto flex-shrink-0">
            <Button variant="white" onClick={onClick} className="px-6 py-2">
              {defaultButtonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
