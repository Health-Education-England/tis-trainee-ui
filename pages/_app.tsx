import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "../redux/store/store";
import { Amplify } from "aws-amplify";
import config from "../aws-amplify/config";
// The styles.css import below is needed for Authenticator default theme https://ui.docs.amplify.aws/components/authenticator
import "@aws-amplify/ui-react/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const getEnv = async () => {
      if (process.env.NODE_ENV !== "development") {
        const theFetchedData = await fetchData();
        Amplify.configure({ Auth: theFetchedData.auth });
      } else {
        Amplify.configure({
          Auth: {
            mandatorySignIn: true,
            region: config.cognito.REGION,
            userPoolId: config.cognito.USER_POOL_ID,
            identityPoolId: config.cognito.IDENTITY_POOL_ID,
            userPoolWebClientId: config.cognito.APP_CLIENT_ID,
            authenticationFlowType: config.cognito.USER_PASSWORD_AUTH
          }
        });
      }
    };
    getEnv();
  }, []);

  return (
    <Provider store={store}>
      {typeof document === "undefined" ? null : <Component {...pageProps} />}
    </Provider>
  );
}

async function fetchData(): Promise<any> {
  return fetch("/api/environment")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response error");
      }
      return response.json();
    })
    .then(envData => envData)
    .catch(error => {
      console.error("There is a problem fetching the app data: ", error);
    });
}
