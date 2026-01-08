"use client";

import { IconProps, ProgramCard, MissionVision, Icon } from "@/components";
import { StatsCard } from "@/components/molecule/StatsCard";
import { useTranslations, useMessages } from "next-intl";
import { partnerLines } from "@/data/aboutUs";
import Image from "next/image";
import Marquee from "react-fast-marquee";

export default function AboutUs() {
  const t = useTranslations("aboutUs");
  const messages = useMessages();
  const aboutUsMessages = messages.aboutUs as any;

  return (
    <div className="flex flex-col font-sans relative">
      <section className="relative w-full h-[246px] sm:h-[400px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Center Up team"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-default/60 via-transparent to-white dark:from-primary-default/95 dark:via-primary-default/40 dark:to-primary-default"></div>
        </div>
        
        <div className="relative z-10 w-full px-6 ">
          <h1 className="text-white title-sm mb-3">
            {t("heroSection.title")}
          </h1>
          <div className="h-1 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
      </section>
      <section className="w-full flex flex-col items-center justify-center gap-12 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-white body-xs mt-3">
            {t("description.text")}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-between w-full">
            {(aboutUsMessages?.stats || []).map((stat: any, index: number) => (
                <StatsCard
                    key={stat.icon || index}
                    icon={stat.icon as IconProps["name"]}
                    label={stat.label}
                    value={stat.value}
                />
            ))}
        </div>
      </section>
      <section className="w-full py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-3">
            <h2 className="text-white subtitle mb-3">
              {t("programsSection.title")}
            </h2>
            <div className="h-1 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:gap-y-6">
            {(aboutUsMessages?.programs || []).map((program: any, index: number) => (
              <ProgramCard
                key={`${program.title}-${index}`}
                imageSrc={program.imageSrc || "/image.png"}
                imageAlt={program.title}
                title={program.title}
              />
            ))}
          </div>
        </div>
      </section>
      <MissionVision
        title={aboutUsMessages?.missionVision?.title || ""}
        mission={aboutUsMessages?.missionVision?.mission}
        vision={aboutUsMessages?.missionVision?.vision}
      />
       <section className="w-full p-6">
          <div className="mb-8">
            <h2 className="text-white subtitle mb-3">
              {t("partnersSection.title")}
            </h2>
            <div className="h-1 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
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
                                    className="h-9 w-auto object-contain partner-logo"
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
