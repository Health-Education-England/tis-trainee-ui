import { Form, Formik } from "formik";
import { Button, Card } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import TextInputField from "../../../forms/TextInputField";
import { VerifySMSCodeValidationSchema } from "../ValidationSchema";
import {
  decrementSmsSection,
  getPreferredMfa,
  resetError,
  setPreferredMfa,
  verifyUserAttributeSubmit
} from "../../../../redux/slices/userSlice";
import store from "../../../../redux/store/store";
import history from "../../../navigation/history";
import { MFAType } from "../../../../models/MFAStatus";
import { ToastType, showToast } from "../../../common/ToastMessage";
import { toastSuccessText } from "../../../../utilities/Constants";

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
        await dispatch(getPreferredMfa());
        history.push("/home");
        showToast(toastSuccessText.getPreferredMfaSms, ToastType.SUCCESS);
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
