import { useState, useEffect } from "react";
import Head from "next/head";
import { Footer, Header } from "nhsuk-react-components";
import { NHSEnglandLogoWhite } from "../public/NHSEnglandLogoWhite";

export default function SwFoundation() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Head>
        <title>South West: Contacts for Foundation Doctors</title>
      </Head>
      <Header>
        <Header.Container>
          <div className="nhsuk-header__logo" data-cy="headerLogo">
            <a
              href="/"
              aria-label="TSS home page"
              className="nhsuk-header__navigation-link header-logo-link"
            >
              <NHSEnglandLogoWhite />
            </a>
          </div>
        </Header.Container>
        <div className="nhsuk-width-container">
          <span className="tss-name">TIS Self-Service</span>
        </div>
      </Header>
      <main className="nhsuk-width-container nhsuk-u-margin-top-5">
        <legend
          className="nhsuk-fieldset__legend nhsuk-fieldset__legend--m"
          data-cy="tssOverview"
        >
          South West: Contacts for Foundation Doctors
        </legend>
        <p>
          For Severn programmes (Programme number starts with &apos;SEV&apos;)
          &ndash; contact{" "}
          <a href="mailto:england.sevfoundation.sw@nhs.net">
            england.sevfoundation.sw@nhs.net
          </a>
        </p>
        <p>
          For Peninsula programmes (Programme number starts with
          &apos;SWP&apos;) &ndash; contact{" "}
          <a href="mailto:england.penf1enquiries.sw@nhs.net">
            england.penf1enquiries.sw@nhs.net
          </a>
        </p>
      </main>
      <Footer>
        <Footer.Copyright>&copy; NHS England</Footer.Copyright>
      </Footer>
    </>
  );
}
