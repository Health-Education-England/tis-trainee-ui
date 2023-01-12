import { Col, Footer, Row } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";
import styles from "./HEEFooter.module.scss";

interface HEEFooterProps {
  appVersion: string;
}

const HEEFooter = ({ appVersion }: HEEFooterProps) => {
  return (
    <>
      <Footer>
        <Footer.List>
          <Row>
            <Col width="one-quarter">
              <NavLink
                className={styles.refLink}
                data-cy="linkSupport"
                to={"/support"}
              >
                Support
              </NavLink>
            </Col>
            <Col width="one-quarter">
              <a
                className={styles.refLink}
                data-cy="linkAbout"
                href="https://tis-support.hee.nhs.uk/about-tis/"
                target="_blank"
                rel="noopener noreferrer"
              >
                About
              </a>
            </Col>
            <Col width="one-quarter">
              <a
                className={styles.refLink}
                data-cy="linkPrivacyPolicy"
                href="https://www.hee.nhs.uk/about/privacy-notice"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy &amp; Cookies Policy
              </a>
            </Col>
          </Row>
        </Footer.List>
        <Footer.Copyright data-cy="copyrightText">
          &copy; Health Education England
        </Footer.Copyright>
        {appVersion ? (
          <Footer.List>
            <Footer.ListItem>
              <span
                data-cy="versionText"
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