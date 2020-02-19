import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import * as Sentry from "@sentry/browser";
import Amplify from "aws-amplify";
import config from "./aws-amplify/config";

Sentry.init({
  dsn: "https://abba1f8a43dd4da4a00277b34beaaf59@sentry.io/1882746",
  environment: process.env.NODE_ENV
});

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
});

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.register();
