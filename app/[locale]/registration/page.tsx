"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components";
import { useTranslations, useMessages, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { StepInformation } from "./components/StepInformation";
import { StepEducation } from "./components/StepEducation";
import { StepMotivation } from "./components/StepMotivation";
import { StepAdditional } from "./components/StepAdditional";
import DynamicForm from "./DynamicForm";

const TOTAL_STEPS = 4;

export default function Registration() {
  const t = useTranslations("registration");
  const tInfo = useTranslations("registration.information");
  const messages = useMessages();
  const informationMessages = messages.registration?.information as any;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const pageKey = searchParams?.get("pageKey");

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

  useEffect(() => {
    // Check if user is already authenticated via cookie
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const googleUserCookie = cookies.find(c => c.trim().startsWith('google_user='));
      if (googleUserCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(googleUserCookie.split('=')[1]));
          if (userData.email) {
            setIsLoggedIn(true);
            // Pre-fill email if available
            if (userData.email && !formData.email) {
              setFormData(prev => ({ ...prev, email: userData.email }));
            }
          }
        } catch (e) {
          console.error('Error parsing user cookie:', e);
        }
      }
    };

    checkAuth();

    // Check for auth success or error from callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      setIsLoggedIn(true);
      const email = urlParams.get('email');
      const name = urlParams.get('name');
      if (email) {
        setFormData(prev => ({ ...prev, email }));
      }
      
      // Restore pageKey if it was stored
      const pendingPageKey = sessionStorage.getItem('pending_pageKey');
      if (pendingPageKey && !searchParams?.get('pageKey')) {
        sessionStorage.removeItem('pending_pageKey');
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('pageKey', pendingPageKey);
        window.history.replaceState({}, '', newUrl.toString());
      }
      
      // Clean up auth params from URL
      urlParams.delete('auth');
      urlParams.delete('email');
      urlParams.delete('name');
      const cleanUrl = new URL(window.location.href);
      cleanUrl.search = urlParams.toString();
      window.history.replaceState({}, '', cleanUrl.toString());
    } else if (urlParams.get('error')) {
      // Handle OAuth errors
      const errorType = urlParams.get('error');
      const errorDetails = urlParams.get('details');
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (errorType === 'token_exchange_failed') {
        errorMessage = errorDetails 
          ? `Authentication error: ${decodeURIComponent(errorDetails)}`
          : 'Failed to complete authentication. Please check your Google OAuth configuration.';
      } else if (errorType === 'config_error') {
        const details = urlParams.get('details');
        if (details === 'missing_client_id') {
          errorMessage = 'Google OAuth Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.';
        } else if (details === 'missing_client_secret') {
          errorMessage = 'Google OAuth Client Secret is not configured. Please set GOOGLE_CLIENT_SECRET in your environment variables.';
        } else {
          errorMessage = 'Authentication is not properly configured. Please check your environment variables.';
        }
      } else if (errorType === 'no_code') {
        errorMessage = 'Authentication was cancelled or incomplete. Please try again.';
      }
      
      alert(errorMessage);
      
      // Clean up error params from URL
      urlParams.delete('error');
      urlParams.delete('details');
      const cleanUrl = new URL(window.location.href);
      cleanUrl.search = urlParams.toString();
      window.history.replaceState({}, '', cleanUrl.toString());
    }
  }, []);

  const handleSignIn = async () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error('Google Client ID not configured');
        alert('Google authentication is not configured. Please contact support.');
        return;
      }

      // Preserve pageKey and locale in redirect
      const currentPageKey = searchParams?.get('pageKey');
      // IMPORTANT: The redirect_uri must match EXACTLY what's configured in Google Cloud Console
      // Use window.location.origin to ensure it matches the actual request URL
      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      const scope = 'openid email profile';
      const responseType = 'code';
      
      // Create state parameter to preserve locale and pageKey
      const state = JSON.stringify({
        locale: locale,
        pageKey: currentPageKey || null,
      });
      
      console.log('Initiating Google OAuth with:', {
        clientId: clientId.substring(0, 20) + '...',
        redirectUri,
        origin: window.location.origin,
      });
      
      let authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=${responseType}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${encodeURIComponent(state)}`;

      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert('Failed to initiate Google sign-in. Please try again.');
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

  // If pageKey is provided, show dynamic form instead
  if (pageKey) {
    return <DynamicForm pageKey={pageKey} />;
  }

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
