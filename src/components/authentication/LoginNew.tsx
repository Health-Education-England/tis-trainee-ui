import {
  AmplifyAuthContainer,
  AmplifyAuthenticator,
  AmplifySignUp
} from "@aws-amplify/ui-react";
import { Container } from "nhsuk-react-components";
import "./Login.scss";
import styles from "./Login.module.scss";

export const LoginNew = () => {
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
          </div>
          <div className={styles.colForm}>
            <AmplifyAuthContainer>
              <AmplifyAuthenticator>
                <AmplifySignUp
                  usernameAlias="email"
                  slot="sign-up"
                  formFields={[{ type: "email" }, { type: "password" }]}
                />
              </AmplifyAuthenticator>
            </AmplifyAuthContainer>
          </div>
        </div>
      </Container>
    </main>
  );
};
