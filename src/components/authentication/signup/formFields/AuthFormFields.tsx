import {
  Authenticator,
  CheckboxField,
  useAuthenticator
} from "@aws-amplify/ui-react";

const AuthFormFields = () => {
  const { validationErrors } = useAuthenticator();
  return (
    <>
      <Authenticator.SignUp.FormFields />
      <CheckboxField
        errorMessage={validationErrors.yesToPrivacy}
        hasError={!!validationErrors.yesToPrivacy}
        name="yesToPrivacy"
        value="yes"
        label="I agree with the Privacy & Cookies Policy"
      />
      <CheckboxField
        errorMessage={validationErrors.yesToPilot}
        hasError={!!validationErrors.yesToPilot}
        name="yesToPilot"
        value="yes"
        label="I have been invited to partake in Trainee Self-Service pilot"
      />
    </>
  );
};

export default AuthFormFields;
