import * as yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";

export const VerifyCodeValidationSchema = () =>
  yup
    .string()
    .required("TOTP code required")
    .min(6, "Code must be min 6 characters in length")
    .max(6, "Code must be max 6 characters in length");

export const MobilePhoneValidationSchema = yup.object().shape({
  mobilePhoneNumber: yup
    .string()
    .required("Please enter a mobile phone number")
    .test(
      "is-mobile",
      "Please enter a valid mobile phone number.",
      (value: any) => value && isValidPhoneNumber(value)
    )
});

export const VerifySMSCodeValidationSchema = yup.object().shape({
  verifySMSCode: VerifyCodeValidationSchema()
});
