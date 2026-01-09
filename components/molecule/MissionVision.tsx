"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface MissionVisionItem {
  heading: string;
  paragraphs: string[];
  bullets: string[];
  text?: string;
}

export interface MissionVisionProps {
  title: string;
  mission: MissionVisionItem;
  vision: MissionVisionItem;
  className?: string;
}

const ContentCard: React.FC<{ item: MissionVisionItem }> = ({ item }) => (
  <div className="bg-primary-light rounded-3xl p-3 md:p-8 md:flex-1">
    <h3 className="text-white font-montserrat font-bold text-xl md:text-headline! md:leading-headline! mb-4">
      {item.heading}
    </h3>
    <div className="space-y-1">
      {item.paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-white body-xs md:text-body! md:leading-body!"
        >
          {paragraph}
        </p>
      ))}
      {item.bullets.length > 0 && (
        <ul className="list-none space-y-2 pl-4">
          {item.bullets.map((bullet, index) => (
            <li
              key={index}
              className="text-white body-xs md:text-body! md:leading-body! flex items-start"
            >
              <span className="mr-2 w-1 h-1 rounded-full bg-text-white mt-2 shrink-0"></span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {item.text && (
        <p className="text-white body-xs md:text-body! md:leading-body!">
          {item.text}
        </p>
      )}
    </div>
  </div>
);

export const MissionVision: React.FC<MissionVisionProps> = ({
  title,
  mission,
  vision,
  className,
}) => {

  return (
    <section className={cn("w-full p-6 md:px-10 xl:px-30", className)}>
      <div className="flex flex-col gap-3">
        <div className="mb-3 xl:mb-12!">
          <h2 className="text-white subtitle mb-3 md:text-headline! md:leading-headline!  xl:text-title! xl:leading-title! xl:mb-6! xl:font-bold!">
            {title}
          </h2>
          <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded"></div>
        </div>
        <div className="flex flex-col space-y-3 md:flex-row md:gap-3 md:space-y-0">
          <ContentCard item={mission} />
          <ContentCard item={vision} />
        </div>
      </div>
    </section>
  );
};
