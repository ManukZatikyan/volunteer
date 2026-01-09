"use client";

import React from "react";
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
  return (
    <div
      className={cn(
        "relative flex flex-row gap-3 rounded-3xl w-full max-w-[400px] md:max-w-none p-4 md:p-0",
        "shadow-lg md:shadow-none overflow-hidden",
        "bg-primary-light md:bg-transparent",
        "md:rounded-none md:gap-6",
        className
      )}
    >
      <div className="relative w-1/2 min-w-[180px] md:w-auto md:min-w-[250px] xl:min-w-[300px] h-full min-h-[243px] md:h-[350px] xl:h-[420px] rounded-xl md:bg-gray-200 md:dark:bg-gray-700 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt || name}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 250px, 300px"
          priority
        />
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-white text-2xl md:text-3xl xl:text-4xl font-bold leading-7.5 font-montserrat mb-3">
          {name}
        </h3>
        <div className="w-full h-1 bg-secondary-orange-bright mb-3 rounded-full" />
        <div className="flex-1 mb-3 md:mb-6">
          <p className="text-white text-sm md:text-base xl:text-lg leading-5 md:leading-6 xl:leading-7 font-noto-sans">
            {biography}
          </p>
        </div>
        <div className="flex justify-start">
          <Button variant="white" onClick={onClick} className="px-6 py-2">
            {defaultButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
