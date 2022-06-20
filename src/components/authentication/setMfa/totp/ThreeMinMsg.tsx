import { WarningCallout } from "nhsuk-react-components";

const ThreeMinMsg = () => {
  return (
    <WarningCallout label="Important">
      <p>
        On the next screen you will have <strong>3 minutes</strong> to scan a QR
        code using your Authenticator App on your phone and use the 6-digit code
        generated by your app before the <strong>QR code expires</strong> so
        please have your phone to hand before proceeding.
      </p>
    </WarningCallout>
  );
};

export default ThreeMinMsg;
