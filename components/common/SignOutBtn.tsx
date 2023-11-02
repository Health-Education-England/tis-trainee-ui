import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "nhsuk-react-components";

export const SignOutBtn = () => {
  const { signOut } = useAuthenticator(context => [context.user]);
  return (
    <Button type="button" className="sign-out-btn" onClick={signOut}>
      Sign out
    </Button>
  );
};
