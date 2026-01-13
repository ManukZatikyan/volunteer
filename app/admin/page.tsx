'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAdminLocale } from '@/lib/admin-locale';

export default function AdminLogin() {
  const t = useTranslations('admin.login');
  const { locale, setLocale } = useAdminLocale();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    fetch('/api/admin/check-auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push('/admin/dashboard');
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'loginFailed';
        setError(t(`errors.${errorMsg}` as any, { default: errorMsg }));
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError(t('errors.errorOccurred'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-end mb-4">
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
        </div>
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('description')}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
              placeholder={t('passwordPlaceholder')}
            />
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium !text-white bg-primary-default hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-default disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? t('loggingIn') : t('signIn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

