"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface DatePickerProps {
  value?: string | Date;
  onChange?: (date: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "mm/dd/yyyy",
  label,
  required = false,
  error,
  className,
  minDate,
  maxDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? (value instanceof Date ? value : new Date(value)) : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const dateValue = value instanceof Date ? value : new Date(value);
      setSelectedDate(dateValue);
      setCurrentMonth(dateValue);
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Generate years list (from 1900 to current year + 10)
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let year = 1900; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years.reverse(); // Most recent first
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setShowYearPicker(false);
    setShowMonthPicker(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(newDate);
    setShowMonthPicker(false);
    setShowYearPicker(false);
  };

  const handleMonthClick = () => {
    setShowMonthPicker(true);
    setShowYearPicker(false);
  };

  const handleYearClick = () => {
    setShowYearPicker(true);
    setShowMonthPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleDateSelect = (date: Date) => {
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;

    setSelectedDate(date);
    onChange?.(formatDate(date));
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days: (Date | null)[] = [];

    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonth = new Date(year, month, -i);
      days.push(prevMonth);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth() &&
           date.getFullYear() === currentMonth.getFullYear();
  };

  const isDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const days = getDaysInMonth(currentMonth);
  const hasError = !!error;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {label && (
        <label className="block mb-1.5 text-body-sm-mobile font-noto-sans! text-primary-default dark:text-white">
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={formatDate(selectedDate)}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full rounded-full p-4 pr-12",
            "border-2",
            "text-primary-default dark:text-white placeholder:text-secondary-gray",
            "focus:outline-none focus:border-button-orange transition-colors",
            "border-secondary-gray bg-transparent",
            "cursor-pointer",
            hasError && "border-error focus:border-error"
          )}
        />
        <div className="absolute right-5 pointer-events-none z-10 flex items-center justify-center bottom-5">
          <Icon name="calendar" size={24} color="#FFA008" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-background-white dark:bg-primary-default border-2 border-primary-default dark:border-secondary-orange-bright/30 rounded-lg shadow-xl p-4 min-w-[320px]">
          {showYearPicker ? (
            /* Year Picker */
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowYearPicker(false)}
                  className="text-primary-default dark:text-white font-medium hover:text-button-orange transition-colors cursor-pointer"
                  type="button"
                >
                  ← Back
                </button>
                <h3 className="text-primary-default dark:text-white font-semibold text-base">
                  Select Year
                </h3>
                <div className="w-12"></div>
              </div>
              <div className="max-h-[300px] overflow-y-auto grid grid-cols-4 gap-2">
                {getYears().map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={cn(
                      "py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      currentMonth.getFullYear() === year
                        ? "bg-secondary-orange-bright text-primary-default"
                        : "bg-background-light-1 dark:bg-background-light-2/20 text-primary-default dark:text-white hover:bg-background-light-2 dark:hover:bg-background-light-2/40"
                    )}
                    type="button"
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          ) : showMonthPicker ? (
            /* Month Picker */
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowMonthPicker(false)}
                  className="text-primary-default dark:text-white font-medium hover:text-button-orange transition-colors cursor-pointer"
                  type="button"
                >
                  ← Back
                </button>
                <h3 className="text-primary-default dark:text-white font-semibold text-base">
                  Select Month
                </h3>
                <div className="w-12"></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      "py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      currentMonth.getMonth() === index
                        ? "bg-secondary-orange-bright text-primary-default"
                        : "bg-background-light-1 dark:bg-background-light-2/20 text-primary-default dark:text-white hover:bg-background-light-2 dark:hover:bg-background-light-2/40"
                    )}
                    type="button"
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="w-8 h-8 rounded-full bg-primary-default hover:bg-primary-dark flex items-center justify-center transition-colors cursor-pointer"
                  type="button"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 9L4.5 6L7.5 3"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMonthClick}
                    className="text-primary-default dark:text-white font-semibold text-base hover:text-button-orange transition-colors px-2 py-1 rounded cursor-pointer"
                    type="button"
                  >
                    {MONTHS[currentMonth.getMonth()]}
                  </button>
                  <button
                    onClick={handleYearClick}
                    className="text-primary-default dark:text-white font-semibold text-base hover:text-button-orange transition-colors px-2 py-1 rounded cursor-pointer"
                    type="button"
                  >
                    {currentMonth.getFullYear()}
                  </button>
                </div>
                <button
                  onClick={() => navigateMonth("next")}
                  className="w-8 h-8 rounded-full bg-primary-default hover:bg-primary-dark flex items-center justify-center transition-colors cursor-pointer"
                  type="button"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.5 9L7.5 6L4.5 3"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-text-gray-1 dark:text-text-gray-2 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  if (!date) return <div key={index} />;

                  const isSelected = isSameDay(date, selectedDate);
                  const isCurrentMonthDay = isCurrentMonth(date, currentMonth);
                  const isDisabledDate = isDisabled(date);

                  return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  disabled={isDisabledDate}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    !isCurrentMonthDay && "text-text-gray-2 opacity-50",
                    isCurrentMonthDay && !isSelected && !isDisabledDate && "text-primary-default! dark:text-white! hover:bg-background-light-1 dark:hover:bg-background-light-2/30 cursor-pointer",
                    isSelected && "bg-secondary-orange-bright text-primary-default! cursor-pointer",
                    isDisabledDate && "opacity-30 cursor-not-allowed text-text-gray-2!"
                  )}
                  type="button"
                >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-secondary-gray">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 px-4 rounded-lg bg-background-light-1 dark:bg-background-light-2/30 text-text-gray-1 dark:text-white font-medium hover:bg-background-light-2 dark:hover:bg-background-light-2/50 transition-colors cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedDate) {
                  onChange?.(formatDate(selectedDate));
                }
                setIsOpen(false);
              }}
              className="flex-1 py-2 px-4 rounded-lg bg-button-orange text-white font-medium hover:bg-button-orange-dark transition-colors cursor-pointer"
              type="button"
            >
              Choose Date
            </button>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

