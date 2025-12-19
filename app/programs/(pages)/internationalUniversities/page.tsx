"use client";
import { description, heroSection } from "@/data/internationalUniversities";
import Image from "next/image";

export default function InternationalUniversities() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full  h-[246px] sm:h-[400px]  flex items-end">
        <div className="absolute inset-0">
          <Image
            src={heroSection.imageSrc}
            alt={heroSection.imageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary-default/95 via-primary-default/40 to-primary-default"></div>
        </div>

        <div className="relative z-10 w-full px-6 ">
          <h1 className="text-white title-sm mb-3">{heroSection.title}</h1>
          <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
      </section>
      <div className="px-6 pt-3 pb-12">
        <p className="text-white body-xs">
          {description.text}
        </p>
      </div>

    </div>
  );
}
