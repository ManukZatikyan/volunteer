import { ReactNode } from 'react';
import { AdminLocaleProvider } from '@/lib/admin-locale';
import '../[locale]/globals.css';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 dark:bg-gray-900">
        <AdminLocaleProvider>
          {children}
        </AdminLocaleProvider>
      </body>
    </html>
  );
}

