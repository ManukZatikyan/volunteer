"use client";

import { useState } from "react";
import { CampTab, CampArmenianContent } from "@/components";
import { CampInternationalContent } from "@/components/organizm/CampInternationalContent";
import { campTabs } from "@/data/camp";

export default function CampPage() {
  const [activeCampId, setActiveCampId] = useState<string>("armenian");

  const handleTabChange = (id: string) => {
    setActiveCampId(id);
  };

  return (
    <div className="bg-primary-default py-8 md:py-12">
      <div className="w-full">
        <CampTab
          items={campTabs}
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
