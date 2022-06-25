import { CognitoUser } from "@aws-amplify/auth";
import {
  ActionLink,
  Button,
  Details,
  Fieldset,
  Form,
  Input,
  Panel,
  WarningCallout
} from "nhsuk-react-components";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  resetError,
  setPreferredMfa,
  updatedTotpSection,
  verifyTotp
} from "../../../../redux/slices/userSlice";
import { QRCodeSVG } from "qrcode.react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInputField from "../../../forms/TextInputField";
import store from "../../../../redux/store/store";
import { useHistory } from "react-router-dom";

interface IVerifyTotp {
  user: CognitoUser | any;
}

const VerifyTotp = ({ user }: IVerifyTotp) => {
  const dispatch = useAppDispatch();
  let history = useHistory();
  const totpName = "NHS TIS Self-Service";
  const totpStr = useAppSelector(state => state.user.totpCode);
  const qrCode = `otpauth://totp/${encodeURI(totpName)}:${
    user.username
  }?secret=${totpStr}&issuer=${encodeURI(totpName)}`;
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

  const verifyTotpInput = async (totpInput: string) => {
    const totpObj = {
      user,
      totpInput
    };
    await dispatch(verifyTotp(totpObj));
  };

  const updateMfa = async () => {
    const upMfaObj = {
      user,
      pref: "TOTP"
    };
    await dispatch(setPreferredMfa(upMfaObj));
  };

  const handleCodeSub = async (totp: string) => {
    await verifyTotpInput(totp);
    const statusAfterCodeVerif = store.getState().user.status;
    if (statusAfterCodeVerif === "succeeded") {
      await updateMfa();
      const statusAfterMfaUpdate = store.getState().user.status;
      if (statusAfterMfaUpdate === "succeeded") {
        history.push("/profile");
        window.location.reload();
      }
    }
  };

  return (
    <>
      <WarningCallout label="Remember">
        <p data-cy="threeMinReminderText">
          You have <strong>3 minutes</strong> to scan the QR code below using
          your Authenticator App on your phone before it expires.
        </p>
      </WarningCallout>
      <Panel
        data-cy="addTssTotpHeader"
        label="Add 'NHS TIS-Self-Service' to your Authenticator App"
      >
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
              Click here for help adding the 'NHS TIS Self-Service' account to
              your Authenticator App on your phone (opens in a new tab/window)
            </ActionLink>
          </Details.Text>
        </Details>
        <Panel
          label="using your phone"
          style={{ backgroundColor: "aliceblue" }}
        >
          <Fieldset.Legend size="m">
            Open your Authenticator App, click 'add a new account' button then
            scan the QR Code below.
          </Fieldset.Legend>
          <div style={{ padding: "20px" }}>
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
                If you are not using a mobile Authenticator App or are unable to
                see the QR code, you can enter the following code instead.
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
            onSubmit={values => handleCodeSub(values.confirmTOTPCode)}
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
        </Panel>
      </Panel>
    </>
  );
};

export default VerifyTotp;
