import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './request';

export const routing = {
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,
  
  // Always use locale prefix in URLs
  localePrefix: 'always' as const
};

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

