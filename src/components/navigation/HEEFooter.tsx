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
          <Footer.ListItem>
            <Row>
              <Col width="one-third">
                <NavLink className={styles.refLink} to={"/support"}>
                  Contact us
                </NavLink>
              </Col>
              <Col width="one-third">
                <a
                  className={styles.refLink}
                  data-cy="linkAbout"
                  href="https://www.hee.nhs.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About
                </a>
              </Col>
              <Col width="one-third">
                <a
                  className={styles.refLink}
                  data-cy="linkPrivacyPolicy"
                  href="https://www.hee.nhs.uk/about/privacy-notice"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy &amp; cookie policy
                </a>
              </Col>
            </Row>
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
