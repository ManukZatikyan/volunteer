"use client";

import { Dropdown, Textarea } from "@/components";
import { useTranslations, useMessages } from "next-intl";

interface StepMotivationProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDropdownChange: (name: string, value: string) => void;
}

export function StepMotivation({
  formData,
  errors,
  onChange,
  onDropdownChange,
}: StepMotivationProps) {
  const t = useTranslations("registration.motivation");
  const messages = useMessages();
  const motivationMessages = messages.registration?.motivation as any;

  return (
    <div className="mb-6">
      <h2 className="text-white dark:text-white font-semibold text-lg md:text-[32px] leading-[24px] mb-6">
        {t("sections.centerUp")}
      </h2>
      <div className="flex flex-col gap-6">
        {/* Question 1: Why join team */}
        <Textarea
          name="whyJoinTeam"
          label={t("fields.whyJoinTeam.label")}
          placeholder={t("fields.whyJoinTeam.placeholder")}
          value={formData.whyJoinTeam}
          onChange={onChange}
          rows={4}
          className=""
        />

        {/* Question 2: Explain volunteering */}
        <Textarea
          name="explainVolunteering"
          label={t("fields.explainVolunteering.label")}
          placeholder={t("fields.explainVolunteering.placeholder")}
          value={formData.explainVolunteering}
          onChange={onChange}
          rows={4}
          className=""
        />

        {/* Question 3 and 4: Side by side dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Interested Programs */}
          <Dropdown
            label={t("fields.interestedPrograms.label")}
            placeholder={t("fields.interestedPrograms.placeholder")}
            value={formData.interestedPrograms}
            options={motivationMessages?.fields?.interestedPrograms?.options || [
              { value: "membership", label: "Membership" },
              { value: "junior", label: "Center Up Junior" },
              { value: "future", label: "Future Up" },
              { value: "other", label: "Other" }
            ]}
            onChange={(value) => onDropdownChange("interestedPrograms", value)}
            className="w-full flex flex-col justify-between"
          />

          {/* Member or Leader */}
          <Dropdown
            label={t("fields.memberOrLeader.label")}
            placeholder={t("fields.memberOrLeader.placeholder")}
            value={formData.memberOrLeader}
            options={motivationMessages?.fields?.memberOrLeader?.options || [
              { value: "member", label: "Member" },
              { value: "leader", label: "Leader" }
            ]}
            onChange={(value) => onDropdownChange("memberOrLeader", value)}
            className="w-full flex flex-col justify-between"
          />
        </div>

        {/* Question 5: Leader skills */}
        <Textarea
          name="leaderSkills"
          label={t("fields.leaderSkills.label")}
          placeholder={t("fields.leaderSkills.placeholder")}
          value={formData.leaderSkills}
          onChange={onChange}
          rows={4}
          className=""
        />
      </div>
    </div>
  );
}
