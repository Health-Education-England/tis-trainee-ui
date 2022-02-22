import { useState, useEffect, FocusEvent } from "react";
import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
import {
  Input,
  Button,
  Details,
  ErrorSummary,
  WarningCallout
} from "nhsuk-react-components";
import QRCode from "qrcode.react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInputField from "../../forms/TextInputField";
import { MFAStatus } from "../../../models/MFAStatus";
import styles from "./MFA.module.scss";
interface ISetupMFA {
  user: CognitoUser;
  mfaStatus: string;
  incrementStep?: (increment: number) => void;
}

const SetupTOTP = ({ user, mfaStatus, incrementStep }: ISetupMFA) => {
  const [code, setCode] = useState("");
  const [qrCode, setQRCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [expired, setExpired] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const totpCode: string = await Auth.setupTOTP(user);
        const name = "NHS TIS Self-Service";
        const authCode: string = `otpauth://totp/${encodeURI(
          name
        )}:${user.getUsername()}?secret=${totpCode}&issuer=${encodeURI(name)}`;
        setCode(totpCode);
        setQRCode(authCode);
        let timeOut = setTimeout(() => setExpired(true), 180000);
        return () => {
          clearTimeout(timeOut);
        };
      } catch (err) {
        setErrorMessage("Unable to get user. " + err);
      }
    };
    getUser();
  }, [user]);

  useEffect(() => {
    if (expired) {
      incrementStep && incrementStep(-1);
    }
  }, [expired, incrementStep]);

  const handleSubmit = async (values: { confirmTOTPCode: string }) => {
    setIsSending(true);

    try {
      await Auth.verifyTotpToken(user, values.confirmTOTPCode);
      const result = await Auth.setPreferredMFA(user, "TOTP");
      if (result === "SUCCESS") {
        // This step is necessary to prevent MFA reverting to SMS. It's a Cognito bug.
        // https://github.com/aws-amplify/amplify-js/issues/7254
        // https://github.com/aws-amplify/amplify-js/issues/1226
        incrementStep && incrementStep(1);
        await Auth.currentAuthenticatedUser();
      }
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
    setIsSending(false);
  };

  return (
    <div className={styles.setupTOTP}>
      {qrCode !== "" && (
        <div>
          {mfaStatus === MFAStatus.TOTP && (
            <WarningCallout label="Authenticator already setup">
              <p>
                You have already registered Self-Service with an authenticator
                application. You can continue with the setup process to
                re-register but this will disable the previously registered
                authenticator account.
              </p>
            </WarningCallout>
          )}
          <WarningCallout label="Warning">
            <p>
              As part of inbuilt measures to secure your data, you have{" "}
              <strong>3 minutes</strong> to scan the QR code below and generate
              a Security Code before it expires, after which the screen will
              refresh.
            </p>
          </WarningCallout>
          <p>
            Scan the QR code below using your preferred authenticator
            application.
          </p>
          <div>
            <div style={{ padding: "20px" }}>
              <QRCode size={192} value={qrCode} />
            </div>

            <Details>
              <Details.Summary>Unable to scan QR code?</Details.Summary>
              <Details.Text>
                <p>
                  If you are not using a mobile authentication app or are unable
                  to see the QR code, you can enter the following code manually
                  into your authentication application.
                </p>
                <Input
                  onFocus={(event: FocusEvent<HTMLInputElement>) =>
                    event.target.select()
                  }
                  defaultValue={code}
                  label=""
                  readOnly
                />
              </Details.Text>
            </Details>

            <Formik
              initialValues={{ confirmTOTPCode: "" }}
              validationSchema={Yup.object({
                confirmTOTPCode: Yup.string()
                  .required("TOTP code required")
                  .min(6, "Code must be min 6 characters in length")
                  .max(6, "Code must be max 6 characters in length")
              })}
              onSubmit={values => handleSubmit(values)}
            >
              {({ isValid }) => (
                <Form>
                  <TextInputField
                    width={10}
                    name="confirmTOTPCode"
                    label="Enter the 6-digit code provided by the application and click Verify code to finish the setup."
                    placeholder="6-digit code"
                  />
                  <Button
                    disabled={!isValid || isSending}
                    type="submit"
                    data-cy="BtnContinue"
                  >
                    {isSending ? "Verifying..." : " Verify security code"}
                  </Button>
                </Form>
              )}
            </Formik>
            {errorMessage && (
              <ErrorSummary
                aria-labelledby="error-summary-title"
                role="alert"
                tabIndex={-1}
              >
                <ErrorSummary.Title id="error-summary-title">
                  An error has occurred.
                </ErrorSummary.Title>

                <ErrorSummary.Body>{errorMessage}</ErrorSummary.Body>
              </ErrorSummary>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupTOTP;
