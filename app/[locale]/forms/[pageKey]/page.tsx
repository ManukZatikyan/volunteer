'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { PAGES } from '@/lib/pages';
import Image from 'next/image';
import { ContentCard } from '@/components';

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

export default function FormPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const pageKey = params?.pageKey as string;
  const t = useTranslations('forms');
  
  const [form, setForm] = useState<Form | null>(null);
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadFormAndContent();
  }, [pageKey, locale]);

  const loadFormAndContent = async () => {
    try {
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
        // Form doesn't exist, redirect or show message
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">{t('loading', { default: 'Loading...' })}</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">{t('formNotFound', { default: 'Form not found' })}</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-green-600 dark:text-green-400 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('successTitle', { default: 'Thank You!' })}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
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

  // Get page title and description from content
  const pageTitle = pageContent?.heroSection?.title || 
                    pageContent?.heroTitle ||
                    page?.name || 
                    pageKey;
  
  const pageDescriptionHeading = pageContent?.description?.heading || 
                                  pageContent?.descriptionHeading ||
                                  null;
  
  const pageDescriptionText = pageContent?.description?.text || 
                              pageContent?.descriptionText ||
                              null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      {pageTitle && (
        <section className="relative w-full h-[246px] sm:h-[400px] flex items-end">
          <div className="absolute inset-0">
            <Image
              src="/image.png"
              alt={pageTitle}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-default/60 via-transparent to-white dark:from-primary-default/95 dark:via-primary-default/40 dark:to-primary-default"></div>
          </div>
          <div className="relative z-10 w-full px-6">
            <h1 className="text-white title-sm mb-3 md:text-center md:text-hero! md:text-secondary-orange-bright! md:mb-21!">
              {pageTitle}
            </h1>
            <div className="h-1 md:h-1.5 bg-secondary-orange-bright w-full rounded md:hidden"></div>
          </div>
        </section>
      )}

      {/* Description Section */}
      {(pageDescriptionHeading || pageDescriptionText) && (
        <div className="px-6 pt-3 md:px-10 xl:px-30 pb-6">
          {pageDescriptionHeading && (
            <h2 className="text-white body-sm-mobile font-semibold! font-montserrat! mb-3 md:text-headline! md:leading-headline! md:font-bold!">
              {pageDescriptionHeading}
            </h2>
          )}
          {pageDescriptionText && (
            <p className="text-white body-xs md:text-body! md:leading-body!">
              {pageDescriptionText}
            </p>
          )}
        </div>
      )}

      {/* Description Items Section (for pages like membership, centerUpJunior, etc.) */}
      {pageContent?.descriptionItems && Array.isArray(pageContent.descriptionItems) && pageContent.descriptionItems.length > 0 && (
        <div className="md:px-4 xl:px-30 px-6 pt-12 pb-12">
          <div className="flex flex-col gap-6">
            {pageContent.descriptionItems.map((item: any, index: number) => (
              <ContentCard
                key={index}
                title={item.heading}
                imageSrc={item.imageSrc || "/users.png"}
                imagePosition={item.imagePosition || (index % 2 === 1 ? "end" : "start")}
                content={item.text}
                contentFontSize={item.contentFontSize}
              />
            ))}
          </div>
        </div>
      )}

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {/* Progress Indicator */}
            <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('step', { default: 'Step' })} {currentStep + 1} {t('of', { default: 'of' })} {form.steps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-default h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / form.steps.length) * 100}%` }}
              />
            </div>
            </div>

            {/* Step Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {getFieldLabel(field)}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  
                  {field.type === 'input' && (
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => handleFieldChange(currentStep, fieldIndex, e.target.value)}
                      placeholder={getFieldPlaceholder(field)}
                      className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white ${
                        hasError
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      value={fieldValue}
                      onChange={(e) => handleFieldChange(currentStep, fieldIndex, e.target.value)}
                      placeholder={getFieldPlaceholder(field)}
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white ${
                        hasError
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      value={fieldValue}
                      onChange={(e) => handleFieldChange(currentStep, fieldIndex, e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white cursor-pointer ${
                        hasError
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
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
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors[errorKey]}
                    </p>
                  )}
                </div>
              );
            })}
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
                {errors.submit}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {t('previous', { default: 'Previous' })}
            </button>

            {currentStep < form.steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-primary-default text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-default cursor-pointer"
              >
                {t('next', { default: 'Next' })}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? t('submitting', { default: 'Submitting...' }) : t('submit', { default: 'Submit' })}
              </button>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

