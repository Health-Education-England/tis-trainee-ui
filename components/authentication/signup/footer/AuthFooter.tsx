import { Footer } from "nhsuk-react-components";

export const AuthFooter = (): JSX.Element => {
  return (
    <Footer>
      <Footer.Meta>
        <Footer.ListItem href="https://tis-support.hee.nhs.uk/about-tis/">
          About
        </Footer.ListItem>
        <Footer.ListItem href="https://www.hee.nhs.uk/about/privacy-notice">
          Privacy & Cookies
        </Footer.ListItem>
        <Footer.Copyright />
      </Footer.Meta>
    </Footer>
  );
};
