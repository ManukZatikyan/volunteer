"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ContentCard } from "../molecule/ContentCard";
import {
  descriptionItemsArmenianCamp,
  armenianCampContent,
} from "@/data/camp";
import { Button } from "../atom/Button";

export const CampArmenianContent: React.FC = ({}) => {
  return (
    <div className={cn("w-full py-12 px-6 bg-primary-light rounded-t-3xl")}>
      {/* Benefits Section */}
      <div className="px-6">
        <h2 className="text-center title-sm mb-3">{armenianCampContent.title}</h2>
        <p className="text-white body-xs">{armenianCampContent.description}</p>
      </div>
      <div className="flex flex-col gap-6">
        {descriptionItemsArmenianCamp.map((item, index) => (
          <ContentCard
            key={index}
            title={item.heading}
            imageSrc={item.imageSrc}
            content={item.text}
          />
        ))}
      </div>
      <div className="container mx-auto flex justify-center">
        <Button variant="orange">{armenianCampContent.buttonText}</Button>
      </div>
    </div>
  );
};
