import { useEffect } from "react";
import { saveFormR } from "../../utilities/FormBuilderUtilities";
import { Form } from "../../components/forms/form-builder/FormBuilder";
import { FormRPartA } from "../../models/FormRPartA";
import { FormRPartB } from "../../models/FormRPartB";
import { LtftObj } from "../../redux/slices/ltftSlice";

const useFormAutosave = (
  jsonForm: Form,
  formData: FormRPartA | FormRPartB | LtftObj,
  isFormDirty: boolean
) => {
  const formName = jsonForm.name;
  useEffect(() => {
    // TODO needs ltft implementation
    if (isFormDirty && formName !== "ltft") {
      const timeoutId = setTimeout(() => {
        saveFormR(jsonForm, formData as FormRPartA | FormRPartB, true, false);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [formData, formName, isFormDirty]);
};

export default useFormAutosave;
