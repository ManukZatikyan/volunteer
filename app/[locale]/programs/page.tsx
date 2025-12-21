"use client";

import { MembershipCard } from "@/components";
import { useTranslations, useMessages } from "next-intl";

export default function Programs() {
  const t = useTranslations("programs");
  const messages = useMessages();
  const programsMessages = messages.programs as any;

  const title = t("title");
  // Split title for styling - "Choose Your" in orange, "Program" in white
  const titleMatch = title.match(/^(.+?)\s+(Program|ծրագիրը)$/i);
  const titleLine1 = titleMatch ? titleMatch[1] : title;
  const titleLine2 = titleMatch ? titleMatch[2] : null;

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-6 py-6 md:py-16 lg:py-20">
        <h1 className="text-secondary-orange-bright font-bold text-3xl md:text-4xl lg:text-5xl mb-8 md:mb-12 text-center md:text-left">
          {titleLine2 ? (
            <>
              <span>{titleLine1}</span> <span className="text-white">{titleLine2}</span>
            </>
          ) : (
            <span className="text-white">{title}</span>
          )}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {(programsMessages?.items || []).map((program: string | any, index: number) => {
            // Handle both string and object formats
            const programTitle = typeof program === "string" ? program : program.title;
            return (
              <MembershipCard
                key={index}
                imageSrc={typeof program === "object" && program.imageSrc ? program.imageSrc : "/image.png"}
                imageAlt={programTitle}
                title={programTitle}
                onClick={() => {
                  console.log(`Clicked on ${programTitle}`);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
