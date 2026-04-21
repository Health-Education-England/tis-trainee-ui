import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button } from "nhsuk-react-components";
import TextInputField from "../forms/TextInputField";

export type GmcDataType = {
  gmcNumber: string;
};

type GmcFormDataType = GmcDataType & {
  confirmGmcNumber: string;
};

type GmcEditFormProps = {
  onSubmit: (data: GmcDataType) => void;
};

const isSevenDigitGmcNumber = (value?: string | null) => {
  return !!value && /^\d{7}$/.test(value);
};

export const gmcValidationSchema = Yup.object().shape({
  gmcNumber: Yup.string()
    .nullable()
    .required("GMC number is required.")
    .test(
      "is-7-digit-number",
      "GMC must be a 7-digit number",
      isSevenDigitGmcNumber
    ),
  confirmGmcNumber: Yup.string()
    .nullable()
    .required("Confirm GMC number is required.")
    .test(
      "is-7-digit-number",
      "GMC must be a 7-digit number",
      isSevenDigitGmcNumber
    )
    .oneOf([Yup.ref("gmcNumber")], "GMC numbers must match")
});

export function GmcEditForm({ onSubmit }: Readonly<GmcEditFormProps>) {
  return (
    <Formik
      initialValues={{
        gmcNumber: "",
        confirmGmcNumber: ""
      }}
      validationSchema={gmcValidationSchema}
      onSubmit={(data: GmcFormDataType) =>
        onSubmit({ gmcNumber: data.gmcNumber })
      }
    >
      {({ dirty, isValid }) => (
        <Form>
          <TextInputField
            label="Provide your 7-digit GMC number"
            type="string"
            name="gmcNumber"
            width={10}
            placeholder="Enter GMC number"
            maxLength={7}
          />
          <TextInputField
            label="Confirm your 7-digit GMC number"
            type="string"
            name="confirmGmcNumber"
            width={10}
            placeholder="Confirm GMC number"
            maxLength={7}
          />
          <div id="gmc-btns">
            <Button
              type="submit"
              disabled={!dirty || !isValid}
              data-cy="gmc-edit-btn"
            >
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
