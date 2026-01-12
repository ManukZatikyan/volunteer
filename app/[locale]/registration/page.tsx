"use client";

import { useState } from "react";
import { Button } from "@/components";
import { useTranslations, useMessages } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { StepInformation } from "./components/StepInformation";
import { StepEducation } from "./components/StepEducation";
import { StepMotivation } from "./components/StepMotivation";
import { StepAdditional } from "./components/StepAdditional";

const TOTAL_STEPS = 4;

export default function Registration() {
  const t = useTranslations("registration");
  const tInfo = useTranslations("registration.information");
  const messages = useMessages();
  const informationMessages = messages.registration?.information as any;
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 0: Information
    email: informationMessages?.prefilled?.email || "",
    name: "",
    phone: informationMessages?.prefilled?.phone || "+37491008372",
    age: "",
    surname: "",
    instagram: informationMessages?.prefilled?.instagram || "@center__up",
    cityAndCountry: "",
    // Step 1: Education
    education: "",
    university: "",
    firstApplication: "",
    howDidYouHear: "",
    volunteerExperience: "",
    volunteerDescription: "",
    // Step 2: Motivation
    whyJoinTeam: "",
    explainVolunteering: "",
    interestedPrograms: "",
    memberOrLeader: "",
    leaderSkills: "",
    // Step 3: Additional
    additionalInfo: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = async () => {
    // Simulate Google sign-in
    try {
      setTimeout(() => {
        setIsLoggedIn(true);
        setCurrentStep(0);
      }, 500);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Validate Information step
      if (!formData.email) {
        newErrors.email = tInfo("errors.email.required");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = tInfo("errors.email.invalid");
      }
      if (!formData.name) {
        newErrors.name = tInfo("errors.name.required");
      }
      if (!formData.surname) {
        newErrors.surname = tInfo("errors.surname.required");
      }
      if (!formData.phone) {
        newErrors.phone = tInfo("errors.phone.required");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Submit form
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission
    // router.push("/registration/success");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentStep(0);
    setFormData({
      email: "",
      name: "",
      phone: informationMessages?.prefilled?.phone || "+37491008372",
      age: "",
      surname: "",
      instagram: informationMessages?.prefilled?.instagram || "@center__up",
      cityAndCountry: "",
      education: "",
      university: "",
      firstApplication: "",
      howDidYouHear: "",
      volunteerExperience: "",
      volunteerDescription: "",
      whyJoinTeam: "",
      explainVolunteering: "",
      interestedPrograms: "",
      memberOrLeader: "",
      leaderSkills: "",
      additionalInfo: "",
    });
    setErrors({});
  };

  // Show Google sign-in if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center  px-6">
        <div className="w-full max-w-md flex flex-col items-center justify-center text-center">
          <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8 leading-tight">
            {t("signInPrompt")}{" "}
            <span className="text-secondary-orange-bright">{t("google")}</span>{" "}
            {t("toContinue")}
          </h1>
          
          <Button
            onClick={handleSignIn}
            variant="orange"
            className="px-6 py-3 md:px-16 md:py-4 text-base md:text-lg font-semibold mt-4"
          >
            {t("sendButton")}
          </Button>
        </div>
      </div>
    );
  }

  // Show form steps
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepInformation
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onDropdownChange={handleDropdownChange}
            onLogout={handleLogout}
          />
        );
      case 1:
        return (
          <StepEducation
            formData={formData}
            errors={errors}
            onChange={handleTextareaChange}
            onDropdownChange={handleDropdownChange}
          />
        );
      case 2:
        return (
          <StepMotivation
            formData={formData}
            errors={errors}
            onChange={handleTextareaChange}
            onDropdownChange={handleDropdownChange}
          />
        );
      case 3:
        return (
          <StepAdditional
            formData={formData}
            errors={errors}
            onChange={handleTextareaChange}
          />
        );
      default:
        return null;
    }
  };

  const getStepButtonText = () => {
    return tInfo("buttons.next");
  };

  return (
    <div className="min-h-screen px-6 py-6 md:py-8">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-[54px] leading-[54px] mb-2 md:mb-9">
          {tInfo("title.your")}{" "}
          <span className="text-secondary-orange-bright">{tInfo("title.information")}</span>
        </h1>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
          className="w-full"
        >
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex w-full justify-between gap-4 mt-8 md:mt-12">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="white"
                onClick={handlePrevious}
                className="px-8 py-3 md:px-12 md:py-4 text-base md:text-lg font-semibold"
              >
                {tInfo("buttons.previous")}
              </Button>
            )}
            {currentStep === 0 && <div></div>}
            <Button
              type="submit"
              variant="orange"
              className="px-8 py-3 md:px-12 md:py-4 text-base md:text-lg font-semibold ml-auto"
            >
              {getStepButtonText()}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
