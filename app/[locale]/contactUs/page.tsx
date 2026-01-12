"use client";

import { useState } from "react";
import { Button, Input, Textarea, Icon } from "@/components";
import { useTranslations, useMessages } from "next-intl";
import { socialMediaLinks, mapEmbed } from "@/data/contactUs";

export default function ContactUs() {
  const t = useTranslations("contactUs");
  const messages = useMessages();
  const contactUsMessages = messages.contactUs as any;

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t("formErrors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("formErrors.emailInvalid");
    }

    if (!formData.fullName) {
      newErrors.fullName = t("formErrors.fullNameRequired");
    }

    if (!formData.phone) {
      newErrors.phone = t("formErrors.phoneRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="min-h-screen contact-us-page p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Mobile Layout - Keep unchanged */}
        <div className="md:hidden">
          <div className="mb-12 text-center">
            <h1 className="hero-sm text-center mb-3">
              <span className="text-primary-default dark:text-white">{t("headerSection.title.line1")}</span>{" "}
              <span className="text-[#FFA62B]">{t("headerSection.title.line2")}</span>
            </h1>
            <p className="body-sm-mobile text-start font-montserrat! font-semibold! text-primary-default dark:text-white">
              {t("headerSection.description")}
            </p>
          </div>

          <div className="mb-16">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
              <Input
                type="email"
                name="email"
                label={t("formFields.email.label")}
                required
                placeholder={t("formFields.email.placeholder")}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className=""
              />

              <Input
                type="text"
                name="fullName"
                label={t("formFields.fullName.label")}
                required
                placeholder={t("formFields.fullName.placeholder")}
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                className=""
              />

              <Input
                type="tel"
                name="phone"
                label={t("formFields.phone.label")}
                required
                placeholder={t("formFields.phone.placeholder")}
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                className=""
              />

              <Textarea
                name="message"
                label={t("formFields.message.label")}
                placeholder={t("formFields.message.placeholder")}
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className=""
              />
              <div className="flex items-center justify-center">
                <Button variant="orange" className="px-[73px]">
                  {t("formButton.text")}
                </Button>
              </div>
            </form>
          </div>

          <div className="p-6">
            <h2 className="hero-sm text-center mb-6">
              <span className="text-primary-default! dark:text-white">{t("socialMediaSection.title.line1")}</span>{" "}
              <span className="text-[#FFA62B]">{t("socialMediaSection.title.line2")}</span>
            </h2>

            <div className="flex justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary-default! dark:text-white">
                  <Icon
                    name="phone"
                    size={32}
                    className="text-primary-default! dark:text-white shrink-0"
                  />
                  <span className="body-sm-mobile font-semibold!">{contactUsMessages?.contactInfo?.phone}</span>
                </div>
                <div className="flex items-center gap-4 text-primary-default! dark:text-white">
                  <Icon
                    name="email"
                    size={32}
                    className="text-primary-default! dark:text-white shrink-0"
                  />
                  <span className="body-sm-mobile font-semibold!">{contactUsMessages?.contactInfo?.email}</span>
                </div>
                <div className="flex items-center gap-4 text-primary-default! dark:text-white">
                  <Icon
                    name="location"
                    size={32}
                    className="text-primary-default! dark:text-white shrink-0"
                  />
                  <span className="body-sm-mobile font-semibold!">{contactUsMessages?.contactInfo?.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {socialMediaLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=""
                    aria-label={social.ariaLabel}
                  >
                    <Icon
                      name={social.name as any}
                      size={42}
                      className="text-primary-default! dark:text-white"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full p-6">
            <div className="rounded-xl overflow-hidden border-2 border-primary-default/20 dark:border-white/20">
              <iframe
                src={mapEmbed.src}
                width={mapEmbed.width}
                height={mapEmbed.height}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two Column */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
          {/* Left Column - Contact Form */}
          <div className="flex flex-col">
            <div className="mb-6 lg:mb-8">
              <h1 className="hero-sm mb-3 lg:mb-4">
                <span className="text-primary-default dark:text-white">{t("headerSection.title.line1")}</span>{" "}
                <span className="text-secondary-orange-bright">{t("headerSection.title.line2")}</span>
              </h1>
              <p className="body-sm-mobile font-montserrat! font-semibold! text-primary-default dark:text-white">
                {t("headerSection.description")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
              <Input
                type="email"
                name="email"
                label={t("formFields.email.label")}
                required
                placeholder={t("formFields.email.placeholder")}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className=""
              />

              <Input
                type="text"
                name="fullName"
                label={t("formFields.fullName.label")}
                required
                placeholder={t("formFields.fullName.placeholder")}
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                className=""
              />

              <Input
                type="tel"
                name="phone"
                label={t("formFields.phone.label")}
                required
                placeholder={t("formFields.phone.placeholder")}
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                className=""
              />

              <Textarea
                name="message"
                label={t("formFields.message.label")}
                placeholder={t("formFields.message.placeholder")}
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className=""
              />

              <Button variant="orange" className="w-full md:w-auto">
                {t("formButton.text")}
              </Button>
            </form>
          </div>

          {/* Right Column - Orange Box with Social Media */}
          <div className="bg-secondary-orange-bright rounded-3xl p-6 lg:p-8 flex flex-col gap-6 lg:gap-8">
            {/* Top Section: Title and Content */}
            <div className="flex flex-col gap-6 lg:gap-8">
              {/* Social Media Title */}
              <h2 className="text-title text-primary-default! font-bold">
                <span className="text-primary-default!">{t("socialMediaSection.title.line1")}</span>{" "}
                <span className="text-primary-default!">{t("socialMediaSection.title.line2")}</span>
              </h2>

              {/* Contact Info and Social Media Icons - Side by Side */}
              <div className="flex flex-row gap-6 lg:gap-8 items-start">
                {/* Contact Details - Left */}
                <div className="flex-1 space-y-4 lg:space-y-6">
                  <div className="flex items-center gap-4">
                    <Icon
                      name="phone"
                      size={32}
                      className="text-primary-default! shrink-0"
                    />
                    <span className="body-sm-mobile font-semibold! text-primary-default!">
                      {contactUsMessages?.contactInfo?.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Icon
                      name="email"
                      size={32}
                      className="text-primary-default! shrink-0"
                    />
                    <span className="body-sm-mobile font-semibold! text-primary-default!">
                      {contactUsMessages?.contactInfo?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Icon
                      name="location"
                      size={32}
                      className="text-primary-default! shrink-0"
                    />
                    <span className="body-sm-mobile font-semibold! text-primary-default!">
                      {contactUsMessages?.contactInfo?.location}
                    </span>
                  </div>
                </div>

                {/* Social Media Icons - Right - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4 h-fit shrink-0">
                  {socialMediaLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center hover:opacity-90 transition-opacity"
                      aria-label={social.ariaLabel}
                    >
                      <Icon
                        name={social.name as any}
                        size={50}
                        className="text-primary-default!"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Map - Bottom */}
            <div className="w-full rounded-xl overflow-hidden mt-auto">
              <iframe
                src={mapEmbed.src}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
