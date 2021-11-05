import {
  AmplifyAuthContainer,
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignUp
} from "@aws-amplify/ui-react";
import { Container } from "nhsuk-react-components";
import "./Login.scss";
import styles from "./Login.module.scss";

const formFields = [
  {
    type: "given_name",
    label: "First name *",
    required: true,
    placeholder: "Enter your first name"
  },
  {
    type: "family_name",
    label: "Surname *",
    required: true,
    placeholder: "Enter your surname"
  },
  {
    type: "email",
    label: "Email Address *",
    required: true
  },
  {
    type: "password",
    label: "Password *",
    required: true
  }
];

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
                  formFields={formFields}
                />
                <AmplifySignIn
                  headerText="Sign in to Trainee Self-Service."
                  slot="sign-in"
                ></AmplifySignIn>
              </AmplifyAuthenticator>
            </AmplifyAuthContainer>
          </div>
        </div>
      </Container>
    </main>
  );
};
