import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  required = false,
  error,
  className,
  id,
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block mb-1.5 text-body-sm-mobile font-noto-sans! text-primary-default dark:text-white"
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "w-full rounded-3xl p-4",
          "border-2 transition-colors",
          "focus:outline-none",
          "resize-none border-secondary-gray text-primary-default dark:text-white",
          "[&::placeholder]:border-secondary-gray",
          "[&::-webkit-input-placeholder]:border-secondary-gray",
          "[&::-moz-placeholder]:border-secondary-gray",
          "[&:-ms-input-placeholder]:border-secondary-gray",
          hasError && "border-error focus:border-error",
          !hasError && "focus:border-secondary-orange-bright",
          className
        )}
        style={{
          color: "#FFFFFF",
          backgroundColor: "transparent",
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};
