import { Footer } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";
import styles from "./TSSFooter.module.scss";

interface TSSFooterProps {
  appVersion: string;
}

const TSSFooter = ({ appVersion }: TSSFooterProps) => {
  return (
    <Footer className={styles.footerWrapper}>
      <Footer.Content width="full">
        <nav className={styles.footerNav} aria-label="Footer navigation">
          <ul className={styles.footerList}>
            <li>
              <NavLink to="/support" data-cy="linkSupport">
                Support
              </NavLink>
            </li>

            <li>
              <a
                href="https://tis-support.hee.nhs.uk/about-tis/"
                target="_blank"
                rel="noopener noreferrer"
                data-cy="linkAbout"
              >
                About
              </a>
            </li>

            <li>
              <a
                href="https://www.hee.nhs.uk/about/privacy-notice"
                target="_blank"
                rel="noopener noreferrer"
                data-cy="linkPrivacyPolicy"
              >
                Privacy & Cookies Policy
              </a>
            </li>
            {appVersion && (
              <li className={styles.version} data-cy="versionText">
                Version: {appVersion}
              </li>
            )}
          </ul>
        </nav>
      </Footer.Content>
    </Footer>
  );
};

export default TSSFooter;
