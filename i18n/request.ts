import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'hy'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale) {
    locale = defaultLocale;
  }
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const validatedLocale = locale as Locale;

  return {
    locale: validatedLocale,
    messages: (await import(`../messages/${validatedLocale}.json`)).default
  };
});

