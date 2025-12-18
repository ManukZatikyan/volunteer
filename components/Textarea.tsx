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
          className="block mb-1.5 text-body-sm-mobile"
          style={{ color: "#FFFFFF" }}
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
          "resize-none",
          "placeholder:text-text-gray-2",
          hasError && "border-error focus:border-error",
          !hasError && "border-[#CBCBCB] focus:border-[#FFA500]",
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
