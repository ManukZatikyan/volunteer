import { ReactNode } from 'react';

// Root layout for next-intl - must be minimal
// The actual HTML structure is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

