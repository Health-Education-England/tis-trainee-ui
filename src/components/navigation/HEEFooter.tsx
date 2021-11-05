import { AuthState } from "@aws-amplify/ui-components";
import { Footer } from "nhsuk-react-components";
import { useState } from "react";
import { Cookie } from "../common/Cookie";
import PrivacyPolicy from "../common/PrivacyPolicy";
import styles from "./HEEFooter.module.scss";

interface HEEFooterProps {
  authState: AuthState | undefined;
  appVersion: string;
}

const HEEFooter = ({ authState, appVersion }: HEEFooterProps) => {
  const [displayPrivacyPolicy, setDisplayPrivacyPolicy] = useState(false);

  const showPrivacyPolicy = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setDisplayPrivacyPolicy(!displayPrivacyPolicy);
  };
  return (
    <>
      <Footer>
        <Footer.List>
          <Footer.ListItem
            className={styles.refLink}
            data-cy="linkSupport"
            href={
              authState === AuthState.SignedIn
                ? "/support"
                : "https://tis-support.hee.nhs.uk"
            }
          >
            Contact us
          </Footer.ListItem>
          <Footer.ListItem
            className={styles.refLink}
            data-cy="linkPrivacyPolicy"
            onClick={showPrivacyPolicy}
            href="#"
          >
            Privacy &amp; cookie policy
          </Footer.ListItem>
        </Footer.List>
        <Footer.Copyright>
          &copy; <a href="https://www.hee.nhs.uk">hee.nhs.uk</a>
        </Footer.Copyright>
        {appVersion ? (
          <Footer.List>
            <Footer.ListItem>
              <span
                style={{ fontSize: "10pt" }}
              >{`version: ${appVersion}`}</span>
            </Footer.ListItem>
          </Footer.List>
        ) : null}
      </Footer>
      <Cookie showPrivacyPolicy={showPrivacyPolicy} />
      {displayPrivacyPolicy && (
        <PrivacyPolicy showPrivacyPolicy={showPrivacyPolicy} modal={true} />
      )}
    </>
  );
};

export default HEEFooter;
