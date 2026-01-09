"use client";

import {
  Button,
  Card,
  Carousel,
  EventCard,
} from "@/components";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useTranslations, useMessages } from "next-intl";
import { useState, useEffect } from "react";

export default function Home() {
  const t = useTranslations("home");
  const messages = useMessages();
  const homeMessages = messages.home as any;
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(window.innerWidth >= 768 ? 2 : 1);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex flex-col font-sans relative">
      <section className="relative w-full h-[618px] md:h-[700px] lg:h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Center Up"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary-default/80"></div>
        </div>
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:hero font-bold mb-6 md:mb-8 lg:mb-2 leading-tight">
            <span className="hero-title-line1 block md:inline">
              {t("heroSection.title.line1")}
            </span>
            <span className="hero-title-line2 block md:inline"> {t("heroSection.title.line2")}</span>
            <span className="hero-title-line3 block md:inline">
              {" "}{t("heroSection.title.line3")}
            </span>
          </h1>
          <div className="space-y-4 md:space-y-5 mb-6 md:mb-8 lg:mb-10 max-w-4xl mx-auto">
            <p className="text-white! text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed hidden md:block">
              {t("heroSection.description1")}
            </p>
            <p className="text-white! text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
              {t("heroSection.description2")}
            </p>
          </div>
          <div className="flex justify-center">
            <Button variant="orange" className="text-base md:text-lg px-8 md:px-10 py-3 md:py-4">
              {t("heroSection.buttonText")}
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full flex py-3 bg-primary-default dark:bg-white xl:py-7.5">
        <Marquee direction="right" className="flex gap-6">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((partner) => (
            <div
              key={partner.toString()}
              className="ml-3 flex items-center gap-3"
            >
              <div className="w-1 h-1 bg-white dark:bg-primary-default rounded-full"></div>
              <div className="text-white dark:text-primary-default subtitle">Center Up</div>
            </div>
          ))}
        </Marquee>
      </section>

      <section className="w-full px-6 pt-12 xl:px-30 xl:pt-24">
        <div className="">
          <div className="mb-6">
            <h2 className="text-white title-sm mb-3 text-center xl:mb-12 xl:text-title! xl:leading-title!">
              <span className="text-secondary-orange-bright">{t("upcomingEvents.title").split(" ")[0]}</span>
              <span className="text-white"> {t("upcomingEvents.title").split(" ").slice(1).join(" ")}</span>
            </h2>
          </div>

          <Carousel
            testimonials={homeMessages?.upcomingEvents?.events || []}
            autoPlay={false}
            slidesToShow={slidesToShow}
            renderItem={(testimonial) => {
              const item = testimonial as any;
              return (
                <EventCard
                  title={item.title}
                  description={item.description}
                  imageSrc="/image.png"
                  imageAlt={item.title}
                  onClick={() => {}}
                />
              );
            }}
          />
        </div>
      </section>

      <section className="w-full px-6 py-12 xl:px-50 xl:py-32">
        <div className="">
          <div className="mb-6">
            <h2 className="text-white title-sm mb-3 text-center xl:mb-12 xl:text-title! xl:leading-title!">
              <span className="text-secondary-orange-bright">{t("mission.title").split(" ")[0]}</span>
              <span className="text-white"> {t("mission.title").split(" ").slice(1).join(" ")}</span>
            </h2>
          </div>
          <div className="text-white body-xs space-y-1 xl:text-subtitle! xl:leading-subtitle!">
            <p>{t("mission.openingStatement")}</p>
            <p>{t("mission.beliefStatement")}</p>
            <ul className="list-none pl-0 space-y-1">
              {(homeMessages?.mission?.bullets || []).map((bullet: string, index: number) => (
                <li key={index} className="relative pl-6">
                  <span className="absolute left-0 text-xl leading-tight">
                    •
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
            <p>{t("mission.concludingStatement")}</p>
          </div>
        </div>
      </section>

      <section className="w-full px-6 pb-12 xl:px-12 xl:pb-24 xl:px-30">
        <div className="">
          <div className="mb-6">
            <h2 className="text-white title-sm mb-3 text-center xl:mb-12 xl:text-title! xl:leading-title!">
              <span className="text-secondary-orange-bright">{t("programs.title").split(" ")[0]}</span>
              <span className="text-white"> {t("programs.title").split(" ").slice(1).join(" ")}</span>
            </h2>
          </div>
          
          {/* Mobile Carousel */}
          <div className="block xl:hidden">
            <Carousel
              testimonials={homeMessages?.programs?.items || []}
              autoPlay={false}
              renderItem={(testimonial) => {
                const item = testimonial as any;
                return (
                  <Card
                    imageSrc="/image.png"
                    imageAlt={item.title}
                    title={item.title}
                    description={item.description}
                  />
                );
              }}
            />
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden xl:block w-full">
            <div className="grid grid-cols-4 gap-6 mb-12 w-full">
              {(homeMessages?.programs?.items || []).slice(0, 4).map((item: any, index: number) => (
                <Card
                  key={index}
                  imageSrc="/image.png"
                  imageAlt={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
            {(homeMessages?.programs?.items || []).length > 3 && (
              <div className="flex justify-center">
                <Button variant="white" className="px-8 py-3">
                  View all programs
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
