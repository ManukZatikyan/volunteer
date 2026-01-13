"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ContentCard } from "../molecule/ContentCard";
import { useTranslations, useMessages } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "../atom/Button";

export const CampInternationalContent: React.FC = ({}) => {
  const t = useTranslations("camp.internationalCamp");
  const messages = useMessages();
  const campMessages = messages.camp as any;
  const router = useRouter();

  return (
    <div className={cn("w-full py-12 px-6 bg-primary-light rounded-t-3xl")}>
      {/* Benefits Section */}
      <div className="container px-6">
        <h2 className="text-center title-sm mb-3">
          {t("title")}
        </h2>
        <p className="text-white body-xs">
          {t("description")}
        </p>
      </div>
      <div className="container flex flex-col gap-6">
        {(campMessages?.internationalCamp?.descriptionItems || []).map((item: any, index: number) => (
          <ContentCard
            key={index}
            title={item.heading}
            imageSrc={item.imageSrc}
            content={item.text}
          />
        ))}
      </div>
      <div className="container flex justify-center">
        <Button variant="orange" onClick={() => router.push("/registration")}>
          {t("buttonText")}
        </Button>
      </div>
    </div>
  );
};
