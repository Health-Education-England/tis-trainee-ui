import { useEffect, useState } from "react";
import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import PageTitle from "./components/common/PageTitle";
import HEEHeader from "./components/navigation/HEEHeader";
import HEEFooter from "./components/navigation/HEEFooter";
import { Main } from "./components/main/Main";
import { CacheUtilities } from "./utilities/CacheUtilities";
import packageJson from "../package.json";
import {
  Authenticator,
  Button,
  CheckboxField,
  Heading,
  useAuthenticator,
  useTheme,
  View
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { I18n } from "@aws-amplify/core";
import AuthHeader from "./components/authentication/AuthHeader";
import AuthFooter from "./components/authentication/AuthFooter";

const globalAny: any = global;
globalAny.appVersion = packageJson.version;

const components = {
  Header() {
    return <AuthHeader />;
  },

  Footer() {
    return <AuthFooter />;
  },

  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
          fontWeight="normal"
          color="#5C6670"
        >
          Log back in
        </Heading>
      );
    },
    Footer() {
      const { toResetPassword } = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="bold"
            onClick={toResetPassword}
            size="small"
            variation="link"
          >
            Reset Password
          </Button>
        </View>
      );
    }
  },

  SignUp: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
          fontWeight="normal"
          color="#5C6670"
        >
          First time sign-up
        </Heading>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="bold"
            onClick={toSignIn}
            size="small"
            variation="link"
          >
            Back to Login
          </Button>
        </View>
      );
    },
    FormFields() {
      const { validationErrors } = useAuthenticator();
      I18n.putVocabulariesForLanguage("en", {
        "Create Account": "Sign up", //create account tab header
        Email: "Email  (used by your Local Office)", // email
        "Confirm Password": "Confirm your chosen password", // Confirm Password label
        "Sign In": "Log in", // Tab header
        "Sign in": "Log in", // Button label
        "Sign in to your account": "Trainee Self Service Login",
        "Confirm Sign Up": "Check your email for a confirmation code",
        "Enter your code": "Enter the code sent to your email address" // Confirm Sign Up input
      });
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
    }
  }
};

const services = {
  async validateCustomSignUp(formData: { yesToPrivacy: string }) {
    if (!formData.yesToPrivacy) {
      return {
        yesToPrivacy:
          "To use Trainee Self-Service you agree to the Privacy & Cookies Policy. We use necessary cookies to make our site work and analytics cookies to help us improve it. (Click on the 'Privacy & Cookies' policy link above for more details.)"
      };
    }
  }
};

const loginMechanisms: any = ["email"];
// TODO Possibly remove given_name, family_name from sign-up
// const signUpAttributes: any = ["given_name", "family_name", "email"];
const signUpAttributes: any = ["email"];

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
      initialState="signUp"
      loginMechanisms={loginMechanisms}
      signUpAttributes={signUpAttributes}
      services={services}
      variation="default"
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
