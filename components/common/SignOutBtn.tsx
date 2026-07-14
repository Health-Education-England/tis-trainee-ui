import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "nhsuk-react-components";

export const SignOutBtn = () => {
  const { signOut } = useAuthenticator(context => [context.user]);
  return (
    <Button
      as="button"
      className="sign-out-btn"
      data-cy="signOutBtn"
      onClick={signOut}
    >
      Sign out
    </Button>
  );
};
