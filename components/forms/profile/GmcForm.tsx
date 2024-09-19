import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CloseIcon } from "nhsuk-react-components";
import TextInputField from "../TextInputField";
import FieldWarningMsg from "../FieldWarningMsg";
import { resetGmcEdit } from "../../../redux/slices/gmcEditSlice";
import store from "../../../redux/store/store";

type GmcFormProps = {
  currentGmcNumber: string;
  onCalculate: (values: GmcFormValues) => void;
};

export type GmcFormValues = {
  gmcNumber: string;
};

function handleClose() {
  store.dispatch(resetGmcEdit());
}

export function GmcForm({
  currentGmcNumber,
  onCalculate
}: Readonly<GmcFormProps>) {
  const validationSchema = Yup.object().shape({
    gmcNumber: Yup.string()
      .nullable()
      .required("GMC number is required.")
      .test(
        "is-unknown-or-7-digit-number",
        "GMC must be a 7-digit number or UNKNOWN",
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
        gmcNumber: currentGmcNumber
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        onCalculate(values);
      }}
    >
      {({ values, errors, setFieldValue, dirty, isValid }) => (
        <Form>
          <TextInputField
            label="Provide your 7-digit GMC number"
            type="string"
            name="gmcNumber"
            width={10}
            hint="Use 'UNKNOWN' if you don't have this yet"
            placeholder={currentGmcNumber}
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
            <Button
              reverse
              type="button"
              onClick={handleClose}
              title="Close"
              data-cy="gmc-close-btn"
            >
              <CloseIcon />
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
