import { Formik } from "formik";
import { Button, Details, WarningCallout } from "nhsuk-react-components";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { resetUser, updatedtempMfa } from "../../../redux/slices/userSlice";
import { MFA_OPTIONS } from "../../../utilities/Constants";
import MultiChoiceInputField from "../../forms/MultiChoiceInputField";
import * as Yup from "yup";
import { useEffect } from "react";
import ScrollTo from "../../forms/ScrollTo";
import history from "../../navigation/history";
import { MFAStatus } from "../../../models/MFAStatus";
import { Panel } from "nhsuk-react-components/dist/deprecated";
interface IChooseMfa {
  mfa: string;
}

const ChooseMfa = ({ mfa }: IChooseMfa) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetUser());
  }, [dispatch]);

  return (
    <>
      <ScrollTo />
      <Formik
        initialValues={{
          mfaChoice: ""
        }}
        validationSchema={Yup.object({
          mfaChoice: Yup.string().required("Please choose an option")
        })}
        onSubmit={values => {
          dispatch(updatedtempMfa(values.mfaChoice));
          history.push(`/mfa/${values.mfaChoice.toLowerCase()}`);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <ScrollTo />
            {mfa !== "NOMFA" && (
              <WarningCallout data-cy="mfaAlreadyWarning">
                <WarningCallout.Label visuallyHiddenText={false}>
                  Important
                </WarningCallout.Label>
                <p data-cy="mfaAlreadyText">
                  You have already set up
                  <b>
                    {" "}
                    {mfa === MFAStatus.TOTP
                      ? "your Authenticator App for MFA"
                      : "SMS for MFA"}{" "}
                  </b>
                  to verify your identity when you log in to TIS Self-Service.
                  If you want to redo the process or verify your identity a
                  different way then please continue.
                </p>
              </WarningCallout>
            )}
            <Details>
              <Details.Summary data-cy="mfaSummary">Why MFA?</Details.Summary>
              <Details.Text data-cy="mfaText">
                <p>
                  Multi factor authentication (MFA) provides a second layer of
                  security. When enabled, each time you log in to TIS
                  Self-Service after entering your password, you'll be asked for
                  a new <b>6-digit code to verify your identity</b> using either
                  of the following:
                </p>
                <p>
                  <b>An Authenticator App (recommended)</b>
                </p>
                <p>
                  <b>or SMS to your mobile phone</b>
                </p>
              </Details.Text>
              <Details.Text data-cy="whyTotpText">
                <p>
                  <b>We recommend installing an Authenticator App</b> to
                  generate the 6-digit code as this is{" "}
                  <b>more secure and reliable than SMS</b>. It is particularly
                  useful when working in places with no phone signal.
                </p>
                <p>
                  Your Authenticator App can be used to securely sign in to lots
                  of other applications not just TIS Self-Service.
                </p>
                <p>
                  <b>
                    Full instructions on how to install and use an Authenticator
                    app on your phone will be given if you choose to verify your
                    identity this way.
                  </b>
                </p>
              </Details.Text>
            </Details>
            <Panel label="When I log in, I want to verify my identity with a code ">
              <MultiChoiceInputField
                type="radios"
                id="mfaChoice"
                name="mfaChoice"
                items={MFA_OPTIONS}
              ></MultiChoiceInputField>
            </Panel>
            <Button
              onClick={() => {
                handleSubmit();
              }}
              data-cy="BtnSubmitMfaChoice"
            >
              Next
            </Button>
          </>
        )}
      </Formik>
    </>
  );
};

export default ChooseMfa;
