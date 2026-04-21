import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button } from "nhsuk-react-components";
import TextInputField from "../forms/TextInputField";

export type EmailDataType = {
  email: string;
};

type EmailFormDataType = EmailDataType & {
  confirmEmail: string;
};

type EmailEditFormProps = {
  onSubmit: (data: EmailDataType) => void;
};

export const emailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .nullable()
    .email("Email address is invalid")
    .max(255, "Email must be shorter than 255 characters")
    .required("Email address is required"),
  confirmEmail: Yup.string()
    .nullable()
    .email("Email address is invalid")
    .max(255, "Email must be shorter than 255 characters")
    .required("Confirm email address is required")
    .oneOf([Yup.ref("email")], "Email addresses must match")
});

export function EmailEditForm({ onSubmit }: Readonly<EmailEditFormProps>) {
  return (
    <Formik
      initialValues={{
        email: "",
        confirmEmail: ""
      }}
      validationSchema={emailValidationSchema}
      onSubmit={(data: EmailFormDataType) => onSubmit({ email: data.email })}
    >
      {({ dirty, isValid }) => (
        <Form>
          <TextInputField
            label="Enter your new email address"
            type="email"
            name="email"
            width={30}
            placeholder="Enter email address"
            maxLength={255}
          />
          <TextInputField
            label="Confirm your new email address"
            type="email"
            name="confirmEmail"
            width={30}
            placeholder="Confirm email address"
            maxLength={255}
          />
          <div id="email-btns">
            <Button
              type="submit"
              disabled={!dirty || !isValid}
              data-cy="email-edit-btn"
            >
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
