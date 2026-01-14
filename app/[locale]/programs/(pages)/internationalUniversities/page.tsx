"use client";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ProcessPhases } from "@/components/molecule/ProcessPhases";
import dynamic from "next/dynamic";
import Image from "next/image";
import { highlightedCountries, phases } from "@/data/internationalUniversities";
import { Button, Loading } from "@/components";
import { useLoopedLoading } from "@/lib/useLoopedLoading";

// Dynamically import WorldMap to avoid SSR issues with d3-geo
const WorldMap = dynamic(
  () =>
    import("@/components/molecule/WorldMap").then((mod) => ({
      default: mod.WorldMap,
    })),
  { ssr: false }
);

export default function InternationalUniversities() {
  const locale = useLocale();
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const { loading, stopLoading } = useLoopedLoading({
    initiallyLoading: true,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/internationalUniversities?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
        }
      } catch (error) {
        console.error("Error fetching internationalUniversities content:", error);
      } finally {
        stopLoading();
      }
    };

    fetchContent();
  }, [locale, stopLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size={300} loop />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size={300} loop />
      </div>
    );
  }

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
            {content.heroSection?.title || ""}
          </h1>
          <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded md:hidden"></div>
        </div>
      </section>
      <div className="container px-6 pt-3 md:px-10 xl:px-30">
        <h2 className="text-white body-sm-mobile font-semibold! font-montserrat! mb-3 md:text-headline! md:leading-headline! md:font-bold!">
          {content.description?.heading || ""}
        </h2>
        <p className="text-white body-xs md:text-body! md:leading-body!">
          {content.description?.text || ""}
        </p>
      </div>
      <div className="max-w-[1680px] w-full mx-auto md:px-4 xl:px-30 px-6 pt-12 pb-12">
        <ProcessPhases phases={phases || []} />
      </div>

      <div className="w-full pb-8 bg-white dark:bg-primary-default">
        <div className="px-6 md:px-10 xl:px-30">
          <div className="relative z-10 w-full">
            <h1 className="text-primary-default dark:text-white title-sm mb-3">{content.studentsAroundWorld?.title || ""}</h1>
            <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded"></div>
          </div>
          <div className="pt-3 md:mb-8">
            <p className="text-primary-default dark:text-white body-sm-mobile md:text-body! md:leading-body!">
              {content.studentsAroundWorld?.description || ""}
            </p>
          </div>
        </div>
        <div className="w-full">
          <WorldMap highlightedCountries={highlightedCountries || []} />
        </div>
      </div>
      <div className="md:px-4 xl:px-30 px-6 pb-12 flex justify-center">
        <Button variant="orange" onClick={() => router.push("/registration?pageKey=internationalUniversities")}>
          {content.registrationButton?.text || "Registration"}
        </Button>
      </div>
    </div>
  );
}
