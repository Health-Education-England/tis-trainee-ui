import { createRoot } from "react-dom/client";
import store from "./redux/store/store";
import { Provider } from "react-redux";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as Sentry from "@sentry/browser";
import { Amplify } from "aws-amplify";
import config from "./aws-amplify/config";
import browserUpdate from "browser-update";
import browserUpdateConfig from "./browser-update-config.json";
import TagManager from "react-gtm-module";
// The styles.css import below is needed for Authenticator default theme https://ui.docs.amplify.aws/components/authenticator
import "@aws-amplify/ui-react/styles.css";

const tagManagerArgs = {
  gtmId: "GTM-5PWDC87"
};

TagManager.initialize(tagManagerArgs);

// browserUpdate(browserUpdateConfig);

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

(async function initApp(): Promise<void> {
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
  const container = document.getElementById("root");

  createRoot(container!).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  serviceWorker.unregister();
})();

Sentry.init({
  dsn: "https://abba1f8a43dd4da4a00277b34beaaf59@sentry.io/1882746",
  environment: process.env.NODE_ENV
});
