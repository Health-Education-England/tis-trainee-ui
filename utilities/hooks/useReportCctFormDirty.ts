import { useEffect } from "react";
import { useFormContext } from "../../components/forms/form-builder/FormContext";

export function useReportCctFormDirty(
  onDirtyChange: (isDirty: boolean) => void
) {
  const { isFormDirty } = useFormContext();

  useEffect(() => {
    if (!isFormDirty) return;
    onDirtyChange(true);
    return () => onDirtyChange(false);
  }, [isFormDirty, onDirtyChange]);
}
