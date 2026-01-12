"use client";

import { Input, Dropdown } from "@/components";
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
        <div className="flex-1">
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
            className="rounded-lg border-white [&>label]:text-white"
          />
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="bg-secondary-orange-bright text-white rounded-lg px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold mt-7 hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {t("buttons.logout")}
          </button>
        )}
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
            className="rounded-lg border-white [&>label]:text-white"
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
            className="rounded-lg border-white [&>label]:text-white"
          />

          {/* Age with Calendar icon */}
          <div className="relative w-full">
            <Input
              type="text"
              name="age"
              label={t("fields.age.label")}
              placeholder={t("fields.age.placeholder")}
              value={formData.age}
              onChange={onChange}
              className="rounded-lg border-white [&>label]:text-white [&>input]:pr-12"
            />
            <div className="absolute right-3 top-9 md:top-10 pointer-events-none z-10">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2V4M14 2V4M3 6H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z"
                  stroke="#FFA008"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
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
            className="rounded-lg border-white [&>label]:text-white"
          />

          {/* Instagram */}
          <Input
            type="text"
            name="instagram"
            label={t("fields.instagram.label")}
            placeholder={t("fields.instagram.placeholder")}
            value={formData.instagram}
            onChange={onChange}
            className="rounded-lg border-white [&>label]:text-white"
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
