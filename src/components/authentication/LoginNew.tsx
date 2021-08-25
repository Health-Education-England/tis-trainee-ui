import { CognitoUserInterface } from "@aws-amplify/ui-components";
import {
  AmplifyAuthContainer,
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifyTotpSetup
} from "@aws-amplify/ui-react";
import { Container } from "nhsuk-react-components";

interface LoginNewProps {
  user: CognitoUserInterface | undefined;
}

export const LoginNew = ({ user }: LoginNewProps) => {
  return (
    <Container>
      <AmplifyAuthContainer>
        <AmplifyAuthenticator>
          <AmplifyTotpSetup user={user} standalone />
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
