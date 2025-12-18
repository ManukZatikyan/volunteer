"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

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
  buttonText = "Read more",
  className,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-row gap-3 rounded-3xl w-full max-w-[400px] p-4",
        "shadow-lg overflow-hidden",
        "bg-primary-light",
        className
      )}
    >
      {/* Image Section - Left Side */}
      <div className="relative w-1/2 min-w-[180px] h-full min-h-[243px] rounded-xl">
        <Image
          src={imageSrc}
          alt={imageAlt || name}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 50vw, 180px max-h-[243px]"
          priority
        />
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-white text-2xl font-bold leading-7.5 font-montserrat mb-3">
          {name}
        </h3>
        <div className="w-full h-1 bg-secondary-orange-bright mb-3 rounded-full" />
        <div className="flex-1 mb-3">
          <p className="text-white text-sm leading-5 font-noto-sans">
            {biography}
          </p>
        </div>
        <div className="flex justify-start">
          <Button variant="white" onClick={onClick} className="px-6 py-2">
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
