'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAdminLocale } from '@/lib/admin-locale';

interface PageMetadata {
  key: string;
  name: string;
  route: string;
}

export default function AdminDashboard() {
  const t = useTranslations('admin.dashboard');
  const { locale, setLocale } = useAdminLocale();
  const [pages, setPages] = useState<PageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadPages();
  }, []);

  const checkAuthAndLoadPages = async () => {
    try {
      // Check authentication
      const authResponse = await fetch('/api/admin/check-auth');
      const authData = await authResponse.json();

      if (!authData.authenticated) {
        router.push('/admin');
        return;
      }

      // Load pages
      const pagesResponse = await fetch('/api/admin/pages');
      if (!pagesResponse.ok) {
        throw new Error('Failed to load pages');
      }

      const pagesData = await pagesResponse.json();
      setPages(pagesData.pages || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      router.push('/admin');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">{t('edit.loading')}</div>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <div className="flex items-center gap-4">
              {/* Language Switcher Links */}
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
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 !text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('pages')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('pagesDescription')}
            </p>
          </div>
          <Link
            href="/admin/forms"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t('manageForms', { default: 'Manage Forms' })}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Link
              key={page.key}
              href={`/admin/edit/${page.key}`}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {page.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Route: {page.route}
              </p>
            </Link>
          ))}
        </div>

        {pages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t('noPages')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

