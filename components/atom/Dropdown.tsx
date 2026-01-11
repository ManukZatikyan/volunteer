"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = "Selected Option",
  value,
  options,
  onChange,
  required = false,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const displayText = selectedOption?.label || placeholder;
  const hasSelection = !!selectedValue && selectedValue !== "";

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const hasError = !!error;
  
  // Orange (#FFA008) when option is selected (active), white/gray (#CACACA) when not selected (inactive)
  const borderColor = hasSelection ? "#FFA008" : "#CACACA";

  return (
    <div className={cn("w-full relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block mb-2 text-body-sm-mobile font-noto-sans! text-white">
          {label}
          {required && (
            <span className="text-secondary-orange-bright ml-0.5">*</span>
          )}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full rounded-lg px-4 py-3 pr-5",
            "border-2 transition-all duration-200",
            "flex items-center justify-between gap-3",
            "focus:outline-none focus:border-button-orange cursor-pointer min-h-[48px]",
            "bg-transparent",
            hasError && "border-error focus:border-error",
            !hasError && "border-white"
          )}
          style={{
            color: "#FFFFFF",
          }}
        >
          <span className="text-white font-noto-sans! text-sm md:text-base truncate text-left flex-1">
            {displayText}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "shrink-0 transition-transform duration-200",
              !isOpen && "rotate-0",
              isOpen && "rotate-180"
            )}
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            className={cn(
              "absolute top-full left-0 right-0 mt-1 rounded-lg border-2 z-50 overflow-hidden",
              "max-h-64 overflow-y-auto",
              hasSelection && "border-secondary-orange-bright",
              !hasSelection && "border-[#CACACA]"
            )}
            style={{
              backgroundColor: "#050927", // primary-default - dark gray background matching image
              borderColor: hasSelection ? "#FFA008" : "#CACACA",
            }}
          >
            {options.map((option, index) => (
              <React.Fragment key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-white font-noto-sans! text-sm md:text-base cursor-pointer",
                    "transition-all duration-150",
                    "relative",
                    selectedValue === option.value && hasSelection && "bg-[rgba(255,160,8,0.1)]",
                    selectedValue === option.value && !hasSelection && "bg-[rgba(202,202,202,0.1)]"
                  )}
                  style={{
                    backgroundColor:
                      selectedValue === option.value
                        ? hasSelection
                          ? "rgba(255, 160, 8, 0.1)"
                          : "rgba(202, 202, 202, 0.1)"
                        : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hasSelection
                      ? "rgba(255, 160, 8, 0.2)"
                      : "rgba(202, 202, 202, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedValue === option.value) {
                      e.currentTarget.style.backgroundColor = hasSelection
                        ? "rgba(255, 160, 8, 0.1)"
                        : "rgba(202, 202, 202, 0.1)";
                    } else {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {option.label}
                </button>
                {index < options.length - 1 && (
                  <div
                    className="h-px w-full"
                    style={{
                      backgroundColor: hasSelection ? "#FFA008" : "#CACACA",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};
