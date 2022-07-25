import { Form, Formik } from "formik";
import "react-phone-number-input/style.css";
import { MobilePhoneValidationSchema } from "../ValidationSchema";
import MobilePhoneInputField from "../../../forms/MobilePhoneInputField";
import { Button } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import {
  incrementSmsSection,
  resetError,
  updateUserAttributes,
  verifyPhone
} from "../../../../redux/slices/userSlice";
import { CognitoUser } from "@aws-amplify/auth";
import store from "../../../../redux/store/store";
import { Panel } from "nhsuk-react-components/dist/deprecated";
interface IVerifySms {
  user: CognitoUser;
}

const VerifySms = ({ user }: IVerifySms) => {
  const dispatch = useAppDispatch();

  const updatePhoneAttrib = async (mobNo: string) => {
    const attrib = { phone_number: mobNo };
    await dispatch(updateUserAttributes({ user, attrib }));
    return store.getState().user.status;
  };

  const verifPhone = async () => {
    await dispatch(verifyPhone());
    return store.getState().user.status;
  };

  const handleSmsVerify = async (mobilePhoneNumber: string) => {
    const res = await updatePhoneAttrib(mobilePhoneNumber);
    if (res === "succeeded") {
      const resV = await verifPhone();
      if (resV === "succeeded") {
        dispatch(resetError());
        dispatch(incrementSmsSection());
      }
    }
  };

  return (
    <Formik
      initialValues={{ mobilePhoneNumber: "" }}
      onSubmit={values => {
        handleSmsVerify(values.mobilePhoneNumber);
      }}
      validationSchema={MobilePhoneValidationSchema}
    >
      {({ isValid, isSubmitting }) => (
        <Form>
          <Panel label="I want to receive codes sent by SMS to this mobile">
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
