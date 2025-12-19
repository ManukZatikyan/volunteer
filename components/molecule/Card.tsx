"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../atom/Button";

export interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt = "",
  buttonText = "Learn more",
  onButtonClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl bg-primary-light overflow-hidden p-6",
        className
      )}
    >
      <div className="relative w-full h-64 overflow-hidden rounded-xl">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col flex-1 pt-6 gap-4">
        <h3
          className="text-white subtitle-sm text-2xl! font-semibold!"
        >
          {title}
        </h3>
        <p
          className="text-white body-sm-mobile flex-1"
        >
          {description}
        </p>
        <div className="pt-2">
          <Button variant="orange" onClick={onButtonClick}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
