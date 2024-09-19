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
      .length(7, "GMC number must be 7 digits")
      .required("GMC number is required.")
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
            label="GMC number"
            type="string"
            name="propGmcNumber"
            width={10}
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
