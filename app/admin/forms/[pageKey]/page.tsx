'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAdminLocale } from '@/lib/admin-locale';
import { PAGES, FORM_ALLOWED_PAGES, type PageKey } from '@/lib/pages';
import AlertModal from '@/components/admin/AlertModal';

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

export default function FormEditorPage() {
  const router = useRouter();
  const params = useParams();
  const pageKey = params?.pageKey as string;
  const t = useTranslations('admin.forms');
  const { locale: adminLocale, setLocale: setAdminLocale } = useAdminLocale();
  const contentLocale = adminLocale || 'en';

  const [steps, setSteps] = useState<FormStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alertModal, setAlertModal] = useState<{ open: boolean; type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string }>({
    open: false,
    type: 'info',
    title: '',
    message: '',
  });

  useEffect(() => {
    checkAuthAndLoadForm();
  }, [pageKey]);

  const checkAuthAndLoadForm = async () => {
    setLoading(true);
    try {
      // Check if page is allowed to have forms
      if (!FORM_ALLOWED_PAGES.includes(pageKey as any)) {
        setAlertModal({
          open: true,
          type: 'error',
          title: t('error', { default: 'Error' }),
          message: t('formNotAllowed', { default: 'Forms are not allowed for this page' }),
        });
        setTimeout(() => {
          router.push('/admin/forms');
        }, 2000);
        return;
      }

      const authResponse = await fetch('/api/admin/check-auth');
      if (!authResponse.ok) {
        router.push('/admin');
        return;
      }

      const authData = await authResponse.json();
      if (!authData.authenticated) {
        router.push('/admin');
        return;
      }

      const formResponse = await fetch(`/api/admin/forms/${pageKey}`);
      if (formResponse.ok) {
        const data = await formResponse.json();
        setSteps(data.form?.steps || []);
      } else if (formResponse.status === 404) {
        // Form doesn't exist yet, start with empty steps
        setSteps([]);
      } else {
        throw new Error('Failed to load form');
      }
    } catch (err: any) {
      setAlertModal({
        open: true,
        type: 'error',
        title: t('error', { default: 'Error' }),
        message: err.message || t('loadFailed', { default: 'An error occurred' }),
      });
    } finally {
      setLoading(false);
    }
  };

  const generateId = () => {
    return `_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddStep = () => {
    const newStep: FormStep = {
      id: generateId(),
      title: '',
      titleHy: '',
      fields: [],
    };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const handleUpdateStep = (stepId: string, updates: Partial<FormStep>) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, ...updates } : s));
  };

  const handleAddField = (stepId: string) => {
    const newField: FormField = {
      id: generateId(),
      type: 'input',
      label: '',
      labelHy: '',
      placeholder: '',
      placeholderHy: '',
      required: false,
    };
    setSteps(steps.map(s => 
      s.id === stepId 
        ? { ...s, fields: [...s.fields, newField] }
        : s
    ));
  };

  const handleDeleteField = (stepId: string, fieldId: string) => {
    setSteps(steps.map(s =>
      s.id === stepId
        ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
        : s
    ));
  };

  const handleUpdateField = (stepId: string, fieldId: string, updates: Partial<FormField>) => {
    setSteps(steps.map(s =>
      s.id === stepId
        ? {
            ...s,
            fields: s.fields.map(f =>
              f.id === fieldId ? { ...f, ...updates } : f
            ),
          }
        : s
    ));
  };

  const handleAddOption = (stepId: string, fieldId: string) => {
    setSteps(steps.map(s =>
      s.id === stepId
        ? {
            ...s,
            fields: s.fields.map(f => {
              if (f.id === fieldId) {
                return {
                  ...f,
                  options: [...(f.options || []), ''],
                  optionsHy: [...(f.optionsHy || []), ''],
                };
              }
              return f;
            }),
          }
        : s
    ));
  };

  const handleUpdateOption = (stepId: string, fieldId: string, optionIndex: number, value: string, isHy: boolean = false) => {
    setSteps(steps.map(s =>
      s.id === stepId
        ? {
            ...s,
            fields: s.fields.map(f => {
              if (f.id === fieldId) {
                if (isHy) {
                  const newOptionsHy = [...(f.optionsHy || [])];
                  // Ensure arrays are same length
                  const optionsLength = (f.options || []).length;
                  while (newOptionsHy.length < optionsLength) {
                    newOptionsHy.push('');
                  }
                  newOptionsHy[optionIndex] = value;
                  return { ...f, optionsHy: newOptionsHy };
                } else {
                  const newOptions = [...(f.options || [])];
                  newOptions[optionIndex] = value;
                  // Ensure optionsHy array matches length
                  const optionsHy = [...(f.optionsHy || [])];
                  while (optionsHy.length < newOptions.length) {
                    optionsHy.push('');
                  }
                  return { ...f, options: newOptions, optionsHy };
                }
              }
              return f;
            }),
          }
        : s
    ));
  };

  const handleDeleteOption = (stepId: string, fieldId: string, optionIndex: number) => {
    setSteps(steps.map(s =>
      s.id === stepId
        ? {
            ...s,
            fields: s.fields.map(f => {
              if (f.id === fieldId) {
                return {
                  ...f,
                  options: (f.options || []).filter((_, i) => i !== optionIndex),
                  optionsHy: (f.optionsHy || []).filter((_, i) => i !== optionIndex),
                };
              }
              return f;
            }),
          }
        : s
    ));
  };

  const validateForm = (): string | null => {
    // Validate steps
    if (steps.length === 0) {
      return 'At least one step is required';
    }

    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      const step = steps[stepIndex];
      
      // Validate step title (EN)
      if (!step.title || step.title.trim() === '') {
        return `Step ${stepIndex + 1}: Step title (EN) is required`;
      }

      // Validate step title (HY)
      if (!step.titleHy || step.titleHy.trim() === '') {
        return `Step ${stepIndex + 1}: Step title (HY) is required`;
      }

      // Validate fields
      if (step.fields.length === 0) {
        return `Step ${stepIndex + 1} ("${step.title}"): must have at least one field`;
      }

      for (let fieldIndex = 0; fieldIndex < step.fields.length; fieldIndex++) {
        const field = step.fields[fieldIndex];
        
        // Validate label (EN)
        if (!field.label || field.label.trim() === '') {
          return `Step ${stepIndex + 1}, Field ${fieldIndex + 1}: Label (EN) is required`;
        }

        // Validate label (HY)
        if (!field.labelHy || field.labelHy.trim() === '') {
          return `Step ${stepIndex + 1}, Field ${fieldIndex + 1}: Label (HY) is required`;
        }

        // Validate placeholder (EN)
        if (!field.placeholder || field.placeholder.trim() === '') {
          return `Step ${stepIndex + 1}, Field ${fieldIndex + 1} ("${field.label}"): Placeholder (EN) is required`;
        }

        // Validate placeholder (HY)
        if (!field.placeholderHy || field.placeholderHy.trim() === '') {
          return `Step ${stepIndex + 1}, Field ${fieldIndex + 1} ("${field.label}"): Placeholder (HY) is required`;
        }

        // Validate select options
        if (field.type === 'select') {
          const optionsCount = (field.options || []).length;
          const optionsHyCount = (field.optionsHy || []).length;

          if (optionsCount === 0) {
            return `Step ${stepIndex + 1}, Field ${fieldIndex + 1} ("${field.label}"): Select field must have at least one option`;
          }

          if (optionsCount !== optionsHyCount) {
            return `Step ${stepIndex + 1}, Field ${fieldIndex + 1} ("${field.label}"): Select field must have the same number of options for both EN and HY`;
          }

          // Validate that options are not empty
          for (let i = 0; i < optionsCount; i++) {
            if (!field.options![i] || field.options![i].trim() === '') {
              return `Step ${stepIndex + 1}, Field ${fieldIndex + 1} ("${field.label}"): Option ${i + 1} (EN) cannot be empty`;
            }
            if (!field.optionsHy![i] || field.optionsHy![i].trim() === '') {
              return `Step ${stepIndex + 1}, Field ${fieldIndex + 1} ("${field.label}"): Option ${i + 1} (HY) cannot be empty`;
            }
          }
        }
      }
    }

    return null;
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);

    // Validate form before saving
    const validationError = validateForm();
    if (validationError) {
      setAlertModal({
        open: true,
        type: 'error',
        title: t('validationError', { default: 'Validation Error' }),
        message: validationError,
      });
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/forms/${pageKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ steps }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save form');
      }

      setAlertModal({
        open: true,
        type: 'success',
        title: t('success', { default: 'Success' }),
        message: t('formSaved', { default: 'Form saved successfully!' }),
      });
    } catch (err: any) {
      setAlertModal({
        open: true,
        type: 'error',
        title: t('error', { default: 'Error' }),
        message: err.message || t('saveFailed', { default: 'An error occurred while saving' }),
      });
    } finally {
      setSaving(false);
    }
  };

  const page = PAGES.find(p => p.key === pageKey);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/forms')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer mb-2"
          >
            ← Back to Forms
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('editForm', { default: 'Edit Form' })}: {page?.name || pageKey}
          </h1>
        </div>


        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-md p-1">
            <button
              onClick={() => setAdminLocale('en')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                contentLocale === 'en'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setAdminLocale('hy')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                contentLocale === 'hy'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              HY
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? t('saving', { default: 'Saving...' }) : t('save', { default: 'Save Form' })}
          </button>
        </div>

        <div className="space-y-6">
          {steps.map((step, stepIndex) => (
            <div
              key={step.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('step', { default: 'Step' })} {stepIndex + 1}
                </h2>
                <button
                  onClick={() => handleDeleteStep(step.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm cursor-pointer"
                >
                  {t('deleteStep', { default: 'Delete Step' })}
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('stepTitle', { default: 'Step Title' })} (EN)
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleUpdateStep(step.id, { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                    placeholder="Enter step title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('stepTitle', { default: 'Step Title' })} (HY)
                  </label>
                  <input
                    type="text"
                    value={step.titleHy || ''}
                    onChange={(e) => handleUpdateStep(step.id, { titleHy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                    placeholder="Enter step title in Armenian"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('fields', { default: 'Fields' })}
                  </h3>
                  <button
                    onClick={() => handleAddField(step.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm cursor-pointer"
                  >
                    {t('addField', { default: '+ Add Field' })}
                  </button>
                </div>

                {step.fields.map((field, fieldIndex) => (
                  <div
                    key={field.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('field', { default: 'Field' })} {fieldIndex + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteField(step.id, field.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs cursor-pointer"
                      >
                        {t('delete', { default: 'Delete' })}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('fieldType', { default: 'Field Type' })}
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const newType = e.target.value as 'input' | 'textarea' | 'select';
                            if (newType === 'select') {
                              // Initialize empty arrays if changing to select
                              handleUpdateField(step.id, field.id, { 
                                type: newType,
                                options: field.options || [],
                                optionsHy: field.optionsHy || [],
                              });
                            } else {
                              // Clear options if changing from select
                              handleUpdateField(step.id, field.id, { 
                                type: newType,
                                options: undefined,
                                optionsHy: undefined,
                              });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white cursor-pointer"
                        >
                          <option value="input">{t('input', { default: 'Input' })}</option>
                          <option value="textarea">{t('textarea', { default: 'Textarea' })}</option>
                          <option value="select">{t('select', { default: 'Select' })}</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => handleUpdateField(step.id, field.id, { required: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600 dark:checked:border-blue-600 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('required', { default: 'Required' })}
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('label', { default: 'Label' })} (EN)
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleUpdateField(step.id, field.id, { label: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                          placeholder="Enter label"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('label', { default: 'Label' })} (HY)
                        </label>
                        <input
                          type="text"
                          value={field.labelHy || ''}
                          onChange={(e) => handleUpdateField(step.id, field.id, { labelHy: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                          placeholder="Enter label in Armenian"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('placeholder', { default: 'Placeholder' })} (EN)
                        </label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => handleUpdateField(step.id, field.id, { placeholder: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                          placeholder="Enter placeholder"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('placeholder', { default: 'Placeholder' })} (HY)
                        </label>
                        <input
                          type="text"
                          value={field.placeholderHy || ''}
                          onChange={(e) => handleUpdateField(step.id, field.id, { placeholderHy: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                          placeholder="Enter placeholder in Armenian"
                        />
                      </div>
                    </div>

                    {field.type === 'select' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('options', { default: 'Options' })}
                          </label>
                          <button
                            onClick={() => handleAddOption(step.id, field.id)}
                            className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs cursor-pointer"
                          >
                            {t('addOption', { default: '+ Add Option' })}
                          </button>
                        </div>
                        <div className="space-y-3">
                          {((field.options || []).length > 0 ? field.options! : []).map((option, optIndex) => (
                            <div key={optIndex} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  {t('options', { default: 'Options' })} (EN)
                                </label>
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => handleUpdateOption(step.id, field.id, optIndex, e.target.value, false)}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                                  placeholder="Enter option (EN)"
                                />
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    {t('options', { default: 'Options' })} (HY)
                                  </label>
                                  <input
                                    type="text"
                                    value={(field.optionsHy || [])[optIndex] || ''}
                                    onChange={(e) => handleUpdateOption(step.id, field.id, optIndex, e.target.value, true)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter option (HY)"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <button
                                    onClick={() => handleDeleteOption(step.id, field.id, optIndex)}
                                    className="px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs cursor-pointer h-fit"
                                  >
                                    {t('delete', { default: 'Delete' })}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          {((field.options || []).length === 0) && (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                              {t('noOptions', { default: 'No options yet. Click "+ Add Option" to add one.' })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {step.fields.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {t('noFields', { default: 'No fields yet. Click "Add Field" to create one.' })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {steps.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t('noSteps', { default: 'No steps yet. Click "Add Step" to create a form.' })}
              </p>
              <button
                onClick={handleAddStep}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
              >
                {t('addStep', { default: '+ Add Step' })}
              </button>
            </div>
          )}

          {steps.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleAddStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                {t('addStep', { default: '+ Add Step' })}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        open={alertModal.open}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() => setAlertModal({ ...alertModal, open: false })}
        autoClose={alertModal.type === 'success' ? 3000 : 0}
      />
    </div>
  );
}

