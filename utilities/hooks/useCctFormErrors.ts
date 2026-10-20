import { useState } from "react";
import { AnyObjectSchema } from "yup";
import { Field } from "../../components/forms/form-builder/FormBuilder";
import { useFormContext } from "../../components/forms/form-builder/FormContext";
import { validateCctFields } from "../../components/forms/cct/cctValidationSchema";

export function useCctFormErrors(fields: Field[], schema: AnyObjectSchema) {
  const { formData } = useFormContext();
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const errors = isSubmitAttempted
    ? validateCctFields(fields, formData, schema)
    : {};

  const isValidOnSubmit = () => {
    setIsSubmitAttempted(true);
    return (
      Object.keys(validateCctFields(fields, formData, schema)).length === 0
    );
  };

  return { errors, isValidOnSubmit };
}
