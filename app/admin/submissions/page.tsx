'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAdminLocale } from '@/lib/admin-locale';
import { PAGES, FORM_ALLOWED_PAGES } from '@/lib/pages';
import { Loading } from '@/components';
import { useLoopedLoading } from '@/lib/useLoopedLoading';

interface FormSubmission {
  _id: string;
  formId: any;
  pageKey: string;
  userEmail?: string;
  userName?: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSubmissions() {
  const t = useTranslations('admin');
  const tDashboard = useTranslations('admin.dashboard');
  const { locale, setLocale } = useAdminLocale();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [error, setError] = useState('');
  const [selectedPageKey, setSelectedPageKey] = useState<string>('');
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const router = useRouter();
  const { loading, startLoading, stopLoading } = useLoopedLoading();

  useEffect(() => {
    checkAuthAndLoadSubmissions();
  }, [selectedPageKey]);

  const checkAuthAndLoadSubmissions = async () => {
    try {
      startLoading();
      // Check authentication
      const authResponse = await fetch('/api/admin/check-auth');
      const authData = await authResponse.json();

      if (!authData.authenticated) {
        router.push('/admin');
        return;
      }

      // Load submissions
      const url = selectedPageKey 
        ? `/api/admin/submissions?pageKey=${selectedPageKey}`
        : '/api/admin/submissions';
      const submissionsResponse = await fetch(url);
      
      if (!submissionsResponse.ok) {
        throw new Error('Failed to load submissions');
      }

      const submissionsData = await submissionsResponse.json();
      setSubmissions(submissionsData.submissions || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      stopLoading();
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFieldLabel = (form: any, stepIndex: number, fieldIndex: number, fieldLocale: 'en' | 'hy' = 'en'): string => {
    if (!form?.steps || !form.steps[stepIndex] || !form.steps[stepIndex].fields[fieldIndex]) {
      return `Field ${fieldIndex + 1}`;
    }
    const field = form.steps[stepIndex].fields[fieldIndex];
    return fieldLocale === 'hy' && field.labelHy ? field.labelHy : field.label;
  };

  const getStepTitle = (form: any, stepIndex: number, fieldLocale: 'en' | 'hy' = 'en'): string => {
    if (!form?.steps || !form.steps[stepIndex]) {
      return `Step ${stepIndex + 1}`;
    }
    const step = form.steps[stepIndex];
    return fieldLocale === 'hy' && step.titleHy ? step.titleHy : step.title;
  };

  const renderSubmissionData = (submission: FormSubmission) => {
    const form = submission.formId;
    if (!form || !form.steps) {
      return <div className="text-gray-500">No form structure available</div>;
    }

    return (
      <div className="space-y-4">
        {form.steps.map((step: any, stepIndex: number) => {
          const stepData = submission.data[`step_${stepIndex}`] || {};
          const hasData = Object.keys(stepData).length > 0;

          if (!hasData) return null;

          return (
            <div key={step.id || stepIndex} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {getStepTitle(form, stepIndex, locale as 'en' | 'hy')}
              </h4>
              <div className="space-y-2">
                {step.fields.map((field: any, fieldIndex: number) => {
                  const fieldKey = `field_${fieldIndex}`;
                  const fieldValue = stepData[fieldKey];
                  
                  if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '')) {
                    return null;
                  }

                  return (
                    <div key={field.id || fieldIndex} className="text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {getFieldLabel(form, stepIndex, fieldIndex, locale as 'en' | 'hy')}:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {typeof fieldValue === 'string' ? fieldValue : JSON.stringify(fieldValue)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size={240} loop />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  const allowedPages = PAGES.filter(p => FORM_ALLOWED_PAGES.includes(p.key as any));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('submissions.title', { default: 'Form Submissions' })}
            </h1>
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-md p-1">
                <button
                  onClick={() => setLocale('en')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                    locale === 'en'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLocale('hy')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                    locale === 'hy'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  HY
                </button>
              </div>
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer"
              >
                {tDashboard('title', { default: 'Dashboard' })}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
              >
                {tDashboard('logout', { default: 'Logout' })}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter by Page */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('submissions.filterByPage', { default: 'Filter by Page' })}
          </label>
          <select
            value={selectedPageKey}
            onChange={(e) => setSelectedPageKey(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
          >
            <option value="">{t('submissions.allPages', { default: 'All Pages' })}</option>
            {allowedPages.map((page) => (
              <option key={page.key} value={page.key}>
                {page.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {t('submissions.noSubmissions', { default: 'No submissions found' })}
              </p>
            </div>
          ) : (
            submissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {PAGES.find(p => p.key === submission.pageKey)?.name || submission.pageKey}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {submission.userEmail && (
                        <div>
                          <span className="font-medium">Email:</span> {submission.userEmail}
                        </div>
                      )}
                      {submission.userName && (
                        <div>
                          <span className="font-medium">Name:</span> {submission.userName}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Submitted:</span> {formatDate(submission.createdAt)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedSubmission(
                      expandedSubmission === submission._id ? null : submission._id
                    )}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    {expandedSubmission === submission._id 
                      ? t('submissions.hide', { default: 'Hide Answers' })
                      : t('submissions.show', { default: 'Show Answers' })
                    }
                  </button>
                </div>

                {expandedSubmission === submission._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {renderSubmissionData(submission)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

