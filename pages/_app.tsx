import "../styles/globals.scss";
import type { AppProps } from "next/app";
import React from "react";
import Script from "next/script";

const GA4_ID: string = "G-JYWKL6G4R4";
const HJID: string = "1733748";
const HJSV: string = "6";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
    </>
  );
}
