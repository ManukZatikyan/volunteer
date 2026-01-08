"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../atom/Button";
import { useTranslations } from "next-intl";

export interface ProfileCardProps {
  imageSrc: string;
  imageAlt?: string;
  name: string;
  biography: string;
  buttonText?: string;
  className?: string;
  onClick?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  imageSrc,
  imageAlt = "",
  name,
  biography,
  buttonText,
  className,
  onClick,
}) => {
  const t = useTranslations("common.buttons");
  const defaultButtonText = buttonText || t("discoverMore");
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl w-full max-w-[400px] p-6 bg-primary-light",
        "shadow-lg overflow-hidden",
        className
      )}
    >
      <div className="relative w-full h-[150px] rounded-xl">
        <Image
          src={imageSrc}
          alt={imageAlt || name}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px max-h-[150px]"
          priority
        />
        <div
          className="absolute inset-0 rounded-xl profile-card-image-gradient"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-3">
          <h3 className="text-white text-2xl font-bold leading-tight font-montserrat mb-0">
            {name}
          </h3>
        </div>
      </div>
      <div className="w-full h-1 bg-secondary-orange-bright rounded-full" />
      <div className="py-3 pb-6 flex-1">
        <p className="text-white text-base leading-relaxed font-noto-sans">
          {biography}
        </p>
      </div>
      <div className="px-6 flex justify-center">
        <Button
          variant="white"
          onClick={onClick}
          className="w-full max-w-[200px]"
        >
          {defaultButtonText}
        </Button>
      </div>
    </div>
  );
};
