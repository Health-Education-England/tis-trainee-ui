import { MutableRefObject, useEffect, useState } from "react";
import { autosaveFormR } from "../FormBuilderUtilities";

const useFormAutosave = (
  fetchedFormData: any,
  formName: string,
  isFormDirty: MutableRefObject<boolean>
) => {
  const [formData, setFormData] = useState(fetchedFormData);

  useEffect(() => {
    if (isFormDirty.current) {
      const timeoutId = setTimeout(() => {
        autosaveFormR(formName, formData);
      }, 2000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [formData]);

  return { formData, setFormData };
};

export default useFormAutosave;
