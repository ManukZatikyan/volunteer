"use client";

import { ProfileCard, ProfileCardHorizontal } from "@/components";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";

// Helper function to map department names to routes
const getDepartmentRoute = (departmentName: string): string | undefined => {
  const routeMap: Record<string, string> = {
    "Marketing": "/programs/marketing",
    "PR and Partnership": "/programs", // Add specific route if available
    "Event Management & Data Analytics": "/programs", // Add specific route if available
    "Project Management": "/programs", // Add specific route if available
  };
  return routeMap[departmentName];
};

export default function OurTeam() {
  const t = useTranslations("ourTeam");
  const messages = useMessages();
  const ourTeamMessages = messages.ourTeam as any;

  return (
    <div className="flex flex-col font-sans relative pb-12">
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

        <div className="relative z-10 w-full px-6">
          <h1 className="text-white title-sm mb-3 md:text-center md:text-hero! md:text-secondary-orange-bright! md:mb-12!">
            {t("heroSection.title")}
          </h1>
          <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded md:hidden"></div>
        </div>
      </section>
      <section className="container w-full flex flex-col items-center justify-center gap-12 px-6 md:px-10 xl:px-30">
        <div className="">
          <p className="text-white body-xs mt-3 md:text-subtitle! md:leading-subtitle!">
            {t("description.text")}
          </p>
        </div>
      </section>

      <section className="container w-full p-6 pb-3! md:px-10 xl:px-30 xl:pb-19!">
        <div className="mb-3 xl:mb-16!">
          <h2 className="text-white subtitle mb-3 md:text-headline! md:leading-headline! xl:text-title! xl:leading-title! xl:mb-6! xl:font-bold!">
            {t("founder.title")}
          </h2>
          <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded" />
        </div>
        <ProfileCardHorizontal
          name={ourTeamMessages?.founder?.name || ""}
          biography={ourTeamMessages?.founder?.biography || ""}
          imageSrc={ourTeamMessages?.founder?.imageSrc || "/user.png"}
          imageAlt={ourTeamMessages?.founder?.imageAlt || "Founder"}
          buttonText={ourTeamMessages?.founder?.buttonText || ""}
          onClick={() => {}}
          className="mb-12"
        />
        <div>
          <div className="mb-3 xl:mb-6!">
            <h2 className="text-white subtitle mb-3 md:text-headline! md:leading-headline! xl:text-title! xl:leading-title! xl:mb-6! xl:font-bold!">
              {t("departments.title")}
            </h2>
            <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded" />
          </div>
        </div>
        <div className="flex flex-col items-center md:grid md:grid-cols-2 md:place-items-center xl:flex xl:flex-row xl:justify-center gap-6">
          {(ourTeamMessages?.departments?.items || []).map(
            (department: any, index: number) => {
              const departmentRoute = getDepartmentRoute(department.name);
              return (
                <ProfileCard
                  key={index}
                  name={department.name}
                  biography={department.biography}
                  imageSrc={"/department.png"}
                  imageAlt={department.imageAlt}
                  href={departmentRoute}
                  className="w-full max-w-[400px]"
                />
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}
