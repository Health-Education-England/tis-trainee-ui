import { Form, Formik } from "formik";
import { Button, Panel } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import TextInputField from "../../../forms/TextInputField";
import { VerifySMSCodeValidationSchema } from "../ValidationSchema";
import { CognitoUser } from "@aws-amplify/auth";
import {
  decrementSmsSection,
  setPreferredMfa,
  verifyUserAttributeSubmit
} from "../../../../redux/slices/userSlice";
import store from "../../../../redux/store/store";
import history from "../../../navigation/history";
interface IConfirmSms {
  user: CognitoUser;
}

const ConfirmSms = ({ user }: IConfirmSms) => {
  const dispatch = useAppDispatch();

  const verifyCodeSub = async (vals: any) => {
    const codeSubObj = {
      attrib: "phone_number",
      code: vals["smsCode"]
    };
    await dispatch(verifyUserAttributeSubmit(codeSubObj));
  };

  const updateMfa = async () => {
    const upMfaObj = {
      user,
      pref: "SMS"
    };
    await dispatch(setPreferredMfa(upMfaObj));
  };

  const handleCodeSub = async (formVals: any) => {
    await verifyCodeSub(formVals);
    const statusAfterCodeVerif = store.getState().user.status;
    if (statusAfterCodeVerif === "succeeded") {
      await updateMfa();
      const statusAfterMfaUpdate = store.getState().user.status;
      if (statusAfterMfaUpdate === "succeeded") {
        history.push("/profile");
      } else dispatch(decrementSmsSection());
    } else dispatch(decrementSmsSection());
  };

  return (
    <Formik
      initialValues={{ smsCode: "" }}
      onSubmit={values => {
        handleCodeSub(values);
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
