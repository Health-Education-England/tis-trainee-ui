import { Form, Formik } from "formik";
import { Button, Card } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import TextInputField from "../../../forms/TextInputField";
import { VerifySMSCodeValidationSchema } from "../ValidationSchema";
import {
  decrementSmsSection,
  getPreferredMfa,
  resetError
} from "../../../../redux/slices/userSlice";
import history from "../../../navigation/history";
import { ToastType, showToast } from "../../../common/ToastMessage";
import { toastSuccessText } from "../../../../utilities/Constants";
import { confirmUserAttribute, updateMFAPreference } from "aws-amplify/auth";

const ConfirmSms = () => {
  const dispatch = useAppDispatch();

  const handleSmsSub = async (smsCode: string) => {
    const stepBack = () => {
      dispatch(resetError());
      dispatch(decrementSmsSection());
    };
    try {
      await confirmUserAttribute({
        userAttributeKey: "phone_number",
        confirmationCode: smsCode
      });
      const mfaPrefObj: { [key: string]: string } = {
        sms: "PREFERRED"
      };
      await updateMFAPreference(mfaPrefObj);
      await dispatch(getPreferredMfa());
      history.push("/home");
      showToast(toastSuccessText.getPreferredMfaSms, ToastType.SUCCESS);
    } catch (error) {
      console.error("Failed to set up SMS MFA: ", error);
      showToast("Failed to set up SMS MFA. Please try again.", ToastType.ERROR);
      stepBack();
    }
  };

  return (
    <Formik
      initialValues={{ smsCode: "" }}
      onSubmit={values => {
        handleSmsSub(values.smsCode);
      }}
      validationSchema={VerifySMSCodeValidationSchema}
    >
      {({ isValid, isSubmitting }) => (
        <Form>
          <Card feature>
            <Card.Content>
              <Card.Heading>
                Enter the 6-digit code sent to your phone
              </Card.Heading>
              <TextInputField
                footer="It may take a minute to arrive."
                name="smsCode"
                placeholder="Enter code"
                label={""}
                maxLength={6}
              />
            </Card.Content>
          </Card>
          <Button
            disabled={!isValid || isSubmitting}
            type="submit"
            data-cy="BtnSmsCodeSub"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ConfirmSms;
