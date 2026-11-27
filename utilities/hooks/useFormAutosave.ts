import { useEffect, useRef } from "react";
import {
  FormDataType,
  saveDraftForm
} from "../../utilities/FormBuilderUtilities";
import { Form } from "../../components/forms/form-builder/FormBuilder";

const useFormAutosave = (
  jsonForm: Form | undefined,
  formData: FormDataType,
  setIsAutoSaving: (isAutoSaving: boolean) => void,
  isEnabled: boolean = true
) => {
  const formName = jsonForm?.name;
  const firstRender = useRef(false);

  useEffect(() => {
    firstRender.current = true;
  }, []);

  useEffect(() => {
    if (!isEnabled || !jsonForm) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setIsAutoSaving(true);
    const timeoutId = setTimeout(() => {
      saveDraftForm(jsonForm, formData, true, false, false, false).finally(() =>
        setIsAutoSaving(false)
      );
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      setIsAutoSaving(false);
    };
  }, [formData, formName, setIsAutoSaving, isEnabled]);
};

export default useFormAutosave;
