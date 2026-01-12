import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  asteriskColor?: "orange" | "red" | "default";
}

export const Input: React.FC<InputProps> = ({
  label,
  required = false,
  error,
  className,
  id,
  asteriskColor = "default",
  ...props
}) => {
  const inputId = id || `input-${crypto.randomUUID().substring(0, 9)}`;
  const hasError = !!error;

  const asteriskClass = cn(
    "ml-0.5",
    asteriskColor === "orange" && "text-secondary-orange-bright",
    asteriskColor === "red" && "text-error",
    asteriskColor === "default" && "text-primary-default dark:text-error"
  );

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1.5 text-body-sm-mobile font-noto-sans! text-primary-default dark:text-white"
        >
          {label}
          {required && <span className={asteriskClass}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-full p-4",
          "border-2",
          "text-primary-light placeholder:text-secondary-gray",
          "focus:outline-none focus:border-button-orange transition-colors",
          "border-secondary-gray bg-transparent",
          hasError && "border-error focus:border-error",
          className
        )}
        style={{
          color: "#FFFFFF",
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};