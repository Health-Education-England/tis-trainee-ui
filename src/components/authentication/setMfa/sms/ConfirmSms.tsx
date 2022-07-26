import { Form, Formik } from "formik";
import { Button } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import TextInputField from "../../../forms/TextInputField";
import { VerifySMSCodeValidationSchema } from "../ValidationSchema";
import { CognitoUser } from "@aws-amplify/auth";
import {
  decrementSmsSection,
  resetError,
  resetUser,
  setPreferredMfa,
  verifyUserAttributeSubmit
} from "../../../../redux/slices/userSlice";
import store from "../../../../redux/store/store";
import history from "../../../navigation/history";
import { MFAType } from "../../../../models/MFAStatus";
import { addNotification } from "../../../../redux/slices/notificationsSlice";
import { Panel } from "nhsuk-react-components/dist/deprecated";
interface IConfirmSms {
  user: CognitoUser;
}

const ConfirmSms = ({ user }: IConfirmSms) => {
  const dispatch = useAppDispatch();

  const verifyCodeSub = async (code: string) => {
    const attrib: string = "phone_number";
    await dispatch(verifyUserAttributeSubmit({ attrib, code }));
    return store.getState().user.status;
  };

  const updateMfa = async () => {
    const pref: MFAType = "SMS";
    await dispatch(setPreferredMfa({ user, pref }));
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
        dispatch(resetUser());
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
          <Panel label="Enter the 6-digit code sent to your phone">
            <TextInputField
              footer="It may take a minute to arrive."
              name="smsCode"
              placeholder="Enter code"
              label={""}
            />
          </Panel>

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
