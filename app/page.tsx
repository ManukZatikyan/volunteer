"use client";

import {
  Button,
  Card,
  Carousel,
  EventCard,
} from "@/components";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import {
  heroSection,
  upcomingEvents,
  mission,
  programs,
} from "@/data/home";

export default function Home() {
  return (
    <div className="flex flex-col font-sans relative">
      <section className="relative w-full h-[618px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroSection.imageSrc}
            alt={heroSection.imageAlt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-default/95 via-primary-default/40 to-primary-default"></div>
        </div>
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="title font-bold text-white mb-3">
            <span className="text-secondary-orange-bright block">
              {heroSection.title.line1}
            </span>
            <span className="text-white block">{heroSection.title.line2}</span>
            <span className="text-secondary-orange-bright block">
              {heroSection.title.line3}
            </span>
          </h1>
          <p className="text-white body-xs w-[290px] mx-auto mb-3">
            {heroSection.description}
          </p>
          <div className="flex justify-center">
            <Button variant="orange" className="">
              {heroSection.buttonText}
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full flex py-3 bg-white">
        <Marquee direction="right" className="flex gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((partner) => (
            <div
              key={partner.toString()}
              className="ml-3 flex items-center gap-3"
            >
              <div className="w-1 h-1 bg-primary-default rounded-full"></div>
              <div className="text-primary-default subtitle">Center Up</div>
            </div>
          ))}
        </Marquee>
      </section>

      <section className="w-full px-6 pt-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-white title-sm mb-3 text-center">
              <span className="text-secondary-orange-bright">Upcoming</span>
              <span className="text-white"> Events</span>
            </h2>
          </div>

          <Carousel
            testimonials={upcomingEvents}
            autoPlay={false}
            renderItem={(testimonial) => {
              const item = testimonial as any;
              return (
                <EventCard
                  title={item.title}
                  description={item.description}
                  imageSrc={item.image}
                  imageAlt={item.title}
                  onClick={() => {}}
                />
              );
            }}
          />
        </div>
      </section>

      <section className="w-full px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-white title-sm mb-3 text-center">
              <span className="text-secondary-orange-bright">Why</span>
              <span className="text-white"> Center Up</span>
            </h2>
          </div>
          <div className="text-white body-xs space-y-6">
            <p>{mission.openingStatement}</p>
            <p>{mission.beliefStatement}</p>
            <ul className="list-none pl-0 space-y-3">
              {mission.bullets.map((bullet, index) => (
                <li key={index} className="relative pl-6">
                  <span className="absolute left-0 text-xl leading-tight">
                    •
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
            <p>{mission.concludingStatement}</p>
          </div>
        </div>
      </section>

      <section className="w-full px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-white title-sm mb-3 text-center">
              <span className="text-secondary-orange-bright">Our</span>
              <span className="text-white"> Programs</span>
            </h2>
          </div>
          <Carousel
            testimonials={programs}
            autoPlay={false}
            renderItem={(testimonial) => {
              const item = testimonial as any;
              return (
                <Card
                  imageSrc={item.image}
                  imageAlt={item.title}
                  title={item.title}
                  description={item.description}
                />
              );
            }}
          />
        </div>
      </section>
    </div>
  );
}
