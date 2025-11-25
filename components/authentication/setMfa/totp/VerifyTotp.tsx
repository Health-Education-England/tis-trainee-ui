import {
  ActionLink,
  Button,
  Card,
  Details,
  Fieldset,
  Form,
  Legend,
  TextInput,
  WarningCallout
} from "nhsuk-react-components";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import { getPreferredMfa } from "../../../../redux/slices/userSlice";
import { QRCodeSVG } from "qrcode.react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInputField from "../../../../components/forms/TextInputField";
import history from "../../../navigation/history";
import styles from "../../../authentication/Auth.module.scss";
import { ToastType, showToast } from "../../../common/ToastMessage";
import { toastSuccessText } from "../../../../utilities/Constants";
import {
  updateMFAPreference,
  verifyTOTPSetup,
  updateUserAttribute,
  getCurrentUser,
  setUpTOTP
} from "aws-amplify/auth";
import ErrorPage from "../../../common/ErrorPage";
import Loading from "../../../common/Loading";

const VerifyTotp = () => {
  const dispatch = useAppDispatch();
  const totpName = "NHS TIS Self-Service";
  const [isLoading, setIsLoading] = useState(true);
  const [qrCode, setQrCode] = useState("");
  const [totpStr, setTotpStr] = useState("");
  const setupTOTPRef = useRef(false);
  const [isExpired, setIsExpired] = useState(false);
  const [errorQR, setErrorQR] = useState(false);
  const [errorVerifyCode, setErrorVerifyCode] = useState(false);

  const generateQrCode = async () => {
    setIsLoading(true);
    setIsExpired(false);
    setErrorQR(false);
    try {
      const { username } = await getCurrentUser();
      const { sharedSecret } = await setUpTOTP();
      setTotpStr(sharedSecret);
      setQrCode(
        `otpauth://totp/${encodeURI(
          totpName
        )}:${username}?secret=${sharedSecret}&issuer=${encodeURI(totpName)}`
      );
    } catch (error) {
      console.error("Failed to set up TOTP: ", error);
      setErrorQR(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!setupTOTPRef.current) {
      setupTOTPRef.current = true;
      generateQrCode();
    }
    const timeOut = setTimeout(() => {
      setIsExpired(true);
    }, 180000);

    return () => clearTimeout(timeOut);
  }, []);

  const handleTotpSub = async (totpStr: string) => {
    try {
      await verifyTOTPSetup({ code: totpStr });
      const mfaPrefObj: { [key: string]: string } = {
        totp: "PREFERRED"
      };
      await updateMFAPreference(mfaPrefObj);

      const attrib = { key: "phone_number", value: "" };
      await updateUserAttribute({
        userAttribute: {
          attributeKey: attrib.key,
          value: attrib.value
        }
      });
      await dispatch(getPreferredMfa());
      history.push("/home");
      showToast(toastSuccessText.getPreferredMfaTotp, ToastType.SUCCESS);
    } catch (error) {
      console.error("Failed to set up TOTP MFA: ", error);
      setErrorVerifyCode(true);
    }
  };

  return (
    <>
      <WarningCallout>
        <WarningCallout.Heading visuallyHiddenText={false}>
          Remember
        </WarningCallout.Heading>
        <p data-cy="threeMinReminderText">
          You have <strong>3 minutes</strong> to scan the QR code below using
          your Authenticator App on your phone before it expires.
        </p>
      </WarningCallout>
      <Card cardType="feature" data-cy="addTssTotpHeader">
        <Card.Content>
          <Card.Heading>
            Add &#39;NHS TIS-Self-Service&#39; to your Authenticator App
          </Card.Heading>
          <Details>
            <Details.Summary data-cy="msAuthInfoSummary">
              Need help?
            </Details.Summary>
            <Details.Text data-cy="msAuthInfoText">
              <ActionLink
                data-cy="dataSourceLink"
                target="_blank"
                rel="noopener noreferrer"
                href="https://tis-support.hee.nhs.uk/trainees/how-to-set-up-an-authenticator-app-on-your-phone/"
              >
                Click here for help adding the &#39;NHS TIS Self-Service&#39;
                account to your Authenticator App on your phone (opens in a new
                tab/window)
              </ActionLink>
            </Details.Text>
          </Details>
          <Card cardType="feature" className={styles.panelBack}>
            <Card.Content>
              <Card.Heading>using your phone</Card.Heading>
              <Fieldset>
                <Legend size="m">
                  Open your Authenticator App, click &#39;add a new account&#39;
                  button then scan the QR Code below.
                </Legend>
              </Fieldset>
              <div className={styles.qrTss}>
                <RenderQRCodeContent
                  qrCode={qrCode}
                  isLoading={isLoading}
                  isExpired={isExpired}
                  errorQR={errorQR}
                  generateQrCode={generateQrCode}
                />
              </div>
              {isExpired || isLoading ? null : (
                <>
                  <Details>
                    <Details.Summary data-cy="tssQrCodeHelp">
                      Unable to scan QR code?
                    </Details.Summary>
                    <Details.Text>
                      <p>
                        If you are not using a mobile Authenticator App or are
                        unable to see the QR code, you can enter the following
                        code instead.
                      </p>
                      <TextInput
                        data-cy="tssQrCodeStr"
                        onFocus={(event: React.FocusEvent<HTMLInputElement>) =>
                          event.target.select()
                        }
                        defaultValue={totpStr}
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
                    onSubmit={values => handleTotpSub(values.confirmTOTPCode)}
                  >
                    {({ isValid, isSubmitting, handleSubmit }) => (
                      <Form>
                        <TextInputField
                          width={10}
                          name="confirmTOTPCode"
                          label="Enter the 6-digit code from the 'NHS TIS Self-Service' account installed on your phone."
                          placeholder="6-digit code"
                        />
                        <Button
                          onClick={(e: { preventDefault: () => void }) => {
                            e.preventDefault();
                            setErrorVerifyCode(false);
                            handleSubmit();
                          }}
                          disabled={!isValid || isSubmitting}
                          data-cy="BtnTotpCodeSub"
                        >
                          {isSubmitting
                            ? "Verifying..."
                            : " Verify code & Log in"}
                        </Button>
                        {errorVerifyCode && (
                          <ErrorPage message="There was an error verifying the TOTP code. Please try again." />
                        )}
                      </Form>
                    )}
                  </Formik>
                </>
              )}
            </Card.Content>
          </Card>
        </Card.Content>
      </Card>
    </>
  );
};
export default VerifyTotp;

type RenderQRCodeContentProps = {
  qrCode: string;
  isLoading: boolean;
  isExpired: boolean;
  errorQR: boolean;
  generateQrCode: () => void;
};

export function RenderQRCodeContent({
  qrCode,
  isLoading,
  isExpired,
  errorQR,
  generateQrCode
}: Readonly<RenderQRCodeContentProps>) {
  if (isLoading) {
    return (
      <>
        <p>Generating your QR code...</p>
        <Loading data-cy="loadingQrCode" />
      </>
    );
  }

  if (errorQR) {
    return (
      <div>
        <ErrorPage message="There was an error generating a QR Code. Please try again." />
        <Button onClick={generateQrCode} data-cy="refreshQrCodeBtnError">
          Generate new QR Code
        </Button>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div>
        <p data-cy="qrCodeExpired">
          The QR code has expired. Please generate a new one.
        </p>
        <Button onClick={generateQrCode} data-cy="refreshQrCodeBtn">
          Generate New QR Code
        </Button>
      </div>
    );
  }

  return (
    <QRCodeSVG
      data-cy="tssQrCode"
      size={192}
      value={qrCode}
      includeMargin={true}
    />
  );
}
