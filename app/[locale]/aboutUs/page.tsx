"use client";

import { IconProps, ProgramCard, MissionVision, Icon } from "@/components";
import { StatsCard } from "@/components/molecule/StatsCard";
import { useTranslations, useMessages } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { partnerLines } from "@/data/aboutUs";
import Image from "next/image";
import Marquee from "react-fast-marquee";

export default function AboutUs() {
  const t = useTranslations("aboutUs");
  const messages = useMessages();
  const aboutUsMessages = messages.aboutUs as any;
  const router = useRouter();

  // Map program titles to their routes - same as programs page
  const getProgramRoute = (programTitle: string): string => {
    const routeMap: Record<string, string> = {
      "Membership": "membership",
      "Center Up Junior": "centerUpJunior",
      "International Universities": "internationalUniversities",
      "Courses & Activities": "coursesAndActivities",
      "Conferences": "conferences",
      "Future Up": "futureUp",
      "Camps": "camps",
      "Event Organization": "eventOrganization",
      "Upcoming Events": "upcomingEvents",
    };
    
    const route = routeMap[programTitle] || "";
    return route ? `/programs/${route}` : "/programs";
  };

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
          <h1 className="text-white title-sm mb-3 md:text-center md:text-hero! md:text-secondary-orange-bright! md:mb-12!">
            {t("heroSection.title")}
          </h1>
          <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded md:hidden"></div>
        </div>
      </section>
      <section className="w-full flex flex-col items-center justify-center gap-12 px-6 md:px-10 xl:px-30">
        <div className="">
          <p className="text-white body-xs mt-3 md:text-subtitle! md:leading-subtitle!">
            {t("description.text")}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full md:gap-6">
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
      <section className="w-full py-12 px-6 md:px-10 xl:px-30">
        <div className="">
          <div className="mb-3 xl:mb-12!">
            <h2 className="text-white subtitle mb-3 md:text-headline! md:leading-headline!  xl:text-title! xl:leading-title! xl:mb-6! xl:font-bold!">
              {t("programsSection.title")}
            </h2>
            <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:gap-y-6 md:grid-cols-3 xl:grid-cols-4">
            {(aboutUsMessages?.items || []).map((program: string | any, index: number) => {
              const programTitle = typeof program === "string" ? program : program.title;
              const programRoute = getProgramRoute(programTitle);
              return (
              <ProgramCard
                  key={index}
                  imageSrc={typeof program === "object" && program.imageSrc ? program.imageSrc : "/image.png"}
                  imageAlt={programTitle}
                  title={programTitle}
                  onClick={() => {
                    router.push(programRoute);
                  }}
              />
              );
            })}
          </div>
        </div>
      </section>
      <MissionVision
        title={aboutUsMessages?.missionVision?.title || ""}
        mission={aboutUsMessages?.missionVision?.mission}
        vision={aboutUsMessages?.missionVision?.vision}
      />
      <section className="w-full p-6 md:px-10 xl:px-30">
        <div className="mb-8 xl:mb-12!">
          <h2 className="text-white subtitle mb-3 md:text-headline! md:leading-headline!  xl:text-title! xl:leading-title! xl:mb-6! xl:font-bold!">
            {t("partnersSection.title")}
            </h2>
          <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded" />
        </div>
        <div className="text-white body-xs mb-6 xl:mb-12! md:text-subtitle! md:leading-subtitle!">
        At Center Up, we build the future with the hands of youth. If you want to grow, find your professional path, fulfill your dreams, and reach all your goals—join us today and start your journey upward!
          </div>
        <div className="flex flex-col gap-10.5 mb-12 xl:mb-32!">
                {partnerLines.map(({ partners, direction }, index) => (
                    <Marquee key={index} direction={direction} className="flex gap-6">
                        {partners.map((partner) => (
                <div key={partner.name} className="ml-6 md:ml-10 xl:ml-12">
                                <Image
                                    src={partner.image}
                                    alt={partner.name}
                                    width={120}
                                    height={36}
                    className="h-9 w-auto object-contain partner-logo md:h-[70px] xl:h-[100px]"
                                />
                            </div>
                        ))}
                    </Marquee>
                ))}
            </div>
        <div className="text-white body-xs mb-6 xl:mb-12! md:text-subtitle! md:leading-subtitle!">Center Up collaborates with over 400 local and international organizations. Here are some of our main partners:</div>
      </section>
    </div>
  );
}
