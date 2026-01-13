"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import DynamicForm from "./DynamicForm";

export default function Registration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const pageKey = searchParams?.get("pageKey");

  // Redirect if no pageKey is provided
  useEffect(() => {
    if (!pageKey) {
      router.push(`/${locale}`);
    }
  }, [pageKey, locale, router]);

  // If no pageKey, show loading (will redirect)
  if (!pageKey) {
    return (
      <div className="flex items-center justify-center bg-primary-default">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show dynamic form for the pageKey
  return <DynamicForm pageKey={pageKey} />;
}
