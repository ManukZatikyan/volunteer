"use client";

import { useState } from "react";
import { Button, Input, Textarea, Icon } from "@/components";
import {
  headerSection,
  formFields,
  formButton,
  socialMediaSection,
  contactInfo,
  socialMediaLinks,
  mapEmbed,
} from "@/data/contactUs";

export default function ContactUs() {
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
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
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
    <div className="min-h-screen bg-primary-default p-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="hero-sm text-center mb-3">
            <span className="text-white">{headerSection.title.line1}</span>{" "}
            <span className="text-[#FFA62B]">{headerSection.title.line2}</span>
          </h1>
          <p className="body-sm-mobile text-start font-montserrat! font-semibold!">
            {headerSection.description}
          </p>
        </div>

        <div className="mb-16">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
            <Input
              type={formFields.email.type}
              name="email"
              label={formFields.email.label}
              required={formFields.email.required}
              placeholder={formFields.email.placeholder}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              className=""
            />

            <Input
              type={formFields.fullName.type}
              name="fullName"
              label={formFields.fullName.label}
              required={formFields.fullName.required}
              placeholder={formFields.fullName.placeholder}
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              className=""
            />

            <Input
              type={formFields.phone.type}
              name="phone"
              label={formFields.phone.label}
              required={formFields.phone.required}
              placeholder={formFields.phone.placeholder}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              className=""
            />

            <Textarea
              name="message"
              label={formFields.message.label}
              placeholder={formFields.message.placeholder}
              value={formData.message}
              onChange={handleChange}
              rows={formFields.message.rows}
              className=""
            />
            <div className="flex items-center justify-center">
              <Button variant="orange" className="px-[73px]">
                {formButton.text}
              </Button>
            </div>
          </form>
        </div>

        <div className="p-6">
          <h2 className="hero-sm text-center mb-6">
            <span className="text-white">{socialMediaSection.title.line1}</span>{" "}
            <span className="text-[#FFA62B]">{socialMediaSection.title.line2}</span>
          </h2>

          <div className="flex justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <Icon
                  name="phone"
                  size={32}
                  className="text-white shrink-0"
                  color="#FFFFFF"
                />
                <span className="body-sm-mobile font-semibold!">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Icon
                  name="email"
                  size={32}
                  className="text-white shrink-0"
                  color="#FFFFFF"
                />
                <span className="body-sm-mobile font-semibold!">{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Icon
                  name="location"
                  size={32}
                  className="text-white shrink-0"
                  color="#FFFFFF"
                />
                <span className="body-sm-mobile font-semibold!">{contactInfo.location}</span>
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
                    className="text-white"
                    color="#FFFFFF"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full p-6">
          <div className="rounded-xl overflow-hidden border-2 border-white/20">
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
    </div>
  );
}
