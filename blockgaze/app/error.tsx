"use client";

import { ErrorState } from "@/components/States";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorState
      title="Something went wrong"
      message="This page failed to load. Trying again often fixes it."
      onRetry={reset}
    />
  );
}
