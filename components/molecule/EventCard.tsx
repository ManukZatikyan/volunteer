"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../atom/Button";
import { useTranslations } from "next-intl";

export interface EventCardProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
  buttonText?: string;
  className?: string;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  imageSrc,
  imageAlt = "",
  title,
  description,
  buttonText,
  className,
  onClick,
}) => {
  const t = useTranslations("common.buttons");
  const defaultButtonText = buttonText || t("learnMore");
  return (
    <div
      className={cn(
        "relative flex flex-row gap-4 rounded-3xl w-full max-w-[400px] p-5",
        "shadow-lg overflow-hidden",
        "bg-primary-light",
        className
      )}
    >
      <div className="relative w-1/2 min-w-[160px] h-full min-h-[238px] rounded-xl">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 50vw, 160px max-h-[238px]"
          priority
        />
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-white subtitle font-montserrat mb-1.5">
          {title}
        </h3>
        <div className="flex-1 mb-3">
          <p className="text-white text-sm leading-5 font-noto-sans">
            {description}
          </p>
        </div>
        <div className="flex justify-start">
          <Button variant="orange" onClick={onClick} className="px-8! py-3!">
            {defaultButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
