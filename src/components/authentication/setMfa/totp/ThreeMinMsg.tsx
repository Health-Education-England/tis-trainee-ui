import { WarningCallout } from "nhsuk-react-components";

const ThreeMinMsg = () => {
  return (
    <WarningCallout label="Important">
      <p>
        On the next screen you will have <strong>3 minutes</strong> to scan a QR
        code using your Authenticator App on your phone before it expires and
        you return to this screen to start again.
      </p>
      <p>
        Before proceeding, please have your phone to hand and remove any
        existing 'NHS TIS Self-Service' accounts from your Authenticator App.
      </p>
    </WarningCallout>
  );
};

export default ThreeMinMsg;
