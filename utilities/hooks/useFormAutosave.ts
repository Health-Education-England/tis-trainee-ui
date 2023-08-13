import { MutableRefObject, useEffect, useState } from "react";
import { autosaveFormR } from "../FormBuilderUtilities";

const useFormAutosave = (
  formData: any,
  formName: string,
  isFormDirty: MutableRefObject<boolean>
) => {
  const [formFields, setFormFields] = useState(formData);

  useEffect(() => {
    if (isFormDirty.current) {
      const timeoutId = setTimeout(() => {
        autosaveFormR(formName, formFields);
      }, 5000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [formFields]);

  return { formFields, setFormFields };
};

export default useFormAutosave;
