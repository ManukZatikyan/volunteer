"use client";

import {
  Button,
  Card,
  Carousel,
  EventCard,
} from "@/components";
import { useTranslations, useMessages, useLocale } from "next-intl";
import { useState, useEffect } from "react";

export default function Home() {
  const t = useTranslations("home");
  const messages = useMessages();
  const locale = useLocale();
  const homeMessages = messages.home as any;
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(window.innerWidth >= 768 ? 2 : 1);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch content from API
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/home?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          const content = data.content;
          if (content) {
            // Use API content if available
            // Handle both structures: direct arrays (from data files) or nested (from messages)
            if (content.upcomingEvents && Array.isArray(content.upcomingEvents)) {
              setUpcomingEvents(content.upcomingEvents);
            } else if (content.upcomingEvents?.events && Array.isArray(content.upcomingEvents.events)) {
              setUpcomingEvents(content.upcomingEvents.events);
            } else {
              setUpcomingEvents(homeMessages?.upcomingEvents?.events || []);
            }
            
            if (content.programs && Array.isArray(content.programs)) {
              setPrograms(content.programs);
            } else if (content.programs?.items && Array.isArray(content.programs.items)) {
              setPrograms(content.programs.items);
            } else {
              setPrograms(homeMessages?.programs?.items || []);
            }
          } else {
            // Fallback to messages
            setUpcomingEvents(homeMessages?.upcomingEvents?.events || []);
            setPrograms(homeMessages?.programs?.items || []);
          }
        } else {
          // Fallback to messages on error
          setUpcomingEvents(homeMessages?.upcomingEvents?.events || []);
          setPrograms(homeMessages?.programs?.items || []);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        // Fallback to messages on error
        setUpcomingEvents(homeMessages?.upcomingEvents?.events || []);
        setPrograms(homeMessages?.programs?.items || []);
      }
    };

    fetchContent();
  }, [locale, homeMessages]);
  return (
    <div className="flex flex-col font-sans relative">
      <section className="w-full px-6 pt-12 xl:px-30 xl:pt-24">
        <div className="">
          <div className="mb-6">
            <h2 className="text-white title-sm mb-3 text-center xl:mb-12 xl:text-title! xl:leading-title!">
              <span className="text-secondary-orange-bright">{t("upcomingEvents.title").split(" ")[0]}</span>
              <span className="text-white"> {t("upcomingEvents.title").split(" ").slice(1).join(" ")}</span>
            </h2>
          </div>

          <Carousel
            testimonials={upcomingEvents}
            autoPlay={false}
            slidesToShow={slidesToShow}
            renderItem={(testimonial) => {
              const item = testimonial as any;
              return (
                <EventCard
                  title={item.title}
                  description={item.description}
                  imageSrc={item.image || "/image.png"}
                  imageAlt={item.title}
                  onClick={() => {}}
                />
              );
            }}
          />
        </div>
      </section>

      <section className="w-full px-6 pb-12 pt-12 xl:px-12 xl:pb-24 xl:pt-24 xl:px-30">
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
              testimonials={programs}
              autoPlay={false}
              renderItem={(testimonial) => {
                const item = testimonial as any;
                return (
                  <Card
                    imageSrc={item.image || "/image.png"}
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
              {programs.slice(0, 4).map((item: any, index: number) => (
                <Card
                  key={index}
                  imageSrc={item.image || "/image.png"}
                  imageAlt={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
            {programs.length > 3 && (
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
