'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { PAGES } from '@/lib/pages';
import { Button } from '@/components';

interface FormField {
  id: string;
  type: 'input' | 'textarea' | 'select';
  label: string;
  labelHy?: string;
  placeholder?: string;
  placeholderHy?: string;
  required: boolean;
  options?: string[];
  optionsHy?: string[];
}

interface FormStep {
  id: string;
  title: string;
  titleHy?: string;
  fields: FormField[];
}

interface Form {
  _id: string;
  pageKey: string;
  steps: FormStep[];
}

interface DynamicFormProps {
  pageKey: string;
}

export default function DynamicForm({ pageKey }: DynamicFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('forms');
  const tReg = useTranslations('registration.information');
  const tAuth = useTranslations('registration');
  
  const [form, setForm] = useState<Form | null>(null);
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadFormAndContent = async () => {
    try {
      setLoading(true);
      // Load both form and page content in parallel
      const [formResponse, contentResponse] = await Promise.all([
        fetch(`/api/forms/${pageKey}`),
        fetch(`/api/content/${pageKey}?locale=${locale}`)
      ]);

      // Load form
      if (formResponse.ok) {
        const formData = await formResponse.json();
        setForm(formData.form);
        // Initialize form data structure
        const initialData: Record<string, any> = {};
        formData.form.steps.forEach((step: FormStep, stepIndex: number) => {
          initialData[`step_${stepIndex}`] = {};
          step.fields.forEach((field: FormField, fieldIndex: number) => {
            initialData[`step_${stepIndex}`][`field_${fieldIndex}`] = '';
          });
        });
        setFormData(initialData);
      } else if (formResponse.status === 404) {
        // Form doesn't exist, redirect back
        router.push('/');
        return;
      }

      // Load page content
      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        setPageContent(contentData.content);
      }
    } catch (error) {
      console.error('Error loading form or content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status
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
            return true;
          }
        } catch (e) {
          console.error('Error parsing user cookie:', e);
        }
      }
      return false;
    };

    // Check for auth success from callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      setIsLoggedIn(true);
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
    } else {
      // Check cookie-based auth
      checkAuth();
    }
  }, []);

  // Load form when authenticated
  useEffect(() => {
    if (isLoggedIn) {
      loadFormAndContent();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, pageKey, locale]);

  const getFieldLabel = (field: FormField): string => {
    return locale === 'hy' && field.labelHy ? field.labelHy : field.label;
  };

  const getFieldPlaceholder = (field: FormField): string => {
    return locale === 'hy' && field.placeholderHy ? field.placeholderHy : (field.placeholder || '');
  };

  const getStepTitle = (step: FormStep): string => {
    return locale === 'hy' && step.titleHy ? step.titleHy : step.title;
  };

  const getFieldOptions = (field: FormField): string[] => {
    if (field.type !== 'select') return [];
    return locale === 'hy' && field.optionsHy ? field.optionsHy : (field.options || []);
  };

  const handleFieldChange = (stepIndex: number, fieldIndex: number, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [`step_${stepIndex}`]: {
        ...prev[`step_${stepIndex}`],
        [`field_${fieldIndex}`]: value,
      },
    }));
    // Clear error for this field
    const errorKey = `step_${stepIndex}_field_${fieldIndex}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    if (!form) return false;
    
    const step = form.steps[currentStep];
    const stepData = formData[`step_${currentStep}`] || {};
    const newErrors: Record<string, string> = {};

    step.fields.forEach((field, fieldIndex) => {
      const fieldKey = `field_${fieldIndex}`;
      const fieldValue = stepData[fieldKey];

      if (field.required) {
        if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '')) {
          newErrors[`step_${currentStep}_field_${fieldIndex}`] = t('fieldRequired', { 
            default: 'This field is required',
            field: getFieldLabel(field)
          });
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if all required fields in current step are filled (for button disable state)
  const isCurrentStepValid = (): boolean => {
    if (!form) return false;
    
    const step = form.steps[currentStep];
    const stepData = formData[`step_${currentStep}`] || {};

    return step.fields.every((field, fieldIndex) => {
      if (!field.required) return true;
      const fieldKey = `field_${fieldIndex}`;
      const fieldValue = stepData[fieldKey];
      return fieldValue && (typeof fieldValue !== 'string' || fieldValue.trim() !== '');
    });
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < form!.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignIn = async () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error('Google Client ID not configured');
        alert('Google authentication is not configured. Please contact support.');
        return;
      }

      // Preserve pageKey and locale in redirect
      const currentPageKey = searchParams?.get('pageKey') || pageKey;
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

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/forms/${pageKey}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || t('submitError', { default: 'Failed to submit form' }) });
      }
    } catch (error: any) {
      setErrors({ submit: error.message || t('submitError', { default: 'Failed to submit form' }) });
    } finally {
      setSubmitting(false);
    }
  };

  const page = PAGES.find(p => p.key === pageKey);

  // Show Google sign-in if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-default px-6">
        <div className="w-full max-w-md flex flex-col items-center justify-center text-center">
          <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8 leading-tight">
            {tAuth("signInPrompt")}{" "}
            <span className="text-secondary-orange-bright">{tAuth("google")}</span>{" "}
            {tAuth("toContinue")}
          </h1>
          
          <Button
            onClick={handleSignIn}
            variant="orange"
            className="px-6 py-3 md:px-16 md:py-4 text-base md:text-lg font-semibold mt-4"
          >
            {tAuth("sendButton")}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-default flex items-center justify-center">
        <div className="text-white">{t('loading', { default: 'Loading...' })}</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-primary-default flex items-center justify-center">
        <div className="text-white">{t('formNotFound', { default: 'Form not found' })}</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-primary-default flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('successTitle', { default: 'Thank You!' })}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('successMessage', { default: 'Your form has been submitted successfully.' })}
          </p>
          <button
            onClick={() => router.push(page?.route || '/')}
            className="px-6 py-2 bg-primary-default text-white rounded-md hover:bg-primary-dark cursor-pointer"
          >
            {t('backToPage', { default: 'Back to Page' })}
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = form.steps[currentStep];
  const stepData = formData[`step_${currentStep}`] || {};

  return (
    <div className="!bg-primary-light dark:bg-primary-default px-6 py-6 md:py-8">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-[54px] leading-[54px] mb-2 md:mb-9">
          {tReg('title.your')} <span className="text-secondary-orange-bright">{tReg('title.information')}</span>
        </h1>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep < form.steps.length - 1) {
              handleNext();
            } else {
              handleSubmit();
            }
          }}
          className="w-full"
        >
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">
                {t('step', { default: 'Step' })} {currentStep + 1} {t('of', { default: 'of' })} {form.steps.length}
              </span>
            </div>
            <div className="w-full bg-text-dark-blue/20 dark:bg-white/20 rounded-full h-2">
              <div
                className="bg-secondary-orange-bright h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / form.steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Title */}
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-6">
            {getStepTitle(currentStepData)}
          </h2>

          {/* Form Fields */}
          <div className="space-y-6 mb-8">
            {currentStepData.fields.map((field, fieldIndex) => {
              const fieldKey = `field_${fieldIndex}`;
              const fieldValue = stepData[fieldKey] || '';
              const errorKey = `step_${currentStep}_field_${fieldIndex}`;
              const hasError = !!errors[errorKey];

              return (
                <div key={field.id}>
                  <label className="block text-white text-sm font-medium mb-2">
                    {getFieldLabel(field)}
                    {field.required && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                  
                  {field.type === 'input' && (
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => handleFieldChange(currentStep, fieldIndex, e.target.value)}
                      placeholder={getFieldPlaceholder(field)}
                      className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-orange-bright focus:border-secondary-orange-bright bg-white text-gray-900 ${
                        hasError
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      value={fieldValue}
                      onChange={(e) => handleFieldChange(currentStep, fieldIndex, e.target.value)}
                      placeholder={getFieldPlaceholder(field)}
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-orange-bright focus:border-secondary-orange-bright bg-white text-gray-900 ${
                        hasError
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      value={fieldValue}
                      onChange={(e) => handleFieldChange(currentStep, fieldIndex, e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-orange-bright focus:border-secondary-orange-bright bg-white text-gray-900 cursor-pointer ${
                        hasError
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    >
                      <option value="">{t('selectOption', { default: 'Select an option...' })}</option>
                      {getFieldOptions(field).map((option, optIndex) => (
                        <option key={optIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {hasError && (
                    <p className="mt-1 text-sm text-red-300">
                      {errors[errorKey]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
              {errors.submit}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex w-full justify-between gap-4 mt-8 md:mt-12">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-8 py-3 md:px-12 md:py-4 text-base md:text-lg font-semibold bg-white text-primary-default rounded-md hover:bg-gray-100 cursor-pointer"
              >
                {t('previous', { default: 'Previous' })}
              </button>
            )}
            {currentStep === 0 && <div></div>}
            <button
              type="submit"
              disabled={currentStep < form.steps.length - 1 ? !isCurrentStepValid() : (submitting || !isCurrentStepValid())}
              className="px-8 py-3 md:px-12 md:py-4 text-base md:text-lg font-semibold bg-secondary-orange-bright text-white rounded-md hover:bg-secondary-orange-bright/90 cursor-pointer ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep < form.steps.length - 1
                ? t('next', { default: 'Next' })
                : (submitting ? t('submitting', { default: 'Submitting...' }) : t('submit', { default: 'Submit' }))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

