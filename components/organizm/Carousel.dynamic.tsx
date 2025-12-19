"use client";

import dynamic from "next/dynamic";

const CarouselComponent = dynamic(
  () => import("./Carousel").then((mod) => mod.Carousel),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center gap-6 md:gap-8">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg p-6 md:p-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex flex-col items-center md:items-start shrink-0 md:w-1/3">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 mb-4" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col flex-1 md:w-2/3">
              <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

export const Carousel = CarouselComponent;
export type { CarouselProps } from "./Carousel";
