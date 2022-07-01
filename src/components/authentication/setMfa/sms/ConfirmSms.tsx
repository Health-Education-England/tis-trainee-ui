import { Form, Formik } from "formik";
import { Button, Panel } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import TextInputField from "../../../forms/TextInputField";
import { VerifySMSCodeValidationSchema } from "../ValidationSchema";
import { CognitoUser } from "@aws-amplify/auth";
import {
  decrementSmsSection,
  resetError,
  setPreferredMfa,
  verifyUserAttributeSubmit
} from "../../../../redux/slices/userSlice";
import store from "../../../../redux/store/store";
import history from "../../../navigation/history";
import { MFAType } from "../../../../models/MFAStatus";
interface IConfirmSms {
  user: CognitoUser;
}

const ConfirmSms = ({ user }: IConfirmSms) => {
  const dispatch = useAppDispatch();

  const verifyCodeSub = async (code: string) => {
    dispatch(resetError);
    const attrib: string = "phone_number";
    await dispatch(verifyUserAttributeSubmit({ attrib, code }));
    return store.getState().user.status;
  };

  const updateMfa = async () => {
    dispatch(resetError);
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
      const res = await updateMfa();
      if (res === "succeeded") {
        history.push("/profile");
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
          <Panel
            label="Enter the 6-digit code sent to your phone"
            style={{ backgroundColor: "aliceblue" }}
          >
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
