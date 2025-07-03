import React, { useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Router } from "react-router-dom";
import style from "../authentication/Auth.module.scss";
import { Main } from "../main/Main";
import browserUpdateConfig from "../../browser-update-config.json";
import TagManager from "react-gtm-module";
import history from "../navigation/history";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthHeader } from "../authentication/signup/header/AuthHeader";
import { AuthFooter } from "../authentication/signup/footer/AuthFooter";
import { AuthCheckboxFields } from "../authentication/signup/formFields/AuthCheckboxFields";
import { AuthSupportLinks } from "../authentication/signup/sharedPrimitives/AuthSupportLinks";

const tagManagerArgs = {
  gtmId: "GTM-5PWDC87"
};

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

  const components = {
    Header() {
      return <AuthHeader />;
    },
    Footer() {
      return <AuthFooter />;
    },
    SignUp: {
      FormFields() {
        return (
          <>
            <Authenticator.SignUp.FormFields />
            <AuthCheckboxFields />
          </>
        );
      },
      Footer() {
        return <AuthSupportLinks action="Sign up" />;
      }
    },

    SignIn: {
      Footer() {
        return <AuthSupportLinks action="Sign in" />;
      }
    }
  };

  const formFields = {
    signUp: {
      family_name: {
        isRequired: true,
        label: "Last Name",
        placeholder: "Enter your last name (family name)",
        order: 2
      },
      given_name: {
        isRequired: true,
        label: "First Name",
        placeholder: "Enter your first name",
        order: 1
      },
      password: {
        isRequired: true,
        label: "Password",
        placeholder: "Choose a password"
      },
      confirm_password: {
        isRequired: true,
        label: "Confirm Password",
        placeholder: "Confirm your password"
      },
      email: {
        isRequired: true,
        label: "Email",
        placeholder: "Enter your email (used by TIS)",
        order: 3
      }
    }
  };

  // const hideSignUpDependingOnEnv = process.env.REACT_APP_ENV !== "production";

  return (
    <Authenticator
      className={style.authAuthenticator}
      // hideSignUp={hideSignUpDependingOnEnv}
      signUpAttributes={["email", "family_name", "given_name"]}
      components={components}
      formFields={formFields}
      loginMechanisms={["email"]}
      services={{
        async validateCustomSignUp(formData) {
          const checkFields = ["yesToPrivacy", "yesToPilot"];
          for (const field of checkFields) {
            if (!formData[field]) {
              return {
                acknowledgement: ""
              };
            }
          }
        }
      }}
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
