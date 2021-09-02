import CookieConsent from "react-cookie-consent";

interface HEEFooterProps {
  showPrivacyPolicy: any;
}

export const Cookie = ({ showPrivacyPolicy }: HEEFooterProps) => {
  return (
    <>
      <CookieConsent
        // debug={true}  for testing
        disableStyles={true}
        buttonClasses="nhsuk-button nhsuk-button--reverse"
        buttonWrapperClasses="cookieConsent-button-wrapper"
        contentClasses="cookieConsent-content"
        overlayClasses="cookieConsent-overlay"
        overlay
        extraCookieOptions={{ SameSite: "Lax" }}
        location="bottom"
        buttonText="Accept and close"
      >
        <h3>Your consent is required.</h3>
        <p>
          We use necessary cookies to make our site work and analytics cookies
          to help us improve it. In order use this site, you must agree to the
          storing of such cookies on your device by clicking 'Accept and close'.
          To learn more about how we use cookies and your data, please see our{" "}
          <a style={{ color: "white" }} href="/" onClick={showPrivacyPolicy}>
            privacy policy
          </a>
          .
        </p>
      </CookieConsent>
    </>
  );
};
