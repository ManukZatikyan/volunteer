"use client";
import { MarketingProfileCard } from "@/components";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";

export default function ProjectManagement() {
  const t = useTranslations("projectManagement");
  const messages = useMessages();
  const projectManagementMessages = messages.projectManagement as any;

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[246px] sm:h-[400px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Project Management"
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
      <div className="px-6 md:px-10 xl:px-30 pt-3 md:pt-6 xl:pt-12">
        <h2 className="text-white body-sm-mobile md:text-subtitle! md:leading-subtitle! font-semibold! font-montserrat! mb-3 md:mb-6">
          {t("description.heading")}
        </h2>
        <p className="text-white body-xs md:text-subtitle! md:leading-subtitle!">
          {t("description.text")}
        </p>
      </div>
      <div className="px-6 md:px-10 xl:px-30 pt-12">
        <div className="flex flex-col gap-6">
          <div className="mb-3 xl:mb-6!">
            <h2 className="text-white subtitle mb-3 md:text-headline! md:leading-headline! xl:text-title! xl:leading-title! xl:mb-6! xl:font-bold!">
              {t("headOfDepartment.title")}
            </h2>
            <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded" />
          </div>
          <MarketingProfileCard
            name={projectManagementMessages?.headOfDepartment?.name || ""}
            description={projectManagementMessages?.headOfDepartment?.description || ""}
            imageSrc={projectManagementMessages?.headOfDepartment?.imageSrc || "/user.png"}
            imageAlt={projectManagementMessages?.headOfDepartment?.imageAlt || ""}
            imagePosition={projectManagementMessages?.headOfDepartment?.imagePosition || "left"}
            socialLinks={projectManagementMessages?.headOfDepartment?.socialLinks || []}
          />
        </div>
      </div>
      <div className="px-6 md:px-10 xl:px-30 py-12">
        <div className="flex flex-col gap-6 md:gap-8 xl:gap-12">
          <div className="mb-3 xl:mb-6!">
            <h2 className="text-white subtitle mb-3 md:text-headline! md:leading-headline! xl:text-title! xl:leading-title! xl:mb-6! xl:font-bold!">
              {t("members.title")}
            </h2>
            <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded" />
          </div>
          <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:place-items-center gap-6 lg:gap-y-[48px]">
            {(projectManagementMessages?.members?.items || []).map((member: any, index: number) => (
              <MarketingProfileCard
                key={index}
                name={member.name}
                description={member.description}
                imageSrc={member.imageSrc || "/user.png"}
                imageAlt={member.imageAlt || ''}
                imagePosition={member.imagePosition}
                socialLinks={member.socialLinks || []}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

