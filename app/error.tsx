"use client";

import { useEffect } from "react";
import { ErrorLayout } from "@/components/ErrorLayout";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors cleanly to console
    console.error("[Omkarverse App Error]", error);
  }, [error]);

  return (
    <ErrorLayout
      code="500"
      title="Something went wrong"
      message="An unexpected condition was encountered. You can try refreshing or return safely."
      onRetry={() => reset()}
    />
  );
}
