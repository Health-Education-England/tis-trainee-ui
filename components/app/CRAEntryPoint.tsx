import React, { useEffect } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { LoginMechanism, SignUpAttribute } from "@aws-amplify/ui";

import AuthHeader from "../authentication/signup/header/AuthHeader";
import AuthFooter from "../authentication/signup/footer/AuthFooter";
import AuthHeading from "../authentication/signup/sharedPrimitives/AuthHeading";
import AuthBtnLink, {
  SupportLinks
} from "../authentication/signup/sharedPrimitives/AuthBtnLink";
import {
  AuthFormFields,
  FormFields
} from "../authentication/signup/formFields/AuthFormFields";
import {
  SIGN_IN_FOOTER_BTN_LINK_TEXT,
  SIGN_UP_HEADING_TEXT,
  YES_TO_PRIVACY,
  YES_TO_PILOT,
  FORM_FIELD_VALUES,
  SIGN_IN_FOOTER_PASSWORD_RESET_WARNING_TEXT
} from "../authentication/signup/constants/AuthConstants";
import style from "../authentication/Auth.module.scss";
import { I18n } from "@aws-amplify/core";
import { Router } from "react-router-dom";
import { Main } from "../main/Main";
import browserUpdateConfig from "../../browser-update-config.json";
import TagManager from "react-gtm-module";
import history from "../navigation/history";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tagManagerArgs = {
  gtmId: "GTM-5PWDC87"
};

I18n.putVocabulariesForLanguage("en", FORM_FIELD_VALUES);
const components = {
  Header() {
    return <AuthHeader />;
  },

  Footer() {
    return <AuthFooter />;
  },

  SignIn: {
    Footer() {
      const { toResetPassword } = useAuthenticator();
      return (
        <>
          {SupportLinks("Sign in")}
          {AuthBtnLink(toResetPassword, SIGN_IN_FOOTER_BTN_LINK_TEXT)}
          <p className="signin-password-reset-warning-text">
            {SIGN_IN_FOOTER_PASSWORD_RESET_WARNING_TEXT}
          </p>
        </>
      );
    }
  },

  SignUp: {
    Header() {
      return AuthHeading(SIGN_UP_HEADING_TEXT);
    },
    Footer() {
      return <>{SupportLinks("Create an account")}</>;
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
const formFields = FormFields;
const loginMechanisms: LoginMechanism[] = ["email"];
const signUpAttributes: SignUpAttribute[] = [
  "given_name",
  "family_name",
  "email"
];

function CRAEntryPoint() {
  TagManager.initialize(tagManagerArgs);

  // Dynamically imported browser-update module (see https://github.com/browser-update/browser-update/issues/524 for more info)
  // Also added a nomodule script tag in _app.tsx to catch IE and other browsers that don't support ES modules (see e.g. https://stackoverflow.com/questions/74154325/warning-ie11-users-their-browser-is-unsupported-in-react-18)

  useEffect(() => {
    (async () => {
      try {
        const browserUpdateModule = await import("browser-update");
        const browserUpdate = browserUpdateModule.default;
        browserUpdate(browserUpdateConfig);
      } catch (error) {
        console.error("Failed to load browser-update: ", error);
      }
    })();
  }, []);

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
      {() => (
        <Router history={history}>
          <>
            <ToastContainer
              transition={Zoom}
              limit={2}
              hideProgressBar={true}
            />
            <Main />
          </>
        </Router>
      )}
    </Authenticator>
  );
}

export default CRAEntryPoint;
