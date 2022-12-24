import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "../redux/store/store";
import { Amplify } from "aws-amplify";
import config from "../aws-amplify/config";
// The styles.css import below is needed for Authenticator default theme https://ui.docs.amplify.aws/components/authenticator
import "@aws-amplify/ui-react/styles.css";
import Script from "next/script";
import Head from "next/head";

const GTM_ID: string = "UA-40570867-12";
const HJID: string = "1733748";
const HJSV: string = "6";

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
      {typeof document === "undefined" ? null : (
        <>
          <Head>
            <title>TIS Self-Service</title>
          </Head>
          <Script id={"hotjar"} strategy={"lazyOnload"}>
            {`(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:${HJID},hjsv:${HJSV}}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}{" "}
          </Script>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`src="https://www.googletagmanager.com/gtag/js?id=${GTM_ID}"`}
          </Script>
          <Script>
            {`window.dataLayer = window.dataLayer || []; function gtag() {
        dataLayer.push(arguments); gtag("js", new Date());
        gtag("config", ${GTM_ID});
        gtag("config", "G-HZVN2JNJEQ");
      }`}
          </Script>
          <Script noModule>
            {`alert("Sorry, you will need to use a modern up-to-date browser such as the latest version of chrome, Edge, Firefox, or Safari to use TIS Self-Service.")`}
          </Script>
          <Component {...pageProps} />
        </>
      )}
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
