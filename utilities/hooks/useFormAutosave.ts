import { useEffect } from "react";
import { autosaveFormR } from "../../utilities/FormBuilderUtilities";
import { FormName } from "../../components/forms/form-builder/FormBuilder";
import { FormRPartA } from "../../models/FormRPartA";
import { FormRPartB } from "../../models/FormRPartB";
import { LtftObj } from "../../redux/slices/ltftSlice";

const useFormAutosave = (
  formName: FormName,
  formData: FormRPartA | FormRPartB | LtftObj,
  isFormDirty: boolean
) => {
  useEffect(() => {
    // TODO needs ltft implementation
    if (isFormDirty && formName !== "ltft") {
      const timeoutId = setTimeout(() => {
        autosaveFormR(formName, formData as FormRPartA | FormRPartB);
      }, 2000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [formData, formName, isFormDirty]);
};

export default useFormAutosave;
