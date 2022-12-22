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
            {`(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:1733748,hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}{" "}
          </Script>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
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
