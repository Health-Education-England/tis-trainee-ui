import { useState } from "react";

export function useSubmitting() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startSubmitting = () => setIsSubmitting(true);
  const stopSubmitting = () => setIsSubmitting(false);

  return {
    isSubmitting,
    startSubmitting,
    stopSubmitting
  };
}
