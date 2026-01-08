"use client";

import { Button, ContentCard } from "@/components";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";

export default function Membership() {
  const t = useTranslations("membership");
  const messages = useMessages();
  const membershipMessages = messages.membership as any;

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[246px] sm:h-[400px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Membership"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-default/60 via-transparent to-white dark:from-primary-default/95 dark:via-primary-default/40 dark:to-primary-default"></div>
        </div>

        <div className="relative z-10 w-full px-6">
          <h1 className="text-white title-sm mb-3">{t("heroSection.title")}</h1>
          <div className="h-1 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
      </section>
      <div className="px-6 pt-3">
        <h2 className="text-white body-sm-mobile font-semibold! font-montserrat! mb-3">
          {t("description.heading")}
        </h2>
        <p className="text-white body-xs">
          {t("description.text")}
        </p>
      </div>
      <div className="container mx-auto px-6 pt-12 pb-12">
        <div className="flex flex-col gap-6">
          {(membershipMessages?.descriptionItems || []).map((item: any, index: number) => (
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
        <Button variant="orange">{t("registrationButton.text")}</Button>
      </div>
    </div>
  );
}
