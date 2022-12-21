import React from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { LoginMechanism, SignUpAttribute } from "@aws-amplify/ui";

import AuthHeader from "../components/authentication/signup/header/AuthHeader";
import AuthFooter from "../components/authentication/signup/footer/AuthFooter";
import AuthHeading from "../components/authentication/signup/sharedPrimitives/AuthHeading";
import AuthBtnLink from "../components/authentication/signup/sharedPrimitives/AuthBtnLink";
import AuthFormFields from "../components/authentication/signup/formFields/AuthFormFields";
import {
  SIGN_IN_FOOTER_BTN_LINK_TEXT,
  SIGN_IN_HEADING_TEXT,
  SIGN_UP_FOOTER_BTN_LINK_TEXT,
  SIGN_UP_HEADING_TEXT,
  YES_TO_PRIVACY,
  YES_TO_PILOT,
  FORM_FIELD_VALUES
} from "../components/authentication/signup/constants/AuthConstants";
import style from "../components/authentication/Auth.module.scss";
import { I18n } from "@aws-amplify/core";
import { BrowserRouter } from "react-router-dom";
import { Main } from "../components/main/Main";
import Notifications from "../components/common/notifications/Notifications";

I18n.putVocabulariesForLanguage("en", FORM_FIELD_VALUES);
const components = {
  Header() {
    return <AuthHeader />;
  },

  Footer() {
    return <AuthFooter />;
  },

  SignIn: {
    Header(): JSX.Element {
      return AuthHeading(SIGN_IN_HEADING_TEXT);
    },
    Footer(): JSX.Element {
      const { toResetPassword } = useAuthenticator();
      return AuthBtnLink(toResetPassword, SIGN_IN_FOOTER_BTN_LINK_TEXT);
    }
  },

  SignUp: {
    Header() {
      return AuthHeading(SIGN_UP_HEADING_TEXT);
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return AuthBtnLink(toSignIn, SIGN_UP_FOOTER_BTN_LINK_TEXT);
    },
    FormFields() {
      return AuthFormFields();
    }
  }
};
const services = {
  async validateCustomSignUp(formData: {
    yesToPrivacy: string;
    yesToPilot: string;
  }) {
    const validationMessage: {
      yesToPrivacy?: string;
      yesToPilot?: string;
    } = {};
    if (!formData.yesToPrivacy) {
      validationMessage.yesToPrivacy = YES_TO_PRIVACY;
    }
    if (!formData.yesToPilot) {
      validationMessage.yesToPilot = YES_TO_PILOT;
    }
    return validationMessage;
  }
};
const formFields = {
  confirmSignUp: {
    confirmation_code: {
      labelHidden: false,
      label: "Email verification code is valid for 1 hour"
    }
  },
  confirmResetPassword: {
    confirmation_code: {
      labelHidden: false,
      label:
        "Enter your Password Reset Code ('No Reply' email from no-reply@tis-selfservice.nhs.uk) "
    }
  }
};
const loginMechanisms: LoginMechanism[] = ["email"];
const signUpAttributes: SignUpAttribute[] = [
  "given_name",
  "family_name",
  "email"
];

const App: React.FC = () => {
  if (typeof window === "undefined") {
    return null;
  }

  // App version placeholder
  const appVersion = "1.0.0";

  return (
    <Authenticator
      components={components}
      initialState="signIn"
      loginMechanisms={loginMechanisms}
      signUpAttributes={signUpAttributes}
      services={services}
      variation="default"
      className={style.authAuthenticator}
      formFields={formFields}
    >
      {({ signOut, user }) => (
        <SafeHydrate>
          <BrowserRouter>
            <>
              <Notifications />
              <Main user={user} signOut={signOut} appVersion={appVersion} />
            </>
          </BrowserRouter>
        </SafeHydrate>
      )}
    </Authenticator>
  );
};

export default App;

function SafeHydrate({ children }: any) {
  return (
    <div suppressHydrationWarning>
      {typeof document === "undefined" ? null : children}
    </div>
  );
}
