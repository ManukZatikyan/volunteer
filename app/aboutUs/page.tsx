"use client";

import { IconProps, ProgramCard, MissionVision } from "@/components";
import { StatsCard } from "@/components/molecule/StatsCard";
import {
  description,
  heroSection,
  missionVision,
  partnerLines,
  partnersSection,
  programs,
  programsSection,
  stats,
} from "@/data/aboutUs";
import Image from "next/image";
import Marquee from "react-fast-marquee";

export default function AboutUs() {
  return (
    <div className="flex flex-col font-sans relative">
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
          <h1 className="text-white title-sm mb-3">
            {heroSection.title}
          </h1>
          <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
      </section>
      <section className="w-full flex flex-col items-center justify-center gap-6 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-white body-xs mt-3">
            {description.text}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-between w-full">
            {stats.map((stat) => (
                <StatsCard
                    key={stat.icon}
                    icon={stat.icon as IconProps["name"]}
                    label={stat.label}
                    value={stat.value}
                />
            ))}
        </div>
      </section>
      <section className="w-full py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-white title-sm mb-3">
              {programsSection.title}
            </h2>
            <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:gap-y-6">
            {programs.map((program, index) => (
              <ProgramCard
                key={`${program.title}-${index}`}
                imageSrc={program.imageSrc}
                imageAlt={program.title}
                title={program.title}
              />
            ))}
          </div>
        </div>
      </section>
      <MissionVision
        title={missionVision.title}
        mission={missionVision.mission}
        vision={missionVision.vision}
      />
       <section className="w-full">
          <div className="mb-8 px-11">
            <h2 className="text-white title-sm mb-3">
              {partnersSection.title}
            </h2>
            <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
          </div>
            <div className="flex flex-col gap-10.5 mb-12">
                {partnerLines.map(({ partners, direction }, index) => (
                    <Marquee key={index} direction={direction} className="flex gap-6">
                        {partners.map((partner) => (
                            <div key={partner.name} className="ml-6">
                                <Image
                                    src={partner.image}
                                    alt={partner.name}
                                    width={120}
                                    height={36}
                                    className="h-9 w-auto object-contain"
                                />
                            </div>
                        ))}
                    </Marquee>
                ))}
            </div>
      </section>
    </div>
  );
}
