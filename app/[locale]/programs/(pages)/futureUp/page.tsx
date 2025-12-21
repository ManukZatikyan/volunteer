"use client";

import { Button, ContentCard, Carousel, TestimonialCard } from "@/components";
import { useTranslations, useMessages } from "next-intl";
import { futureUpTestimonials, type Testimonial } from "@/data/testimonials";
import Image from "next/image";

export default function FutureUp() {
  const t = useTranslations("futureUp");
  const messages = useMessages();
  const futureUpMessages = messages.futureUp as any;

  return (
    <div className="flex flex-col bg-black">
      <section className="relative w-full h-[246px] sm:h-[400px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Future Up"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-default/95 via-black/40 to-black"></div>
        </div>

        <div className="relative z-10 w-full px-6">
          <h1 className="text-white title-sm mb-3">{t("heroSection.title")}</h1>
          <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
      </section>
      <div className="px-6 pt-3">
        <h2 className="text-white body-sm-mobile font-semibold! font-montserrat! mb-3">
          {t("description.heading")}
        </h2>
        <p className="text-white body-xs">{t("description.text")}</p>
      </div>
      <div className="container mx-auto px-6 pt-12 pb-12">
        <div className="flex flex-col gap-6">
          {(futureUpMessages?.descriptionItems || []).map((item: any, index: number) => (
            <ContentCard
              key={index}
              title={item.heading}
              imageSrc={item.imageSrc}
              content={item.text}
            />
          ))}
        </div>
      </div>
      {futureUpTestimonials.length > 0 && (
        <section className="w-full py-12 md:py-16 flex flex-col gap-6">
          <div className="relative z-10 w-full px-6">
            <h2 className="text-white subtitle font-bold mb-3">
              {t("testimonialsSection.title")}
            </h2>
            <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
          </div>
          <div className="container mx-auto px-6">
            <Carousel
              testimonials={futureUpTestimonials}
              autoPlay={false}
              renderItem={(testimonial) => {
                const item = testimonial as Testimonial;
                return (
                  <TestimonialCard
                    imageSrc={item.imageSrc}
                    imageAlt={item.imageAlt}
                    name={item.name}
                    role={item.role}
                    quote={item.quote}
                  />
                );
              }}
            />
          </div>
        </section>
      )}
      <div className="container mx-auto px-6 pb-12 flex justify-center">
        <Button variant="orange">{t("registrationButton.text")}</Button>
      </div>
    </div>
  );
}
