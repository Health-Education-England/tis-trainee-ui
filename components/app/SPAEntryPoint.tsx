import React, { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Hub } from "aws-amplify/utils";
import { Router } from "react-router-dom";
import style from "../authentication/Auth.module.scss";
import Loading from "../common/Loading";
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

function SPAEntryPoint() {
  TagManager.initialize(tagManagerArgs);

  const [isSigningOut, setIsSigningOut] = useState(false);

  const initialAuthState =
    globalThis.location.pathname === "/sign-up" ? "signUp" : "signIn";

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

  // Note:  On sign-out btn click, return to the landing page with a full page load so
  // Redux store is cleared. Session expiry emits tokenRefresh_failure (not signedOut), so expired
  // users re-auth in place and keep their current page. isSigningOut swaps the Authenticator
  // for a spinner so the sign-in form doesn't flash while the redirect loads.
  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedOut") {
        setIsSigningOut(true);
        globalThis.location.assign("/");
      }
    });
    return unsubscribe;
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
        return (
          <>
            <Authenticator.SignIn.Footer />
            <AuthSupportLinks action="Sign in" />
          </>
        );
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

  if (isSigningOut) {
    return (
      <div className="centreSpinner">
        <Loading />
      </div>
    );
  }

  return (
    <Authenticator
      className={style.authAuthenticator}
      // hideSignUp={hideSignUpDependingOnEnv}
      initialState={initialAuthState}
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

export default SPAEntryPoint;
