import { useState } from "react";
import { Auth } from "aws-amplify";
import { Formik, Form } from "formik";
import { Button, ErrorSummary, ErrorMessage } from "nhsuk-react-components";
import TextInputField from "../../forms/TextInputField";
import "react-phone-number-input/style.css";
import MobilePhoneInputField from "../../forms/MobilePhoneInputField";
import { CognitoUser } from "amazon-cognito-identity-js";
import ScrollTo from "../../forms/ScrollTo";
import {
  MobilePhoneValidationSchema,
  VerifySMSCodeValidationSchema
} from "./ValidationSchema";
import "./SetupMFA.scss";
interface ISetSMS {
  user: CognitoUser;
  mfaStatus: string;
  incrementStep?: (increment: number) => void;
}
const SetupSMS = ({ user, incrementStep }: ISetSMS) => {
  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [verifyErrorMessage, setVerifyErrorMessage] = useState("");

  const handleUpdatePhoneSubmit = async (values: any) => {
    setUpdateErrorMessage("");
    setIsSending(true);
    try {
      const phoneNumber = values["mobilePhoneNumber"];
      const updatePhoneStatus = await Auth.updateUserAttributes(user, {
        phone_number: phoneNumber
      });
      if (updatePhoneStatus === "SUCCESS") {
        await Auth.verifyCurrentUserAttribute("phone_number");
        setAuthCodeSent(true);
      } else {
        setUpdateErrorMessage("Unable to update phone number. Please retry.");
      }
    } catch (error) {
      setUpdateErrorMessage((error as Error).message);
    }
    setIsSending(false);
  };

  const handleVerifyCodeSubmit = async (values: any) => {
    setVerifyErrorMessage("");
    setIsSending(true);
    try {
      const verifiedStatus = await Auth.verifyCurrentUserAttributeSubmit(
        "phone_number",
        values["verifySMSCode"]
      );

      if (verifiedStatus === "SUCCESS") {
        await Auth.setPreferredMFA(user, "SMS");
        incrementStep && incrementStep(1);
      } else {
        setVerifyErrorMessage(
          "Unable to verify mobile phone number. Please retry."
        );
      }
    } catch (error) {
      setVerifyErrorMessage((error as Error).message);
    }
    setIsSending(false);
  };

  return (
    <div className="set-sms">
      <div className={`step ${!authCodeSent ? "active" : "disabled"}`}>
        <h3>Step 1</h3>

        <Formik
          initialValues={{ mobilePhoneNumber: "" }}
          onSubmit={values => handleUpdatePhoneSubmit(values)}
          validationSchema={MobilePhoneValidationSchema}
        >
          {({ isValid }) => (
            <Form>
              <MobilePhoneInputField
                label="Enter your mobile phone number below where we will send authentication
          codes during sign in."
                name="mobilePhoneNumber"
              />

              <Button
                disabled={isSending || authCodeSent || !isValid}
                type="submit"
                data-cy="BtnContinue"
              >
                {isSending ? "Sending..." : "Send authentication code"}
              </Button>
            </Form>
          )}
        </Formik>
        {updateErrorMessage && (
          <ErrorSummary
            aria-labelledby="errorSummaryTitle"
            role="alert"
            tabIndex={-1}
          >
            <ErrorMessage>
              <ErrorSummary.Title id="error-summary-title">
                An error has occurred.
              </ErrorSummary.Title>
              <ErrorSummary.Body>{updateErrorMessage}</ErrorSummary.Body>
            </ErrorMessage>
          </ErrorSummary>
        )}
      </div>
      <div className={`step ${authCodeSent ? "active" : "disabled"}`}>
        {authCodeSent && <ScrollTo location="element" scrollType="smooth" />}
        <h3>Step 2</h3>
        <p>
          You should receive a text message from HEE containing your 6-digit
          verification code.
        </p>
        <Formik
          initialValues={{ verifySMSCode: "" }}
          onSubmit={values => handleVerifyCodeSubmit(values)}
          validationSchema={VerifySMSCodeValidationSchema}
        >
          {({ isValid }) => (
            <Form>
              <TextInputField
                footer="It may take a minute to arrive."
                disabled={!authCodeSent}
                label="Enter the code sent to your phone"
                name="verifySMSCode"
                placeholder="6-digit code"
              />
              <Button
                disabled={!authCodeSent || !isValid || isSending}
                type="submit"
                data-cy="BtnContinue"
              >
                {isSending ? "Verifying..." : "Verify code"}
              </Button>
            </Form>
          )}
        </Formik>
        {verifyErrorMessage && (
          <ErrorSummary
            aria-labelledby="errorSummaryTitle"
            role="alert"
            tabIndex={-1}
          >
            <ErrorMessage>
              <ErrorSummary.Title id="error-summary-title">
                An error has occurred.
              </ErrorSummary.Title>
              <ErrorSummary.Body> {verifyErrorMessage}</ErrorSummary.Body>
            </ErrorMessage>
          </ErrorSummary>
        )}
      </div>
    </div>
  );
};

export default SetupSMS;
