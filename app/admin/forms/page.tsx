'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAdminLocale } from '@/lib/admin-locale';
import { getFormAllowedPages, PAGES, type PageKey } from '@/lib/pages';
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

interface Form {
  _id?: string;
  pageKey: string;
  steps: FormStep[];
}

export default function FormsPage() {
  const router = useRouter();
  const t = useTranslations('admin.forms');
  const tAdmin = useTranslations('admin');
  const { locale, setLocale } = useAdminLocale();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; pageKey: string | null; pageName: string }>({
    open: false,
    pageKey: null,
    pageName: '',
  });
  const [deleting, setDeleting] = useState(false);
  const [alertModal, setAlertModal] = useState<{ open: boolean; type: 'success' | 'error' | 'info' | 'warning'; title: string; message: string }>({
    open: false,
    type: 'info',
    title: '',
    message: '',
  });

  useEffect(() => {
    checkAuthAndLoadForms();
  }, []);

  const checkAuthAndLoadForms = async () => {
    setLoading(true);
    try {
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

      const formsResponse = await fetch('/api/admin/forms');
      if (!formsResponse.ok) {
        throw new Error('Failed to load forms');
      }

      const data = await formsResponse.json();
      setForms(data.forms || []);
    } catch (err: any) {
      setAlertModal({
        open: true,
        type: 'error',
        title: t('error', { default: 'Error' }),
        message: err.message || t('loadFailed', { default: 'Failed to load forms' }),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = (pageKey: PageKey) => {
    router.push(`/admin/forms/${pageKey}`);
  };

  const handleEditForm = (pageKey: string) => {
    router.push(`/admin/forms/${pageKey}`);
  };

  const handleDeleteClick = (pageKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const page = PAGES.find(p => p.key === pageKey);
    setDeleteModal({
      open: true,
      pageKey,
      pageName: page?.name || pageKey,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.pageKey) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/forms/${deleteModal.pageKey}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      setForms(forms.filter(f => f.pageKey !== deleteModal.pageKey));
      setDeleteModal({ open: false, pageKey: null, pageName: '' });
      setAlertModal({
        open: true,
        type: 'success',
        title: t('success', { default: 'Success' }),
        message: t('formDeleted', { default: 'Form deleted successfully' }),
      });
    } catch (err: any) {
      setDeleteModal({ open: false, pageKey: null, pageName: '' });
      setAlertModal({
        open: true,
        type: 'error',
        title: t('error', { default: 'Error' }),
        message: err.message || t('deleteFailed', { default: 'Failed to delete form' }),
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, pageKey: null, pageName: '' });
  };

  const getPageName = (pageKey: string) => {
    const page = PAGES.find(p => p.key === pageKey);
    return page?.name || pageKey;
  };

  const hasForm = (pageKey: string) => {
    return forms.some(f => f.pageKey === pageKey);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('title', { default: 'Form Management' })}
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
                {tAdmin('dashboard.title', { default: 'Dashboard' })}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
              >
                {tAdmin('dashboard.logout', { default: 'Logout' })}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {t('description', { default: 'Manage registration forms for each page' })}
          </p>
        </div>


        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('pages', { default: 'Pages' })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFormAllowedPages().map((page) => {
                const form = forms.find(f => f.pageKey === page.key);
                const hasExistingForm = !!form;

                return (
                  <div
                    key={page.key}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {page.name}
                      </h3>
                      {hasExistingForm && (
                        <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded">
                          {t('hasForm', { default: 'Has Form' })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {page.route}
                    </p>
                    <div className="flex gap-2">
                      {hasExistingForm ? (
                        <>
                          <button
                            onClick={() => handleEditForm(page.key)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm cursor-pointer"
                          >
                            {t('edit', { default: 'Edit' })}
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(page.key, e)}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm cursor-pointer"
                          >
                            {t('delete', { default: 'Delete' })}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleCreateForm(page.key as PageKey)}
                          className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm cursor-pointer"
                        >
                          {t('createForm', { default: 'Create Form' })}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('confirmDelete', { default: 'Confirm Delete' })}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('confirmDeleteMessage', { 
                  default: 'Are you sure you want to delete the form for "{pageName}"? This action cannot be undone.',
                  pageName: deleteModal.pageName 
                })}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {t('cancel', { default: 'Cancel' })}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {deleting ? t('deleting', { default: 'Deleting...' }) : t('delete', { default: 'Delete' })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

