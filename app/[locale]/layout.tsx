import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import { Header } from "@/components";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Montserrat, Noto_Sans_Armenian } from "next/font/google";
import "./globals.css";
import { FooterThemeScript } from "@/components/FooterThemeScript";

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSans = Noto_Sans_Armenian({
  variable: "--font-noto-sans",
  subsets: ["armenian"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  // Providing all messages to the client
  // Explicitly pass locale to ensure correct messages are loaded
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${notoSans.variable} antialiased`}
      >
        <FooterThemeScript />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <ConditionalFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

