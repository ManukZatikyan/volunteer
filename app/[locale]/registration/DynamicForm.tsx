'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { PAGES } from '@/lib/pages';

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
  const locale = useLocale();
  const t = useTranslations('forms');
  const tReg = useTranslations('registration.information');
  
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
    <div className="min-h-screen bg-primary-default px-6 py-6 md:py-8">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-[54px] leading-[54px] mb-2 md:mb-9">
          {tReg('title.your')} <span className="text-secondary-orange-bright">{tReg('title.information')}</span>
        </h1>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
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
            <div className="w-full bg-white/20 rounded-full h-2">
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

