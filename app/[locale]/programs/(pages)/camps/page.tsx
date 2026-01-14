"use client";

import { useState, useEffect } from "react";
import { CampTab, CampArmenianContent, Loading } from "@/components";
import { CampInternationalContent } from "@/components/organizm/CampInternationalContent";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useLoopedLoading } from "@/lib/useLoopedLoading";

export default function CampPage() {
  const locale = useLocale();
  const [content, setContent] = useState<any>(null);
  const [activeCampId, setActiveCampId] = useState<string>("armenian");
  const { loading, stopLoading } = useLoopedLoading({
    initiallyLoading: true,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/camps?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
        }
      } catch (error) {
        console.error("Error fetching camps content:", error);
      } finally {
        stopLoading();
      }
    };

    fetchContent();
  }, [locale, stopLoading]);

  const handleTabChange = (id: string) => {
    setActiveCampId(id);
  };

  // Add imageSrc and imageAlt to tabs from content
  const tabsWithImages = (content?.tabs || []).map((tab: any) => ({
    ...tab,
    imageSrc: tab.imageSrc || "/image.png",
    imageAlt: tab.imageAlt || tab.label,
  }));

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
      {/* Hero Section - Similar to Membership */}
      <section className="relative w-full h-[246px] sm:h-[400px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Camps"
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

      {/* Description Section - Similar to Membership */}
      <div className="px-6 pt-3 md:px-10 xl:px-30">
        <h2 className="text-white body-sm-mobile font-semibold! font-montserrat! mb-3 md:text-headline! md:leading-headline! md:font-bold!">
          {content.description?.heading || ""}
        </h2>
        <p className="text-white body-xs md:text-body! md:leading-body!">
          {content.description?.text || ""}
        </p>
      </div>

      {/* Tabs Section - Keep existing tabs */}
      <div className="bg-primary-default py-8 md:py-12">
        <div className="w-full">
          <CampTab
            items={tabsWithImages}
            defaultActiveId={activeCampId}
            onTabChange={handleTabChange}
          />
          <div className="-mt-5">
            {activeCampId === "armenian" ? <CampArmenianContent /> : <CampInternationalContent />}
          </div>
        </div>
      </div>
    </div>
  );
}
