"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface MissionVisionItem {
  heading: string;
  paragraphs: string[];
  bullets: string[];
}

export interface MissionVisionProps {
  title: string;
  mission: MissionVisionItem;
  vision: MissionVisionItem;
  className?: string;
}

const ContentCard: React.FC<{ item: MissionVisionItem }> = ({ item }) => (
  <div className="bg-primary-light rounded-3xl p-3 md:p-8">
    <h3 className="text-white font-montserrat font-bold text-xl md:text-2xl mb-4">
      {item.heading}
    </h3>
    <div className="space-y-4">
      {item.paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-white body-xs"
        >
          {paragraph}
        </p>
      ))}
      {item.bullets.length > 0 && (
        <ul className="list-none space-y-2 pl-4">
          {item.bullets.map((bullet, index) => (
            <li
              key={index}
              className="text-white body-xs flex items-start"
            >
              <span className="mr-2 w-1 h-1 rounded-full bg-text-white mt-2 shrink-0"></span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
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
    <section className={cn("w-full p-6", className)}>
      <div className=" flex flex-col gap-3">
        <div>
          <h2 className="text-white subtitle mb-3">
            {title}
          </h2>
          <div className="h-1 md:h-2 bg-secondary-orange-bright w-full rounded"></div>
        </div>
        <div className="space-y-3">
          <ContentCard item={mission} />
          <ContentCard item={vision} />
        </div>
      </div>
    </section>
  );
};
