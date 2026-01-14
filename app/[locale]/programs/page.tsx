"use client";

import { MembershipCard } from "@/components";
import { useTranslations, useMessages, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function Programs() {
  const t = useTranslations("programs");
  const messages = useMessages();
  const programsMessages = messages.programs as any;
  const locale = useLocale();
  const router = useRouter();

  const title = t("title");
  // Split title for styling - "Choose Your" in orange, "Program" in white
  const titleMatch = title.match(/^(.+?)\s+(Program|ծրագիրը)$/i);
  const titleLine1 = titleMatch ? titleMatch[1] : title;
  const titleLine2 = titleMatch ? titleMatch[2] : null;

  // Map program titles to their routes
  const getProgramRoute = (programTitle: string): string => {
    const routeMap: Record<string, string> = {
      "Membership": "membership",
      "Center Up Junior": "centerUpJunior",
      "International Universities": "internationalUniversities",
      "Courses & Activities": "coursesAndActivities",
      "Conferences": "conferences",
      "Future Up": "futureUp",
      "Camps": "camps",
      "Event Organization": "eventOrganization",
      "Upcoming Events": "upcomingEvents",
    };
    
    // Use includes for partial matching (case-insensitive)
    const normalizedTitle = programTitle.toLowerCase();
    const route = Object.entries(routeMap).find(([key]) => 
      normalizedTitle.includes(key.toLowerCase())
    )?.[1] || "";
    
    return route ? `/programs/${route}` : "/programs";
  };

  return (
    <div className="flex flex-col md:px-10 xl:px-30 ">
      <div className=" px-6 py-6 md:py-16 xl:pb-21! xl:pt-10!">
        <h1 className="text-secondary-orange-bright font-bold text-3xl md:text-4xl lg:text-5xl mb-8 md:mb-12 text-center md:text-center">
          {titleLine2 ? (
            <>
              <span>{titleLine1}</span> <span className="text-white">{titleLine2}</span>
            </>
          ) : (
            <span className="text-white">{title}</span>
          )}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 place-items-center max-w-[1690px] mx-auto">
          {(programsMessages?.items || []).map((program: string | any, index: number) => {
            const programTitle = typeof program === "string" ? program : program.title;
            const programRoute = getProgramRoute(programTitle);
            return (
            <MembershipCard
              key={index}
                imageSrc={typeof program === "object" && program.imageSrc ? program.imageSrc : "/image.png"}
                imageAlt={programTitle}
                title={programTitle}
              onClick={() => {
                  router.push(programRoute);
              }}
            />
            );
          })}
        </div>
      </div>
    </div>
  );
}
