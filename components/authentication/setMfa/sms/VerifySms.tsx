import { Form, Formik } from "formik";
import "react-phone-number-input/style.css";
import { MobilePhoneValidationSchema } from "../ValidationSchema";
import MobilePhoneInputField from "../../../../components/forms/MobilePhoneInputField";
import { Button, Card } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { incrementSmsSection } from "../../../../redux/slices/userSlice";
import {
  sendUserAttributeVerificationCode,
  updateUserAttribute
} from "aws-amplify/auth";
import { useState } from "react";
import ErrorPage from "../../../common/ErrorPage";
import { useSubmitting } from "../../../../utilities/hooks/useSubmitting";

const VerifySms = () => {
  const dispatch = useAppDispatch();
  const [verifySMSError, setVerifySMSError] = useState(false);
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();

  const stepForward = () => {
    dispatch(incrementSmsSection());
  };
  const handleSmsVerify = async (mobilePhoneNumber: string) => {
    try {
      startSubmitting();
      await updateUserAttribute({
        userAttribute: {
          attributeKey: "phone_number",
          value: mobilePhoneNumber
        }
      });
      await sendUserAttributeVerificationCode({
        userAttributeKey: "phone_number"
      });
      stepForward();
    } catch (error) {
      console.error("Failed to handle SMS verification: ", error);
      setVerifySMSError(true);
    } finally {
      stopSubmitting();
    }
  };

  return (
    <Formik
      initialValues={{ mobilePhoneNumber: "" }}
      onSubmit={values => {
        setVerifySMSError(false);
        handleSmsVerify(values.mobilePhoneNumber);
      }}
      validationSchema={MobilePhoneValidationSchema}
    >
      {({ isValid }) => (
        <Form>
          {" "}
          <Card feature>
            <Card.Content>
              <Card.Heading>
                I want to receive codes sent by SMS to this mobile
              </Card.Heading>
              <MobilePhoneInputField name="mobilePhoneNumber" />
            </Card.Content>
          </Card>
          <Button disabled={!isValid} type="submit" data-cy="BtnContinue">
            {isSubmitting ? "Sending..." : "Send SMS verification code"}
          </Button>
          {verifySMSError && (
            <ErrorPage message="There was a problem setting up your phone for SMS MFA Authentication. Please try again." />
          )}
        </Form>
      )}
    </Formik>
  );
};

export default VerifySms;
