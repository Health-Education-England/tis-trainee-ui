import { CognitoUser } from "@aws-amplify/auth";
import {
  ActionLink,
  Button,
  Details,
  Fieldset,
  Form,
  Input,
  WarningCallout
} from "nhsuk-react-components";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  resetError,
  resetUser,
  setPreferredMfa,
  updatedTotpSection,
  updateUserAttributes,
  verifyTotp
} from "../../../../redux/slices/userSlice";
import { QRCodeSVG } from "qrcode.react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInputField from "../../../forms/TextInputField";
import store from "../../../../redux/store/store";
import history from "../../../navigation/history";
import { MFAType } from "../../../../models/MFAStatus";
import { addNotification } from "../../../../redux/slices/notificationsSlice";
import "../MFA.scss";
import { Panel } from "nhsuk-react-components/dist/deprecated";
interface IVerifyTotp {
  user: CognitoUser | any;
}

const VerifyTotp = ({ user }: IVerifyTotp) => {
  const dispatch = useAppDispatch();
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
    await dispatch(verifyTotp({ user, totpInput }));
    return store.getState().user.status;
  };

  const updateMfa = async () => {
    const pref: MFAType = "TOTP";
    await dispatch(setPreferredMfa({ user, pref }));
    return store.getState().user.status;
  };

  const removePhoneNo = async () => {
    const attrib = { phone_number: "" };
    await dispatch(updateUserAttributes({ user, attrib }));
    return store.getState().user.status;
  };

  const handleTotpSub = async (totp: string) => {
    const getBack = () => {
      dispatch(updatedTotpSection(1));
      dispatch(resetError());
    };
    const res = await verifyTotpInput(totp);
    if (res === "succeeded") {
      const resU = await updateMfa();
      if (resU === "succeeded") {
        const resR = await removePhoneNo();
        if (resR === "succeeded") {
          dispatch(resetUser());
          history.push("/profile");
          dispatch(
            addNotification({
              type: "Success",
              text: "- Your Authenticator App is now set up. You will be asked for a new 6-digit code each time you log in"
            })
          );
        } else getBack();
      } else getBack();
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
        <Panel className="panelBack" label="using your phone">
          <Fieldset.Legend size="m">
            Open your Authenticator App, click 'add a new account' button then
            scan the QR Code below.
          </Fieldset.Legend>
          <div className="qrTss">
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
        </Panel>
      </Panel>
    </>
  );
};

export default VerifyTotp;
