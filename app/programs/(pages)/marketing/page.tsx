"use client";
import { MarketingProfileCard } from "@/components";
import { description, headOfMarketing, heroSection, members } from "@/data/marketing";
import Image from "next/image";

export default function Marketing() {
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
      <div className="px-6 pt-3">
        <h2 className="text-white body-sm-mobile font-semibold! font-montserrat! mb-3">
          {description.heading}
        </h2>
        <p className="text-white body-xs">
          {description.text}
        </p>
      </div>
      <div className="container mx-auto px-6 pt-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-white subtitle font-semibold!">{headOfMarketing.title}</h2>
          <MarketingProfileCard
            name={headOfMarketing.name}
            description={headOfMarketing.description}
            imageSrc={headOfMarketing.imageSrc}
            imageAlt={headOfMarketing.imageAlt}
            imagePosition={headOfMarketing.imagePosition}
          />
        </div>
      </div>
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-white subtitle font-semibold!">{members.title}</h2>
          {members.items.map((member, index) => (
            <MarketingProfileCard
              key={index}
              name={member.name}
              description={member.description}
              imageSrc={member.imageSrc}
              imageAlt={member.imageAlt}
              imagePosition={member.imagePosition}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
