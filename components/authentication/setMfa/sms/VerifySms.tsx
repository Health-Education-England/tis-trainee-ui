import { Form, Formik } from "formik";
import "react-phone-number-input/style.css";
import { MobilePhoneValidationSchema } from "../ValidationSchema";
import MobilePhoneInputField from "../../../../components/forms/MobilePhoneInputField";
import { Button, Card } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import {
  incrementSmsSection,
  resetError
} from "../../../../redux/slices/userSlice";
import {
  sendUserAttributeVerificationCode,
  updateUserAttribute
} from "aws-amplify/auth";

const VerifySms = () => {
  const dispatch = useAppDispatch();
  const stepForward = () => {
    dispatch(resetError());
    dispatch(incrementSmsSection());
  };
  const handleSmsVerify = async (mobilePhoneNumber: string) => {
    try {
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
          {" "}
          <Card feature>
            <Card.Content>
              <Card.Heading>
                I want to receive codes sent by SMS to this mobile
              </Card.Heading>
              <MobilePhoneInputField name="mobilePhoneNumber" />
            </Card.Content>
          </Card>
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
