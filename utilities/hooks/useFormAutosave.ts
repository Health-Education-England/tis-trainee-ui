import { useEffect } from "react";
import {
  FormDataType,
  saveDraftForm
} from "../../utilities/FormBuilderUtilities";
import { Form } from "../../components/forms/form-builder/FormBuilder";

const useFormAutosave = (
  jsonForm: Form,
  formData: FormDataType,
  isFormDirty: boolean
) => {
  const formName = jsonForm.name;
  useEffect(() => {
    if (isFormDirty) {
      const timeoutId = setTimeout(() => {
        saveDraftForm(jsonForm, formData, true, false, false, false);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [formData, formName, isFormDirty]);
};

export default useFormAutosave;
