import {
  AmplifyAuthContainer,
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifyTotpSetup,
  AmplifyConfirmSignIn,
  AmplifyForgotPassword,
  AmplifyRequireNewPassword
} from "@aws-amplify/ui-react";
import { Container } from "nhsuk-react-components";
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
          </div>
          <div className={styles.colForm}>
            <AmplifyAuthContainer>
              <AmplifyAuthenticator>
                {authState === AuthState.TOTPSetup ? (
                  <AmplifyTotpSetup
                    headerText="Scan the barcode below using your preferred authenicator application."
                    slot="totp-setup"
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
