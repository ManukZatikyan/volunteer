"use client";

import { Button, ContentCard } from "@/components";
import { useTranslations, useMessages } from "next-intl";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";

export default function CenterUpJunior() {
  const t = useTranslations("junior");
  const messages = useMessages();
  const juniorMessages = messages.junior as any;
  const router = useRouter();

  return (
    <div className="flex flex-col bg-primary-purple">
      <section className="relative w-full h-[246px] sm:h-[400px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Center Up Junior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-purple/95 via-primary-purple/40 to-primary-purple"></div>
        </div>

        <div className="relative z-10 w-full px-6">
          <h1 className="text-white title-sm mb-3 md:text-center md:text-hero! md:mb-21!">
            {t("heroSection.title")}
          </h1>
          <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded md:hidden"></div>
        </div>
      </section>
      <div className="px-6 pt-3 md:px-10 xl:px-30">
        <h2 className="text-white body-sm-mobile font-semibold! font-montserrat! mb-3 md:text-headline! md:leading-headline! md:font-bold!">
          {t("description.heading")}
        </h2>
        <p className="text-white body-xs md:text-body! md:leading-body!">
          {t("description.text")}
        </p>
      </div>
      <div className="md:px-4 xl:px-30 px-6 pt-12 pb-12">
        <div className="flex flex-col gap-6">
          {(juniorMessages?.descriptionItems || []).map((item: any, index: number) => (
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
      <div className="md:px-4 xl:px-30 px-6 pb-12 flex justify-center">
        <Button variant="white" onClick={() => router.push("/registration")}>
          {t("registrationButton.text")}
        </Button>
      </div>
    </div>
  );
}
