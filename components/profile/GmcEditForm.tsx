import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button } from "nhsuk-react-components";
import TextInputField from "../forms/TextInputField";

export type GmcDataType = {
  gmcNumber: string;
};
type GmcEditFormProps = {
  onSubmit: (data: GmcDataType) => void;
};

export const gmcValidationSchema = Yup.object().shape({
  gmcNumber: Yup.string()
    .nullable()
    .required("GMC number is required.")
    .test("is-7-digit-number", "GMC must be a 7-digit number", value => {
      if (value && value !== null && value !== "") {
        return /^\d{7}$/.test(value);
      }
      return false;
    })
});

export function GmcEditForm({ onSubmit }: Readonly<GmcEditFormProps>) {
  return (
    <Formik
      initialValues={{
        gmcNumber: ""
      }}
      validationSchema={gmcValidationSchema}
      onSubmit={onSubmit}
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
