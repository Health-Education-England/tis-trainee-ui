import React, { useState, useRef } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import SetupTOTP from "./SetupTOTP";
import SetupSMS from "./SetupSMS";

import { Stepper, Step } from "./Stepper";
import { ActionLink, Fieldset, Radios } from "nhsuk-react-components";

interface ISetupMFA {
  user: CognitoUser | any;
  mfa: string;
}

interface RefObject {
  updateActiveStep: (step: number) => void;
}
const SetupMFA = ({ user, mfa }: ISetupMFA) => {
  const [newMFAStatus, setNewMFAStatus] = useState("");
  const incrementStep = (increment: number) => {
    if (ref.current) {
      ref.current.updateActiveStep(increment);
    }
  };

  const ref = useRef<RefObject>(null);

  return (
    <>
      <h1>Set up multi-factor authentication</h1>

      <Stepper ref={ref}>
        <Step
          disableNextButton={newMFAStatus ? false : true}
          title="Set up multi-factor authentication"
        >
          <p>
            Multi-factor authentication (MFA) is an extra layer of security used
            when logging into websites or apps.
          </p>
          <Fieldset>
            <Fieldset.Legend>How do you want to sign in?</Fieldset.Legend>
            <Radios
              name="selectMFA"
              id="selectMFA"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewMFAStatus(e.target.value);
              }}
            >
              <Radios.Radio
                checked={newMFAStatus === "totp"}
                value="totp"
                hint="Use an application on your phone to get two-factor
		  authentication codes when prompted. We recommend using cloud-based TOTP
		  apps such as Microsoft Authenticator or Authy."
              >
                Set up using an app
              </Radios.Radio>
              <Radios.Radio
                checked={newMFAStatus === "sms"}
                value="sms"
                hint="We will send you an SMS with a
		  two-factor authentication code when prompted. "
              >
                Set up using SMS
              </Radios.Radio>
            </Radios>
          </Fieldset>
        </Step>

        <Step title="Authentication verification" disableNextButton={true}>
          {newMFAStatus === "totp" && (
            <SetupTOTP
              incrementStep={incrementStep}
              user={user}
              mfaStatus={mfa}
            ></SetupTOTP>
          )}
          {newMFAStatus === "sms" && (
            <SetupSMS
              incrementStep={incrementStep}
              user={user}
              mfaStatus={mfa}
            ></SetupSMS>
          )}
        </Step>
        <Step title="Complete" disableBackButton={true}>
          {newMFAStatus === "totp" && (
            <p>
              TIS Self-Service has successfully registered on your authenicator
              app. You will need to enter a 6-digit code each time you login to
              TIS Self-Service, which you obtain from the authenticator app.
            </p>
          )}
          {newMFAStatus === "sms" && (
            <p>
              Authentication via SMS has been successfully registered. You will
              need to enter a 6-digit code each time you login to Trainee
              Self-Service, which you will receive as a text message sent to the
              mobile phone number you provided.
            </p>
          )}
          <ActionLink href="/profile">Continue to TIS Self-Service</ActionLink>
        </Step>
      </Stepper>
    </>
  );
};

export default SetupMFA;
