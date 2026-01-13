"use client";
import { useTranslations, useMessages, useLocale } from "next-intl";
import { ProcessPhases } from "@/components/molecule/ProcessPhases";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/atom/Button";
import { useState, useEffect } from "react";

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
  const locale = useLocale();
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch content from API
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/internationalUniversities?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          const content = data.content;
          if (content) {
            setHighlightedCountries(content.highlightedCountries || []);
            setPhases(content.phases || []);
          } else {
            // Fallback to default data if API returns null
            const { highlightedCountries: defaultCountries, phases: defaultPhases } = await import("@/data/internationalUniversities");
            setHighlightedCountries(defaultCountries || []);
            setPhases(defaultPhases || []);
          }
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        // Fallback to default data on error
        try {
          const { highlightedCountries: defaultCountries, phases: defaultPhases } = await import("@/data/internationalUniversities");
          setHighlightedCountries(defaultCountries || []);
          setPhases(defaultPhases || []);
        } catch (fallbackError) {
          console.error("Error loading fallback data:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [locale]);

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

        <div className="relative z-10 w-full px-6">
          <h1 className="text-white title-sm mb-3 md:text-center md:text-hero! md:text-secondary-orange-bright! md:mb-21!">
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
        <ProcessPhases phases={phases || []} />
      </div>
      {loading ? (
        <div className="px-6 py-12 text-center text-white">Loading...</div>
      ) : (
        <>
          <ProcessPhases phases={phases || []} />

          <div className="w-full px-6 pb-8 bg-white dark:bg-primary-default">
            <div className="relative z-10 w-full">
              <h1 className="text-primary-default dark:text-white title-sm mb-3">{t("studentsAroundWorld.title")}</h1>
              <div className="h-1 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
            </div>
            <div className="pt-3">
              <p className="text-primary-default dark:text-white body-sm-mobile">{t("studentsAroundWorld.description")}</p>
            </div>
            <WorldMap highlightedCountries={highlightedCountries || []} />
          </div>
        </>
      )}
      <div className="container mx-auto px-6 pb-12 flex justify-center">
        <Button variant="orange">{t("registrationButton.text")}</Button>
      </div>
    </div>
  );
}
