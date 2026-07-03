import { useState, useEffect } from "react";
import Head from "next/head";
import { Provider } from "react-redux";
import { Amplify } from "aws-amplify";
import { I18n } from "aws-amplify/utils";
import store from "../redux/store/store";
import config from "../aws-amplify/config";
// The styles.css import below is needed for Authenticator default theme https://ui.docs.amplify.aws/components/authenticator
import "@aws-amplify/ui-react/styles.css";
import SPAEntryPoint from "../components/app/SPAEntryPoint";
import Chatbot from "../components/support/Chatbot";

I18n.putVocabularies({
  en: {
    "Authenticator App (TOTP)":
      "Authenticator App Time‑based One‑Time Password (TOTP)",
    "Confirm TOTP Code": "Enter the 6‑digit code from your Authenticator app"
  }
});

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.USER_POOL_ID ?? "",
      userPoolClientId: config.APP_CLIENT_ID ?? "",
      identityPoolId: config.IDENTITY_POOL_ID ?? "",
      loginWith: {
        email: true
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true
        }
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true
      }
    }
  }
});

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>TIS Self-Service</title>
        <meta
          name="description"
          content="Health Education England TIS Self-Service web application"
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      {isMounted ? (
        <Provider store={store}>
          <SPAEntryPoint />
          <Chatbot />
        </Provider>
      ) : null}
    </>
  );
}

export default App;
