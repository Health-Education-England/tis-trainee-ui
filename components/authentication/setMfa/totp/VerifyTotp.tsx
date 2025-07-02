import {
  ActionLink,
  Button,
  Card,
  Details,
  Fieldset,
  Form,
  Input,
  WarningCallout
} from "nhsuk-react-components";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  getPreferredMfa,
  resetError,
  updatedTotpSection
} from "../../../../redux/slices/userSlice";
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
  updateUserAttribute
} from "aws-amplify/auth";

const VerifyTotp = () => {
  const dispatch = useAppDispatch();
  const totpName = "NHS TIS Self-Service";
  const totpStr = useAppSelector(state => state.user.totpCode);
  const username = useAppSelector(state => state.user.username);
  const qrCode = `otpauth://totp/${encodeURI(
    totpName
  )}:${username}?secret=${totpStr}&issuer=${encodeURI(totpName)}`;

  const [expired, setExpired] = useState(false);
  useEffect(() => {
    let timeOut = setTimeout(() => setExpired(true), 180000);
    if (expired) {
      dispatch(updatedTotpSection(1));
      dispatch(resetError());
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [expired, dispatch]);

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
      dispatch(updatedTotpSection(1));
      dispatch(resetError());
    }
  };

  return (
    <>
      <WarningCallout>
        <WarningCallout.Label visuallyHiddenText={false}>
          Remember
        </WarningCallout.Label>
        <p data-cy="threeMinReminderText">
          You have <strong>3 minutes</strong> to scan the QR code below using
          your Authenticator App on your phone before it expires.
        </p>
      </WarningCallout>
      <Card feature data-cy="addTssTotpHeader">
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
          <Card feature className={styles.panelBack}>
            <Card.Content>
              <Card.Heading>using your phone</Card.Heading>
              <Fieldset.Legend size="m">
                Open your Authenticator App, click &#39;add a new account&#39;
                button then scan the QR Code below.
              </Fieldset.Legend>
              <div className={styles.qrTss}>
                <QRCodeSVG
                  data-cy="tssQrCode"
                  size={192}
                  value={qrCode}
                  includeMargin={true}
                />
              </div>
              <Details>
                <Details.Summary data-cy="tssQrCodeHelp">
                  Unable to scan QR code?
                </Details.Summary>
                <Details.Text>
                  <p>
                    If you are not using a mobile Authenticator App or are
                    unable to see the QR code, you can enter the following code
                    instead.
                  </p>
                  <Input
                    data-cy="tssQrCodeStr"
                    onFocus={event => event.target.select()}
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
                        handleSubmit();
                      }}
                      disabled={!isValid || isSubmitting}
                      data-cy="BtnTotpCodeSub"
                    >
                      {isSubmitting ? "Verifying..." : " Verify code & Log in"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Content>
          </Card>
        </Card.Content>
      </Card>
    </>
  );
};

export default VerifyTotp;
