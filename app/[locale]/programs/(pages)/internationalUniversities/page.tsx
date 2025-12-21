"use client";
import { useTranslations, useMessages } from "next-intl";
import { ProcessPhases } from "@/components/molecule/ProcessPhases";
import dynamic from "next/dynamic";
import Image from "next/image";
import { highlightedCountries, phases } from "@/data/internationalUniversities";

// Dynamically import WorldMap to avoid SSR issues with d3-geo
const WorldMap = dynamic(
  () => import("@/components/molecule/WorldMap").then((mod) => ({ default: mod.WorldMap })),
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
          <div className="absolute inset-0 bg-gradient-to-b from-primary-default/95 via-primary-default/40 to-primary-default"></div>
        </div>

        <div className="relative z-10 w-full px-6 ">
          <h1 className="text-white title-sm mb-3">{t("heroSection.title")}</h1>
          <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
      </section>
      <div className="px-6 pt-3 pb-12">
        <p className="text-white body-xs">{t("description.text")}</p>
      </div>
      <div className="w-full h-[500px] sm:h-[600px] md:h-[700px] px-6 py-8 bg-primary-default">
        <WorldMap highlightedCountries={highlightedCountries|| []} />
      </div>
      <ProcessPhases phases={phases || []} />
    </div>
  );
}
