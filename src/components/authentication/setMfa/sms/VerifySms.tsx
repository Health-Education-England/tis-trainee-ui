import { Form, Formik } from "formik";
import "react-phone-number-input/style.css";
import { MobilePhoneValidationSchema } from "../ValidationSchema";
import MobilePhoneInputField from "../../../forms/MobilePhoneInputField";
import { Button, Panel } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import {
  incrementSmsSection,
  updateUserAttributes,
  verifyPhone
} from "../../../../redux/slices/userSlice";
import { CognitoUser } from "@aws-amplify/auth";
import store from "../../../../redux/store/store";
interface IVerifySms {
  user: CognitoUser;
}

const VerifySms = ({ user }: IVerifySms) => {
  const dispatch = useAppDispatch();

  const updatePhoneAttrib = async (vals: { mobilePhoneNumber: string }) => {
    const updatePhoneAttribObj = {
      user,
      attrib: { phone_number: vals.mobilePhoneNumber }
    };
    await dispatch(updateUserAttributes(updatePhoneAttribObj));
  };

  const verifPhone = async () => {
    await dispatch(verifyPhone());
  };

  const handleSmsVerify = async (formVals: { mobilePhoneNumber: string }) => {
    await updatePhoneAttrib(formVals);
    const statusAfterphoneUpdate = store.getState().user.status;
    if (statusAfterphoneUpdate === "succeeded") {
      await verifPhone();
      const statusAfterVerifyphone = store.getState().user.status;
      if (statusAfterVerifyphone === "succeeded") {
        dispatch(incrementSmsSection());
      }
    }
  };

  return (
    <Formik
      initialValues={{ mobilePhoneNumber: "" }}
      onSubmit={values => {
        handleSmsVerify(values);
      }}
      validationSchema={MobilePhoneValidationSchema}
    >
      {({ isValid, isSubmitting }) => (
        <Form>
          <Panel
            label="I want to receive codes sent by SMS to this mobile"
            style={{ backgroundColor: "aliceblue" }}
          >
            <MobilePhoneInputField name="mobilePhoneNumber" />
          </Panel>

          <Button
            disabled={!isValid || isSubmitting}
            type="submit"
            data-cy="BtnContinue"
          >
            {isSubmitting ? "Sending..." : "Send SMS authentication code"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default VerifySms;
