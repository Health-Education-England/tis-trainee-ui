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
        <h1 className="nhsuk-heading-m" data-cy="tssOverview">
          South West: Contacts for Foundation Doctors
        </h1>
        <p>
          For <b>Severn</b> programmes &ndash; contact{" "}
          <a href="mailto:england.sevfoundation.sw@nhs.net">
            england.sevfoundation.sw@nhs.net
          </a>
        </p>
        <p>
          For <b>Peninsula</b> programmes &ndash; contact{" "}
          <a href="mailto:england.penf1enquiries.sw@nhs.net">
            england.penf1enquiries.sw@nhs.net
          </a>
        </p>
        <br />
        <p>
          If you are not sure which region your programme might fall into,
          further details of each may be found here:
        </p>
        <ul>
          <li>
            <b>Peninsula</b>: (Programme number starts with &apos;SWP&apos;){" "}
            <a
              href="https://peninsuladeanery.nhs.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Peninsula Deanery website
            </a>
          </li>
          <li>
            <b>Severn</b>: (Programme number starts with &apos;SEV&apos;){" "}
            <a
              href="https://www.severndeanery.nhs.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Severn Deanery website
            </a>
          </li>
        </ul>
      </main>
      <Footer>
        <Footer.Copyright>
          &copy; {new Date().getFullYear()} NHS England
        </Footer.Copyright>
      </Footer>
    </>
  );
}
