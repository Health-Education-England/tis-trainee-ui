import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import store from "../redux/store/store";
import { Amplify } from "aws-amplify";
import config from "../aws-amplify/config";
// The styles.css import below is needed for Authenticator default theme https://ui.docs.amplify.aws/components/authenticator
import "@aws-amplify/ui-react/styles.css";
import Script from "next/script";
import Head from "next/head";
import Chatbot from "../components/support/Chatbot";

const GA4_ID: string = "G-JYWKL6G4R4";
const HJID: string = "1733748";
const HJSV: string = "6";

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      {typeof document === "undefined" ? null : (
        <>
          <Head>
            <title>TIS Self-Service</title>
          </Head>
          <Script id={"hotjar"} strategy={"lazyOnload"}>
            {`(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:${HJID},hjsv:${HJSV}}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}{" "}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');
            `}
          </Script>
          <Script id="old-browser-alert" noModule>
            {`alert("Sorry, you will need to use a modern up-to-date browser such as the latest version of chrome, Edge, Firefox, or Safari to use TIS Self-Service.")`}
          </Script>
          <Component {...pageProps} />
          <Chatbot />
        </>
      )}
    </Provider>
  );
}
