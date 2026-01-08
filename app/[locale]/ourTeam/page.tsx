"use client";

import { ProfileCard, ProfileCardHorizontal } from "@/components";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";

export default function OurTeam() {
  const t = useTranslations("ourTeam");
  const messages = useMessages();
  const ourTeamMessages = messages.ourTeam as any;

  return (
    <div className="flex flex-col font-sans relative pb-12">
      <section className="relative w-full  h-[246px] sm:h-[400px]  flex items-end">
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
          <h1 className="text-white title-sm mb-3">{t("heroSection.title")}</h1>
          <div className="h-1 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
      </section>
      <section className="w-full flex flex-col items-center justify-center gap-6 px-6 mb-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-white body-xs mt-3">
            {t("description.text")}
          </p>
        </div>
        </section>
      
      <section className="w-full p-6 pb-3!">
        <div className="mb-6">
          <h2 className="text-white title-sm mb-3">{t("founder.title")}</h2>
          <div className="h-1 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
        <ProfileCardHorizontal
          name={ourTeamMessages?.founder?.name || ""}
          biography={ourTeamMessages?.founder?.biography || ""}
          imageSrc={ourTeamMessages?.founder?.imageSrc || "/user.png"}
          imageAlt={ourTeamMessages?.founder?.imageAlt || "Founder"}
          buttonText={ourTeamMessages?.founder?.buttonText || ""}
          onClick={() => {}}
          className="w-full max-w-[400px] mb-12"
        />
        <div>
          <h2 className="text-white title-sm mb-6">{t("departments.title")}</h2>
        </div>
        <div className="flex flex-col gap-6">
          {(ourTeamMessages?.departments?.items || []).map((department: any, index: number) => (
            <ProfileCard
              key={index}
              name={department.name}
              biography={department.biography}
              imageSrc={'/department.png'}
              imageAlt={department.imageAlt}
              onClick={() => {}}
              className="w-full max-w-[400px]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
