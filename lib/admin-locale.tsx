'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Loading } from '@/components';

interface AdminLocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  messages: any;
}

const AdminLocaleContext = createContext<AdminLocaleContextType | undefined>(undefined);

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState('en');
  const [messages, setMessages] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load locale from localStorage or default to 'en'
    const savedLocale = typeof window !== 'undefined' ? (localStorage.getItem('admin-locale') || 'en') : 'en';
    setLocaleState(savedLocale);
    loadMessages(savedLocale).finally(() => setLoading(false));
  }, []);

  const loadMessages = async (newLocale: string) => {
    try {
      const module = await import(`../messages/${newLocale}.json`);
      setMessages(module.default);
    } catch {
      // Fallback to English if locale messages don't exist
      try {
        const module = await import(`../messages/en.json`);
        setMessages(module.default);
      } catch {
        console.error('Failed to load messages');
      }
    }
  };

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-locale', newLocale);
    }
    loadMessages(newLocale);
  };

  // Update html lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  if (loading || !messages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size={240} loop />
      </div>
    );
  }

  return (
    <AdminLocaleContext.Provider value={{ locale, setLocale, messages }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  const context = useContext(AdminLocaleContext);
  if (!context) {
    throw new Error('useAdminLocale must be used within AdminLocaleProvider');
  }
  return context;
}

