import { Footer } from "nhsuk-react-components";
import styles from "./HEEFooter.module.scss";

interface HEEFooterProps {
  appVersion: string;
}

const HEEFooter = ({ appVersion }: HEEFooterProps) => {
  return (
    <>
      <Footer>
        <Footer.List>
          <Footer.ListItem
            className={styles.refLink}
            data-cy="linkSupport"
            href="/support"
          >
            Contact us
          </Footer.ListItem>
          <Footer.ListItem
            className={styles.refLink}
            data-cy="linkAbout"
            href="https://www.hee.nhs.uk"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </Footer.ListItem>
          <Footer.ListItem
            className={styles.refLink}
            data-cy="linkPrivacyPolicy"
            href="https://www.hee.nhs.uk/about/privacy-notice"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy &amp; cookie policy
          </Footer.ListItem>
        </Footer.List>
        <Footer.Copyright>&copy; Health Education England</Footer.Copyright>
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
    </>
  );
};

export default HEEFooter;
