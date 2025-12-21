"use client";

import { useState } from "react";
import { CampTab, CampArmenianContent } from "@/components";
import { CampInternationalContent } from "@/components/organizm/CampInternationalContent";
import { useMessages } from "next-intl";

export default function CampPage() {
  const messages = useMessages();
  const campMessages = messages.camp as any;
  const [activeCampId, setActiveCampId] = useState<string>("armenian");

  const handleTabChange = (id: string) => {
    setActiveCampId(id);
  };

  // Add imageSrc and imageAlt to tabs from translations
  const tabsWithImages = (campMessages?.tabs || []).map((tab: any) => ({
    ...tab,
    imageSrc: tab.imageSrc || "/image.png",
    imageAlt: tab.imageAlt || tab.label,
  }));

  return (
    <div className="bg-primary-default py-8 md:py-12">
      <div className="w-full">
        <CampTab
          items={tabsWithImages}
          defaultActiveId={activeCampId}
          onTabChange={handleTabChange}
        />
        <div className="-mt-5">
          {activeCampId === "armenian" ? <CampArmenianContent /> : <CampInternationalContent />}
        </div>
      </div>
    </div>
  );
}
