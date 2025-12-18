"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "orange"
  | "orange-light"
  | "orange-dark"
  | "white"
  | "grey-light"
  | "grey-medium"
  | "grey-dark"
  | "disabled";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  orange: "bg-button-orange",
  "orange-light": "bg-button-orange-light",
  "orange-dark": "bg-button-orange-dark",
  white: "bg-button-white",
  "grey-light": "bg-button-grey-light",
  "grey-medium": "bg-button-grey-medium",
  "grey-dark": "bg-button-grey-dark",
  disabled: "bg-button-grey-disabled",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "orange",
  children,
  className,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || variant === "disabled";

  return (
    <button
      className={cn(
        "rounded-full px-8 py-3 button-sm cursor-pointer font-semibold",
        variantStyles[variant],
        isDisabled ? "text-text-gray-2" : "text-primary-default",
        isDisabled && "cursor-not-allowed",
        !isDisabled && "hover:opacity-90 transition-opacity",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
};
