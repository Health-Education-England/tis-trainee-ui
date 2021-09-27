import {
  AmplifyAuthContainer,
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifyTotpSetup,
  AmplifyConfirmSignIn,
  AmplifyForgotPassword,
  AmplifyRequireNewPassword
} from "@aws-amplify/ui-react";
import {
  Button,
  Container,
  Details,
  WarningCallout
} from "nhsuk-react-components";
import { AuthState, CognitoUserInterface } from "@aws-amplify/ui-components";
import "./Login.scss";
import styles from "./Login.module.scss";
import { useEffect, useState } from "react";
interface LoginNewProps {
  user: CognitoUserInterface | undefined;
  authState: AuthState | undefined;
}
export const LoginNew = ({ user, authState }: LoginNewProps) => {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (authState === AuthState.TOTPSetup) {
      let timeOut = setTimeout(() => setExpired(true), 180000);
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [authState]);

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
                      You may have exceeded the 3 minutes to use this QR code
                      before it expires - after which you will need to reload
                      the page and sign in again.
                    </p>
                    <ul>
                      <li>
                        Click the green 'Reload' button when it appears or hold
                        down the 'Ctrl' and 'R' keys.
                      </li>
                      <li>
                        This should take you from the QR code screen back to the
                        Sign In page.
                      </li>
                      <li>
                        Sign in again and you should be back on the page with a
                        new QR code.
                      </li>
                      <li>Scan the QR code using your authenticator app.</li>
                      <li>
                        Take note of the 6-digit code on the Authenticator app
                        (Trainee Self-Service account).
                      </li>
                      <li>
                        Back on your laptop/desktop, enter this 6-digit Security
                        Code in the box below the QR Code (leaving no spaces
                        between the digits).
                      </li>
                      <li>
                        You will have up to 60 seconds to input this number.
                      </li>
                    </ul>
                  </Details.Text>
                </Details>
                <Details>
                  <Details.Summary>
                    I click on the QR Code image but nothing happens.
                  </Details.Summary>
                  <Details.Text>
                    <p>The QR code needs to be scanned using your camera.</p>
                    <ul>
                      <li>
                        To do this, open the authenticator application installed
                        on your mobile phone and add a new account (e.g.
                        clicking the '+' button on Microsoft Authenticator, and
                        choosing 'Work or school account' from the options, then
                        'Scan QR code').
                      </li>
                      <li>
                        An account named 'Trainee Self-Service' should now be
                        installed on your authenticator app.
                      </li>
                      <li>
                        Take note of the 6-digit code on the Authenticator app
                        (Trainee Self-Service account){" "}
                      </li>
                      <li>
                        Back on your laptop/desktop, enter this 6-digit Security
                        Code in the box below the QR Code (leaving no spaces
                        between the digits).
                      </li>
                    </ul>
                  </Details.Text>
                </Details>
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
              </>
            )}
          </div>
          <div className={styles.colForm}>
            {authState === AuthState.TOTPSetup && (
              <WarningCallout className={styles.callout}>
                {(() => {
                  if (expired) {
                    return (
                      <>
                        <p className={styles.expired}>
                          Your QR Code has expired. Please reload the page and
                          sign in again.
                        </p>
                        <Button onClick={() => window.location.reload()}>
                          Reload
                        </Button>
                      </>
                    );
                  } else {
                    return (
                      <p>
                        As part of inbuilt measures to secure your data, you
                        have <b>3 minutes</b> to scan the QR code below and
                        generate a Security Code before it expires.
                      </p>
                    );
                  }
                })()}
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
