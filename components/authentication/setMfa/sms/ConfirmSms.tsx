import { Form, Formik } from "formik";
import { Button, Card } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import TextInputField from "../../../forms/TextInputField";
import { VerifySMSCodeValidationSchema } from "../ValidationSchema";
import {
  decrementSmsSection,
  getPreferredMFA,
  resetError,
  setPreferredMfa,
  verifyUserAttributeSubmit
} from "../../../../redux/slices/userSlice";
import store from "../../../../redux/store/store";
import history from "../../../navigation/history";
import { MFAType } from "../../../../models/MFAStatus";
import { addNotification } from "../../../../redux/slices/notificationsSlice";

const ConfirmSms = () => {
  const dispatch = useAppDispatch();

  const verifyCodeSub = async (code: string) => {
    const attrib: string = "phone_number";
    await dispatch(verifyUserAttributeSubmit({ attrib, code }));
    return store.getState().user.status;
  };

  const updateMfa = async () => {
    const pref: MFAType = "SMS";
    await dispatch(setPreferredMfa(pref));
    return store.getState().user.status;
  };

  const handleSmsSub = async (smsCode: string) => {
    const res = await verifyCodeSub(smsCode);
    const stepBack = () => {
      dispatch(resetError());
      dispatch(decrementSmsSection());
    };
    if (res === "succeeded") {
      const resU = await updateMfa();
      if (resU === "succeeded") {
        await dispatch(getPreferredMFA());
        history.push("/profile");
        dispatch(
          addNotification({
            type: "Success",
            text: "- SMS authentication is now set up. You will be asked for a new 6-digit (sent to your phone) each time you log in"
          })
        );
      } else {
        stepBack();
      }
    } else {
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
