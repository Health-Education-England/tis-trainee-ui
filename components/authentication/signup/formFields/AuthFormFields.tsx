import {
  Authenticator,
  CheckboxField,
  useAuthenticator
} from "@aws-amplify/ui-react";

export const AuthFormFields = () => {
  const { validationErrors } = useAuthenticator();
  return (
    <>
      <Authenticator.SignUp.FormFields />
      <div data-cy="checkboxPrivacy">
        <CheckboxField
          errorMessage={validationErrors.yesToPrivacy as string}
          hasError={!!validationErrors.yesToPrivacy}
          name="yesToPrivacy"
          value="yes"
          label="I agree with the Privacy & Cookies Policy"
        />
      </div>
      <div data-cy="checkboxPilot">
        <CheckboxField
          errorMessage={validationErrors.yesToPilot as string}
          hasError={!!validationErrors.yesToPilot}
          name="yesToPilot"
          value="yes"
          label="I received a Welcome email inviting me to create an account"
        />
      </div>
    </>
  );
};

export const FormFields = {
  signIn: {
    username: {
      placeholder: "Email (used to create account)",
      isRequired: true,
      labelHidden: true
    },
    password: {
      isRequired: true,
      labelHidden: true
    }
  },
  signUp: {
    email: {
      placeholder: "Email (used by HEE)",
      isRequired: true,
      labelHidden: true
    },
    password: {
      placeholder: "Choose a password",
      isRequired: true,
      labelHidden: true
    },
    confirm_password: {
      isRequired: true,
      label:
        "Password must be between 6 and 99 characters long and contain at least 1 number, special character, uppercase and lowercase letter"
    },
    given_name: {
      placeholder: "First name",
      isRequired: true,
      labelHidden: true
    },
    family_name: {
      placeholder: "Last name",
      isRequired: true,
      labelHidden: true
    }
  },
  confirmSignUp: {
    confirmation_code: {
      placeholder: "Enter your 6-digit code",
      labelHidden: false,
      label:
        "Note: email verification codes expire in 1 hour so you may have to click 'Resend Code'."
    }
  },
  resetPassword: {
    username: {
      label:
        "This will only work if you have created an account - which includes the email verification step. If not then please contact Support to get your account reset so you can create an account again.",
      placeholder: "Enter your (verified) email address"
    }
  },
  confirmResetPassword: {
    confirmation_code: {
      labelHidden: false,
      label:
        "Enter your Password Reset Code ('No Reply' email from no-reply@tis-selfservice.nhs.uk) ",
      placeholder: "Enter 6-digit reset code"
    },
    password: {
      placeholder: "Choose a new password",
      isRequired: true,
      labelHidden: true
    },
    confirm_password: {
      isRequired: true,
      label:
        "Password must be between 6 and 99 characters and contain at least 1 number, special character, uppercase and lowercase letter"
    }
  },
  confirmSignIn: {
    confirmation_code: {
      placeholder: "Enter 6-digit code (no spaces)",
      isRequired: true,
      labelHidden: true
    }
  }
};
