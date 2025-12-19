"use client";

import { ProfileCard, ProfileCardHorizontal } from "@/components";
import { description, departments, founder, heroSection } from "@/data/ourTeam";
import Image from "next/image";

export default function OurTeam() {
  return (
    <div className="flex flex-col font-sans relative">
      <section className="relative w-full  h-[246px] sm:h-[400px]  flex items-end">
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

        <div className="relative z-10 w-full px-6 ">
          <h1 className="text-white title-sm mb-3">{heroSection.title}</h1>
          <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
      </section>
      <section className="w-full flex flex-col items-center justify-center gap-6 px-6 mb-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-white body-xs mt-3">
            {description.text}
          </p>
        </div>
        </section>
      
      <section className="w-full p-6 pb-3!">
        <div className="mb-6">
          <h2 className="text-white title-sm mb-3">{founder.title}</h2>
          <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
        <ProfileCardHorizontal
          name={founder.name}
          biography={founder.biography}
          imageSrc={founder.imageSrc}
          imageAlt={founder.imageAlt}
          buttonText={founder.buttonText}
          onClick={() => {}}
          className="w-full max-w-[400px] mb-12"
        />
        <div>
          <h2 className="text-white title-sm mb-6">{departments.title}</h2>
        </div>
        <div className="flex flex-col gap-6">
          {departments.items.map((department, index) => (
            <ProfileCard
              key={index}
              name={department.name}
              biography={department.biography}
              imageSrc={department.imageSrc}
              imageAlt={department.imageAlt}
              onClick={() => {}}
              className="w-full max-w-[400px]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
