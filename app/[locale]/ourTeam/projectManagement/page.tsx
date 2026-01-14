"use client";
import { useState, useEffect } from "react";
import { MarketingProfileCard, Loading } from "@/components";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useLoopedLoading } from "@/lib/useLoopedLoading";

export default function ProjectManagement() {
  const locale = useLocale();
  const [content, setContent] = useState<any>(null);
  const { loading, stopLoading } = useLoopedLoading({
    initiallyLoading: true,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Note: 'projectManagement' might not be a valid pageKey, using 'ourTeam' as fallback
        const response = await fetch(`/api/content/ourTeam?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          // Extract projectManagement content from ourTeam response
          setContent(data.content?.projectManagement || data.content);
        }
      } catch (error) {
        console.error("Error fetching projectManagement content:", error);
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
            alt="Project Management"
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
          <div className="mb-3 xl:mb-6!">
            <h2 className="text-white subtitle mb-3 md:text-headline! md:leading-headline! xl:text-title! xl:leading-title! xl:mb-6! xl:font-bold!">
              {content.headOfDepartment?.title || ""}
            </h2>
            <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded" />
          </div>
          <MarketingProfileCard
            name={content?.headOfDepartment?.name || ""}
            description={content?.headOfDepartment?.description || ""}
            imageSrc={content?.headOfDepartment?.imageSrc || "/user.png"}
            imageAlt={content?.headOfDepartment?.imageAlt || ""}
            imagePosition={content?.headOfDepartment?.imagePosition || "left"}
            socialLinks={content?.headOfDepartment?.socialLinks || []}
          />
        </div>
      </div>
      <div className="px-6 md:px-10 xl:px-30 py-12">
        <div className="flex flex-col gap-6 md:gap-8 xl:gap-12">
          <div className="mb-3 xl:mb-6!">
            <h2 className="text-white subtitle mb-3 md:text-headline! md:leading-headline! xl:text-title! xl:leading-title! xl:mb-6! xl:font-bold!">
              {content.members?.title || ""}
            </h2>
            <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded" />
          </div>
          <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:place-items-center gap-6 lg:gap-y-[48px]">
            {(content?.members?.items || []).map((member: any, index: number) => (
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

