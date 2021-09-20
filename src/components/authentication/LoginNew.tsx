import {
  AmplifyAuthContainer,
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifyTotpSetup,
  AmplifyConfirmSignIn,
  AmplifyForgotPassword,
  AmplifyRequireNewPassword
} from "@aws-amplify/ui-react";
import { Container, Details, WarningCallout } from "nhsuk-react-components";
import { AuthState, CognitoUserInterface } from "@aws-amplify/ui-components";
import "./Login.scss";
import styles from "./Login.module.scss";
interface LoginNewProps {
  user: CognitoUserInterface | undefined;
  authState: AuthState | undefined;
}
export const LoginNew = ({ user, authState }: LoginNewProps) => {
  return (
    <main className="nhsuk-main-wrapper" id="maincontent">
      <Container>
        <div className={styles.row}>
          <div className={styles.colText}>
            <h1 className="nhsuk-u-padding-0 nhsuk-u-margin-bottom-2">
              Trainee Self-Service
            </h1>
            <hr className="nhsuk-u-padding-0 nhsuk-u-margin-3" />
            <p>
              Trainee Self-Service enables trainees to log in and see some data
              HEE hold about them and undertake the Form R process for junior
              doctors.
            </p>
            {authState === AuthState.TOTPSetup && (
              <p>
                We are currenly piloting Trainee Self-Service so there will be
                some issues to iron out - particularly with Authentication.
                Apologies in advance if this affects you. We have links below to
                some common issues so far.
              </p>
            )}
            {authState === AuthState.SignIn && (
              <p>
                For further information and support, visit the{" "}
                <a
                  style={{ whiteSpace: "nowrap" }}
                  href="https://tis-support.hee.nhs.uk"
                >
                  TIS Support website
                </a>
                .
              </p>
            )}
            {authState === AuthState.TOTPSetup && (
              <>
                <Details>
                  <Details.Summary>
                    I enter the 6-digit code from my authenticator app and click{" "}
                    <b>‘Verify Security Token’</b> but nothing happens
                  </Details.Summary>
                  <Details.Text>
                    <p>
                      Check your authenticator app on your mobile phone, looking
                      for the account named “Trainee Self-Service”
                    </p>
                    <p>
                      Wait for the 6-digit code to refresh (
                      <b>
                        You have a maximum of 30 seconds before this number
                        expires and gets refreshed
                      </b>
                      ). This will then give you a full 30 seconds to use this
                      code before it expires.
                    </p>
                    <p>
                      Enter this 6-digit code in the box below the QR Code
                      before the 30-second refresh happens.
                    </p>
                    <p>
                      Repeat the above if you don't input the 6-digit code
                      within the 30 second time limit.
                    </p>
                  </Details.Text>
                </Details>
                <Details>
                  <Details.Summary>
                    I click on the QR Code image but nothing happens.
                  </Details.Summary>
                  <Details.Text>
                    <p>
                      The QR code needs to be scanned using your camera. To do
                      this, open the authenticator application installed on your
                      mobile phone and add a new account (e.g. clicking the '+'
                      button on Microsoft Authenticator, and choosing 'Work or
                      school acount' from the options, then 'Scan QR code').
                    </p>
                    <p>
                      An account named 'Trainee Self-Service' should now be
                      installed on your authenticator app.
                    </p>
                    <p>
                      Wait for the 6-digit code to refresh (You have a maximum
                      of 30 seconds before this number expires and gets
                      refreshed). This will then give you a full 30 seconds to
                      use this code before it expires.
                    </p>
                    <p>
                      Go back to your desktop/ laptop and enter this 6-digit
                      code in the box below the QR Code before the 30-second
                      refresh happens.
                    </p>
                  </Details.Text>
                </Details>
              </>
            )}
          </div>
          <div className={styles.colForm}>
            {authState === AuthState.TOTPSetup && (
              <WarningCallout className={styles.callout}>
                <p>
                  For further guidance on setting up an authenticator app, visit
                  the{" "}
                  <a
                    href="https://tis-support.hee.nhs.uk/trainees/enhancing-the-security-of-the-trainee-self-service-application/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TIS Support website.
                  </a>
                </p>
              </WarningCallout>
            )}
            <AmplifyAuthContainer>
              <AmplifyAuthenticator>
                {authState === AuthState.TOTPSetup ? (
                  <AmplifyTotpSetup
                    headerText="Scan the QR code below using your preferred authenticator application."
                    slot="totp-setup"
                    issuer="Trainee Self-Service"
                    user={user}
                    standalone
                  />
                ) : null}
                {authState === AuthState.ConfirmSignIn ? (
                  <AmplifyConfirmSignIn
                    headerText="Confirm 6-digit Authenticator code"
                    slot="confirm-sign-in"
                    user={user}
                  />
                ) : null}

                <AmplifySignIn
                  headerText="Sign in to Trainee Self-Service."
                  slot="sign-in"
                  hideSignUp
                ></AmplifySignIn>
                <AmplifyForgotPassword slot="forgot-password"></AmplifyForgotPassword>
                <AmplifyRequireNewPassword slot="require-new-password"></AmplifyRequireNewPassword>
              </AmplifyAuthenticator>
            </AmplifyAuthContainer>
          </div>
        </div>
      </Container>
    </main>
  );
};
