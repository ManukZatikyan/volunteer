"use client";

import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="flex min-h-screen flex-col font-sans relative">
      <section className="relative w-full h-full max-h-[246px]  flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/image.png"
            alt="Center Up team"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-default via-primary-default/40 to-primary-default"></div>
        </div>
        
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 pb-10 md:pb-14 lg:pb-16">
          <h1 className="text-white font-montserrat font-bold text-6xl md:text-7xl lg:text-8xl mb-5 md:mb-6">
            About Us
          </h1>
          <div className="h-1.5 md:h-2 bg-secondary-orange-bright w-1/3 max-w-md"></div>
        </div>
      </section>
      <section className="w-full bg-primary-default py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-white font-noto-sans text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-loose">
            Center Up is an educational organization that offers diverse and innovative programs for individuals aged 8 to 24. Through Center Up&apos;s programs, young people are given the opportunity to explore different career paths, gain valuable experience, acquire new knowledge, make connections, and develop skills across various fields.
          </p>
        </div>
      </section>
    </div>
  );
}
