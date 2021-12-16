import { useEffect, useState } from "react";
import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import PageTitle from "./components/common/PageTitle";
import HEEHeader from "./components/navigation/HEEHeader";
import HEEFooter from "./components/navigation/HEEFooter";
import { Main } from "./components/main/Main";
import { CacheUtilities } from "./utilities/CacheUtilities";
import packageJson from "../package.json";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import AuthHeader from "./components/authentication/signup/header/AuthHeader";
import AuthFooter from "./components/authentication/signup/footer/AuthFooter";
import AuthHeading from "./components/authentication/signup/sharedPrimitives/AuthHeading";
import AuthBtnLink from "./components/authentication/signup/sharedPrimitives/AuthBtnLink";
import AuthFormFields from "./components/authentication/signup/formFields/AuthFormFields";
import styles from "./components/authentication/signup/Auth.module.scss";
import "./components/authentication/signup/Auth.scss";
import {
  SIGN_IN_FOOTER_BTN_LINK_TEXT,
  SIGN_IN_HEADING_TEXT,
  SIGN_UP_FOOTER_BTN_LINK_TEXT,
  SIGN_UP_HEADING_TEXT,
  YES_TO_PRIVACY
} from "./components/authentication/signup/constants/AuthConstants";
import { LoginMechanism, SignUpAttribute } from "@aws-amplify/ui";
import { I18n } from "@aws-amplify/core";
import { FORM_FIELD_VALUES } from "./components/authentication/signup/constants/AuthConstants";
const globalAny: any = global;
globalAny.appVersion = packageJson.version;
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
  async validateCustomSignUp(formData: { yesToPrivacy: string }) {
    if (!formData.yesToPrivacy) {
      return {
        yesToPrivacy: YES_TO_PRIVACY
      };
    }
  }
};

const loginMechanisms: LoginMechanism[] = ["email"];
const signUpAttributes: SignUpAttribute[] = [
  "given_name",
  "family_name",
  "email"
];

const App: React.FunctionComponent = () => {
  const [appVersion, setAppVersion] = useState("");

  useEffect(() => {
    const fetchAppVersion = async () => {
      const version = await CacheUtilities.checkAppVersion(
        globalAny.appVersion
      );
      setAppVersion(version);
    };
    fetchAppVersion();
  }, []);

  return (
    <Authenticator
      components={components}
      initialState="signIn"
      loginMechanisms={loginMechanisms}
      signUpAttributes={signUpAttributes}
      services={services}
      variation="default"
      className={styles.authAuthenticator}
    >
      {({ signOut }) => (
        <>
          <BrowserRouter>
            <PageTitle />
            <HEEHeader signOut={signOut} />
            <Main />
            <HEEFooter appVersion={appVersion} />
          </BrowserRouter>
        </>
      )}
    </Authenticator>
  );
};

export default App;
