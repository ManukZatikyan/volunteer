"use client";

import { Input, Dropdown, Button, DatePicker } from "@/components";
import { useTranslations } from "next-intl";

interface StepInformationProps {
  formData: any;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDropdownChange: (name: string, value: string) => void;
  onLogout?: () => void;
}

export function StepInformation({
  formData,
  errors,
  onChange,
  onDropdownChange,
  onLogout,
}: StepInformationProps) {
  const t = useTranslations("registration.information");

  const cityOptions = [
    { value: "yerevan", label: t("options.yerevan") },
    { value: "gyumri", label: t("options.gyumri") },
    { value: "vanadzor", label: t("options.vanadzor") },
  ];

  return (
    <>
      {/* Email with Logout button - Full width */}
      <div className="flex items-start gap-4 mb-6 md:mb-8">
        <div className="flex-1 relative">
          <Input
            type="email"
            name="email"
            label={t("fields.email.label")}
            required
            placeholder={t("fields.email.placeholder")}
            value={formData.email}
            onChange={onChange}
            error={errors.email}
            asteriskColor="red"
            className=" md:py-6"
          />
        <div className="absolute right-5 top-4.5">
        {onLogout && (
          <Button
            variant="orange"
            type="button"
            onClick={onLogout}
            className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base mt-7 whitespace-nowrap"
          >
            {t("buttons.logout")}
          </Button>
        )}
        </div>
        </div>
      </div>

      {/* Two-column layout for other fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Name */}
          <Input
            type="text"
            name="name"
            label={t("fields.name.label")}
            required
            placeholder={t("fields.name.placeholder")}
            value={formData.name}
            onChange={onChange}
            error={errors.name}
            asteriskColor="red"
            className=""
          />

          {/* Phone */}
          <Input
            type="tel"
            name="phone"
            label={t("fields.phone.label")}
            required
            placeholder={t("fields.phone.placeholder")}
            value={formData.phone}
            onChange={onChange}
            error={errors.phone}
            asteriskColor="red"
            className=""
          />

          {/* Age with DatePicker */}
          <DatePicker
            label={t("fields.age.label")}
            placeholder={t("fields.age.placeholder")}
            value={formData.age}
            onChange={(date) => {
              // Create a synthetic event to match the onChange signature
              const syntheticEvent = {
                target: { name: "age", value: date },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }}
            className=""
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Surname */}
          <Input
            type="text"
            name="surname"
            label={t("fields.surname.label")}
            required
            placeholder={t("fields.surname.placeholder")}
            value={formData.surname}
            onChange={onChange}
            error={errors.surname}
            asteriskColor="red"
            className=""
          />

          {/* Instagram */}
          <Input
            type="text"
            name="instagram"
            label={t("fields.instagram.label")}
            placeholder={t("fields.instagram.placeholder")}
            value={formData.instagram}
            onChange={onChange}
            className=""
          />

          {/* City and Country of Birth with Dropdown */}
          <Dropdown
            label={t("fields.cityAndCountry.label")}
            placeholder={t("fields.cityAndCountry.placeholder")}
            value={formData.cityAndCountry}
            options={cityOptions}
            onChange={(value) => onDropdownChange("cityAndCountry", value)}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}
