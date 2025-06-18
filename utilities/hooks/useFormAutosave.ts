import { useEffect } from "react";
import {
  FormDataType,
  saveDraftForm
} from "../../utilities/FormBuilderUtilities";
import { Form } from "../../components/forms/form-builder/FormBuilder";

const useFormAutosave = (
  jsonForm: Form,
  formData: FormDataType,
  isFormDirty: boolean,
  setIsAutoSaving: (isAutoSaving: boolean) => void
) => {
  const formName = jsonForm.name;
  useEffect(() => {
    if (isFormDirty) {
      setIsAutoSaving(true);
      const timeoutId = setTimeout(() => {
        saveDraftForm(jsonForm, formData, true, false, false, false).finally(
          () => setIsAutoSaving(false)
        );
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [formData, formName, isFormDirty, setIsAutoSaving]);
};

export default useFormAutosave;
