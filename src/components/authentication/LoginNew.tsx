import {
  AmplifyAuthContainer,
  AmplifyAuthenticator,
  AmplifySignIn
} from "@aws-amplify/ui-react";
import { Container } from "nhsuk-react-components";

export const LoginNew = () => {
  return (
    <Container>
      <AmplifyAuthContainer>
        <AmplifyAuthenticator>
          <AmplifySignIn
            headerText="Trainee Self-Service Sign-In"
            slot="sign-in"
            hideSignUp
          ></AmplifySignIn>
        </AmplifyAuthenticator>
      </AmplifyAuthContainer>
    </Container>
  );
};
