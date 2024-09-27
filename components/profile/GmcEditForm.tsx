import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CloseIcon } from "nhsuk-react-components";
import TextInputField from "../forms/TextInputField";
import store from "../../redux/store/store";

export type GmcDataType = {
  gmcNumber: string;
};
type GmcEditFormProps = {
  onSubmit: (data: GmcDataType) => void;
  warningText: null | string;
  gmcData: GmcDataType;
};

export function GmcEditForm({
  onSubmit,
  warningText,
  gmcData
}: Readonly<GmcEditFormProps>) {
  const validationSchema = Yup.object().shape({
    gmcNumber: Yup.string()
      .nullable()
      .required("GMC number is required.")
      .test(
        "is-unknown-or-7-digit-number",
        "GMC must be a 7-digit number or UNKNOWN", //TODO: remove 'unknown' as an option. Left for now because a handy way of testing API 400-failure
        value => {
          if (value && value !== null && value !== "") {
            if (value.toUpperCase() === "UNKNOWN") {
              return true;
            }
            return /^\d{7}$/.test(value);
          }
          return false;
        }
      )
  });

  return (
    <Formik
      initialValues={{
        gmcNumber: gmcData.gmcNumber
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, setFieldValue, dirty, isValid }) => (
        <Form>
          <TextInputField
            label="Provide your 7-digit GMC number"
            type="string"
            name="gmcNumber"
            width={10}
            hint="Use 'UNKNOWN' if you don't have this yet"
            placeholder={gmcData.gmcNumber}
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
