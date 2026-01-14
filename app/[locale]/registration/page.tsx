"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Loading } from "@/components";
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
      <div className="flex items-center justify-center min-h-screen bg-primary-default">
        <Loading size={300} loop />
      </div>
    );
  }

  // Show dynamic form for the pageKey
  return <DynamicForm pageKey={pageKey} />;
}
