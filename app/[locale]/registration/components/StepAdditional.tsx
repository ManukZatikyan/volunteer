"use client";

import { Textarea } from "@/components";
import { useTranslations } from "next-intl";

interface StepAdditionalProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function StepAdditional({
  formData,
  errors,
  onChange,
}: StepAdditionalProps) {
  const t = useTranslations("registration.additional");

  return (
    <div className="mb-6">
      <h2 className="text-white font-semibold text-lg md:text-[32px] leading-[24px] mb-6">
        {t("sections.centerUp")}
      </h2>
      <div className="flex flex-col gap-6">
        {/* Additional Info Label */}
        <div className="text-white font-noto-sans! text-base md:text-lg mb-2">
          {t("fields.additionalInfo.label")}
        </div>

        {/* Additional Info Textarea */}
        <Textarea
          name="additionalInfo"
          placeholder={t("fields.additionalInfo.placeholder")}
          value={formData.additionalInfo}
          onChange={onChange}
          rows={8}
          className="rounded-lg border-white [&>label]:text-white"
        />
      </div>
    </div>
  );
}
