"use client";
import { useTranslations, useMessages } from "next-intl";
import { ProcessPhases } from "@/components/molecule/ProcessPhases";
import dynamic from "next/dynamic";
import Image from "next/image";
import { highlightedCountries, phases } from "@/data/internationalUniversities";
import { Button } from "@/components/atom/Button";

// Dynamically import WorldMap to avoid SSR issues with d3-geo
const WorldMap = dynamic(
  () =>
    import("@/components/molecule/WorldMap").then((mod) => ({
      default: mod.WorldMap,
    })),
  { ssr: false }
);

export default function InternationalUniversities() {
  const t = useTranslations("internationalUniversities");
  // const messages = useMessages();
  // const intlUniMessages = messages.internationalUniversities as any;

  return (
    <div className="flex flex-col">
      <section className="relative w-full  h-[246px] sm:h-[400px]  flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="International Universities"
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
      <div className="px-6 pt-3 pb-12">
        <p className="text-white body-xs">{t("description.text")}</p>
      </div>
      <ProcessPhases phases={phases || []} />

      <div className="w-full px-6 pb-8 bg-primary-default">
        <div className="relative z-10 w-full">
          <h1 className="text-white title-sm mb-3">{t("studentsAroundWorld.title")}</h1>
          <div className="h-1 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
        <div className="pt-3">
        <p className="text-white body-sm-mobile">{t("studentsAroundWorld.description")}</p>
      </div>
        <WorldMap highlightedCountries={highlightedCountries || []} />
      </div>
      <div className="container mx-auto px-6 pb-12 flex justify-center">
        <Button variant="orange">{t("registrationButton.text")}</Button>
      </div>
    </div>
  );
}
