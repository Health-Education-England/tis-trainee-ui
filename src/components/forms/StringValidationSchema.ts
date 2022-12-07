import * as yup from "yup";

export const StringValidationSchema = (
  fieldName: string,
  maxLength: number = 100
) =>
  yup
    .string()
    .nullable()
    .transform(value => {
      if (value && value.length > 0) return (value as string).trim();
    })
    .min(1)
    .max(maxLength, `${fieldName} must be shorter than ${maxLength} characters`)
    .required(`${fieldName} is required`);
