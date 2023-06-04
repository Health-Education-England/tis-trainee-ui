import { useEffect, useState } from "react";
import { LifeCycleState } from "../../models/LifeCycleState";

const useFormAutosave = (formData: any, formName: string) => {
  const [formFields, setFormFields] = useState(formData);

  useEffect(() => {
    const autoSaveToLocalStorage = () => {
      const timeStampedFormFields = {
        ...formFields,
        submissionDate: null,
        lifecycleState: LifeCycleState.Local,
        lastModifiedDate: new Date()
      };
      localStorage.setItem(formName, JSON.stringify(timeStampedFormFields));
    };

    const timeoutId = setTimeout(() => {
      autoSaveToLocalStorage();
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [formFields]);

  return { formFields, setFormFields };
};

export default useFormAutosave;
