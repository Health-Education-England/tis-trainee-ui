import { Footer } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";

interface TSSFooterProps {
  appVersion: string;
}

const TSSFooter = ({ appVersion }: TSSFooterProps) => {
  return (
    <Footer>
      <Footer.Meta>
        <Footer.ListItem
          asElement={NavLink}
          data-cy="linkSupport"
          href="/support"
          to="/support"
        >
          Support
        </Footer.ListItem>
        <Footer.ListItem
          data-cy="linkAbout"
          href="https://tis-support.hee.nhs.uk/about-tis/"
          rel="noopener noreferrer"
          target="_blank"
        >
          About
        </Footer.ListItem>
        <Footer.ListItem
          data-cy="linkPrivacyPolicy"
          href="https://www.hee.nhs.uk/about/privacy-notice"
          rel="noopener noreferrer"
          target="_blank"
        >
          Privacy & Cookies Policy
        </Footer.ListItem>
        <Footer.Copyright data-cy="copyrightText">
          &copy; NHS England
          {appVersion && (
            <span
              className="nhsuk-u-display-block nhsuk-u-margin-top-2"
              data-cy="versionText"
            >{`version: ${appVersion}`}</span>
          )}
        </Footer.Copyright>
      </Footer.Meta>
    </Footer>
  );
};

export default TSSFooter;
