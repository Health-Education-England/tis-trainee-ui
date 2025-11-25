import { Footer } from "nhsuk-react-components";

interface TSSFooterProps {
  appVersion: string;
}

const TSSFooter = ({ appVersion }: TSSFooterProps) => {
  return (
    <>
      <Footer>
        <Footer.Meta>
          <Footer.ListItem href="https://tis-support.hee.nhs.uk/about-tis/">
            About
          </Footer.ListItem>
          <Footer.ListItem href="https://www.hee.nhs.uk/about/privacy-notice">
            Privacy & Cookies
          </Footer.ListItem>
          <Footer.Copyright>
            &copy; NHS England
            <div
              style={{ marginTop: "0.5rem" }}
            >{`App version: ${appVersion}`}</div>
          </Footer.Copyright>
        </Footer.Meta>
      </Footer>
    </>
  );
};

export default TSSFooter;
