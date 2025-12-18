"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from ".";

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "w-full bg-[#121422] text-white",
        "flex flex-col gap-6",
        className
      )}
    >
      <div className="flex gap-6 pt-6 px-9">
        {/* Content Section */}
        <div className="flex flex-col gap-3">
          <h3 className="font-montserrat font-semibold text-base leading-6">
            Content
          </h3>
          <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
            <li>
              <a
                href="#"
                className="hover:text-secondary-orange-bright transition-colors"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-secondary-orange-bright transition-colors"
              >
                Our Team
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-secondary-orange-bright transition-colors"
              >
                Programs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-secondary-orange-bright transition-colors"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Programs Section */}
        <div className="flex flex-col gap-3">
          <h3 className="font-montserrat font-semibold text-base leading-6">
            Programs
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
              <li>
                <a
                  href="#"
                  className="hover:text-secondary-orange-bright transition-colors"
                >
                  Membership
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary-orange-bright transition-colors"
                >
                  Center Up Junior
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary-orange-bright transition-colors"
                >
                  International Universities
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary-orange-bright transition-colors"
                >
                  Courses & Activities
                </a>
              </li>
            </ul>
            <ul className="flex flex-col gap-2 font-noto-sans text-sm leading-5">
              <li>
                <a
                  href="#"
                  className="hover:text-secondary-orange-bright transition-colors"
                >
                  Conferences
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary-orange-bright transition-colors"
                >
                  Future Up
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary-orange-bright transition-colors"
                >
                  Summer Camp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary-orange-bright transition-colors"
                >
                  Event Organization
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-between items-end px-9">
        <div className="flex flex-col gap-3">
          <h3 className="font-montserrat font-semibold text-base leading-6">
            Get in Touch
          </h3>
          <div className="flex flex-col gap-3 font-noto-sans font-normal text-base leading-6">
            {/* Phone */}
            <div className="flex items-center gap-3">
              <Icon name="phone" size={24} className="text-white" />
              <span>+37477800031</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Icon name="email" size={24} className="text-white" />

              <a
                href="mailto:info@centerup.org"
                className="hover:text-secondary-orange-bright transition-colors"
              >
                info@centerup.org
              </a>
            </div>

            {/* Address */}
            <div className="flex items-center gap-3">
              <Icon name="location" size={24} className="text-white" />

              <span>Sayat-Nova 11/2</span>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="grid grid-cols-2 gap-3">
          <a href="#" aria-label="Instagram">
            <Icon name="instagram" size={36} className="text-white" />
          </a>
          <a href="#" aria-label="Facebook">
            <Icon name="facebook" size={36} className="text-white" />
          </a>
          <a href="#" aria-label="LinkedIn">
            <Icon name="linkedin" size={36} className="text-white" />
          </a>
          <a href="#" aria-label="Telegram">
            <Icon name="telegram" size={36} className="text-white" />
          </a>
        </div>
      </div>
      <div className="px-9 w-full">
        <div className="w-full h-px bg-white" />
      </div>

      <div className="flex flex-col items-center gap-4 px-[18px]">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <Image
            src="/svg/logoMobile.svg"
            alt="ENTER UP Logo"
            width={96}
            height={52}
            className="mb-2"
          />
        </div>

        {/* Description */}
        <p className="text-center font-noto-sans text-sm max-w-md leading-5">
          Center Up is an educational organization that offers diverse and
          innovative programs for individuals.
        </p>
      </div>

      <div className="text-center font-noto-sans text-sm pb-6 leading-5">
        © 2021-2025 Center Up Organization. This is my home...
      </div>
    </footer>
  );
};
