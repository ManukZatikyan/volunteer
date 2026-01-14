"use client";
import { useState, useEffect } from "react";
import { MarketingProfileCard, Loading } from "@/components";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useLoopedLoading } from "@/lib/useLoopedLoading";

export default function Founder() {
  const locale = useLocale();
  const [content, setContent] = useState<any>(null);
  const { loading, stopLoading } = useLoopedLoading({
    initiallyLoading: true,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Note: 'founder' might not be a valid pageKey, using 'ourTeam' as fallback
        const response = await fetch(`/api/content/ourTeam?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          // Extract founder content from ourTeam response
          setContent(data.content?.founder || data.content);
        }
      } catch (error) {
        console.error("Error fetching founder content:", error);
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
      <section className="relative w-full h-[246px] sm:h-[400px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Founder"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-default/60 via-transparent to-white dark:from-primary-default/95 dark:via-primary-default/40 dark:to-primary-default"></div>
        </div>

        <div className="relative z-10 w-full px-6 ">
          <h1 className="text-white title-sm mb-3 md:text-center md:text-hero! md:text-secondary-orange-bright! md:mb-12!">
            {content.heroSection?.title || ""}
          </h1>
          <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded md:hidden"></div>
        </div>
      </section>
      <div className="px-6 md:px-10 xl:px-30 pt-3 md:pt-6 xl:pt-12">
        <h2 className="text-white body-sm-mobile md:text-subtitle! md:leading-subtitle! font-semibold! font-montserrat! mb-3 md:mb-6">
          {content.description?.heading || ""}
        </h2>
        <p className="text-white body-xs md:text-subtitle! md:leading-subtitle!">
          {content.description?.text || ""}
        </p>
      </div>
      <div className="px-6 md:px-10 xl:px-30 pt-12">
        <div className="flex flex-col gap-6">
          {content?.members?.items?.[0] && (
            <MarketingProfileCard
              name={content.members.items[0].name || ""}
              description={content.members.items[0].description || ""}
              imageSrc={content.members.items[0].imageSrc || "/user.png"}
              imageAlt={content.members.items[0].imageAlt || ""}
              imagePosition={content.members.items[0].imagePosition || "left"}
              socialLinks={content.members.items[0].socialLinks || []}
            />
          )}
        </div>
      </div>
      <div className="px-6 md:px-10 xl:px-30 pt-12 pb-30">
        <p className="text-white body-xs md:text-subtitle! md:leading-subtitle!">
          {content.text || ""}
        </p>
      </div>
    </div>
  );
}

