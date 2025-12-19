"use client";

import { Button, ContentCard } from "@/components";
import { description, heroSection, descriptionItems } from "@/data/junior";
import Image from "next/image";

export default function Membership() {
  return (
    <div className="flex flex-col bg-primary-purple">
      <section className="relative w-full h-[246px] sm:h-[400px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src={heroSection.imageSrc}
            alt={heroSection.imageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-purple/95 via-primary-purple/40 to-primary-purple"></div>
        </div>

        <div className="relative z-10 w-full px-6">
          <h1 className="text-white title-sm mb-3">{heroSection.title}</h1>
          <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
      </section>
      <div className="px-6 pt-3">
        <h2 className="text-white body-sm-mobile font-semibold! font-montserrat! mb-3">
          {description.heading}
        </h2>
        <p className="text-white body-xs">
          {description.text}
        </p>
      </div>
      <div className="container mx-auto px-6 pt-12 pb-12">
        <div className="flex flex-col gap-6">
          {descriptionItems.map((item, index) => (
            <ContentCard
              key={index}
              title={item.heading}
              imageSrc={item.imageSrc}
              content={item.text}
              contentFontSize={item.contentFontSize}
            />
          ))}
        </div>
      </div>
      <div className="container mx-auto px-6 pb-12 flex justify-center">
        <Button variant="white">Registration</Button>
      </div>
    </div>
  );
}
