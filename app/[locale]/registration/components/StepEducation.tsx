"use client";

import { Dropdown, Textarea } from "@/components";
import { useTranslations, useMessages } from "next-intl";

interface StepEducationProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDropdownChange: (name: string, value: string) => void;
}

export function StepEducation({
  formData,
  errors,
  onChange,
  onDropdownChange,
}: StepEducationProps) {
  const t = useTranslations("registration.education");
  const messages = useMessages();
  const educationMessages = messages.registration?.education as any;

  return (
    <>
      {/* Education Section */}
      <div className="mb-8 md:mb-9">
        <h2 className="text-white dark:text-white font-semibold text-lg md:text-[32px] leading-[24px] mb-6 mt-4">
          {t("sections.education")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Education */}
          <Dropdown
            label={t("fields.education.label")}
            placeholder={t("fields.education.placeholder")}
            value={formData.education}
            options={educationMessages?.fields?.education?.options || [
              { value: "high_school", label: "High School" },
              { value: "bachelor", label: "Bachelor's Degree" },
              { value: "master", label: "Master's Degree" },
              { value: "phd", label: "PhD" }
            ]}
            onChange={(value) => onDropdownChange("education", value)}
            className="w-full flex flex-col justify-between"
          />

          {/* University */}
          <Dropdown
            label={t("fields.university.label")}
            placeholder={t("fields.university.placeholder")}
            value={formData.university}
            options={educationMessages?.fields?.university?.options || [
              { value: "yerevan_state", label: "Yerevan State University" },
              { value: "aua", label: "American University of Armenia" },
              { value: "other", label: "Other" }
            ]}
            onChange={(value) => onDropdownChange("university", value)}
            className="w-full flex flex-col justify-between"
          />
        </div>
      </div>

      {/* Center Up Section */}
      <div className="mb-6">
        <h2 className="ext-white font-semibold text-lg md:text-[32px] leading-[24px] mb-6">
          {t("sections.centerUp")}
        </h2>
        <div className="flex flex-col gap-6">
          {/* First Application */}
          <Dropdown
            label={t("fields.firstApplication.label")}
            placeholder={t("fields.firstApplication.placeholder")}
            value={formData.firstApplication}
            options={educationMessages?.fields?.firstApplication?.options || [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" }
            ]}
            onChange={(value) => onDropdownChange("firstApplication", value)}
            className="w-full"
          />

          {/* How did you hear about Center Up and Volunteer Experience - One line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* How did you hear about Center Up */}
            <Dropdown
              label={t("fields.howDidYouHear.label")}
              placeholder={t("fields.howDidYouHear.placeholder")}
              value={formData.howDidYouHear}
              options={educationMessages?.fields?.howDidYouHear?.options || [
                { value: "social_media", label: "Social Media" },
                { value: "friend", label: "Friend" },
                { value: "website", label: "Website" },
                { value: "other", label: "Other" }
              ]}
              onChange={(value) => onDropdownChange("howDidYouHear", value)}
              className="w-full"
            />

            {/* Volunteer Experience */}
            <Dropdown
              label={t("fields.volunteerExperience.label")}
              placeholder={t("fields.volunteerExperience.placeholder")}
              value={formData.volunteerExperience}
              options={educationMessages?.fields?.volunteerExperience?.options || [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" }
              ]}
              onChange={(value) => onDropdownChange("volunteerExperience", value)}
              className="w-full"
            />
          </div>

          {/* Volunteer Description */}
          <Textarea
            name="volunteerDescription"
            label={t("fields.volunteerDescription.label")}
            placeholder={t("fields.volunteerDescription.placeholder")}
            value={formData.volunteerDescription}
            onChange={onChange}
            rows={4}
            className=""
          />
        </div>
      </div>
    </>
  );
}
