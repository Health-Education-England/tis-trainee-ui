import {
  Authenticator,
  CheckboxField,
  useAuthenticator
} from "@aws-amplify/ui-react";
import { I18n } from "@aws-amplify/core";
import { FORM_FIELD_VALUES } from "../constants/AuthConstants";

const AuthFormFields = () => {
  const { validationErrors } = useAuthenticator();
  I18n.putVocabulariesForLanguage("en", FORM_FIELD_VALUES);

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
    </>
  );
};

export default AuthFormFields;
