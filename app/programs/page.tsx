"use client";

import { MembershipCard, ProgramCard } from "@/components";

const programs = [
  "Membership",
  "Center Up Junior",
  "International Universities",
  "Courses & Activities",
  "Conferences",
  "Future Up",
  "Camps",
  "Event Organization",
];

export default function Programs() {
  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-6 py-6 md:py-16 lg:py-20">
        <h1 className="text-secondary-orange-bright font-bold text-3xl md:text-4xl lg:text-5xl mb-8 md:mb-12 text-center md:text-left">
          Choose Your <span className="text-white">Program</span>
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {programs.map((program, index) => (
            <MembershipCard
              key={index}
              imageSrc="/image.png"
              imageAlt={program}
              title={program}
              onClick={() => {
                console.log(`Clicked on ${program}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
