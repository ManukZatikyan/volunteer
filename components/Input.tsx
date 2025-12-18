import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  required = false,
  error,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${crypto.randomUUID().substring(0, 9)}`;
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1.5 text-body-sm-mobile"
          style={{ color: "#FFFFFF" }}
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-full p-4",
          "border-2",
          "text-primary-light placeholder:text-secondary-gray",
          "focus:outline-none focus:border-button-orange transition-colors",
          "border-secondary-gray",
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