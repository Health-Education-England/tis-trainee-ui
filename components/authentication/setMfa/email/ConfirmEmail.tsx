import { useState } from "react";
import { Button, Card, Details } from "nhsuk-react-components";
import { useAppDispatch } from "../../../../redux/hooks/hooks";
import history from "../../../navigation/history";
import { ToastType, showToast } from "../../../common/ToastMessage";
import { toastSuccessText } from "../../../../utilities/Constants";
import { updateMFAPreference } from "aws-amplify/auth";
import { getPreferredMfa } from "../../../../redux/slices/userSlice";

const ConfirmEmail = () => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmEmail = async () => {
    setIsSubmitting(true);
    try {
      const mfaPrefObj: { [key: string]: string } = {
        email: "PREFERRED"
      };
      await updateMFAPreference(mfaPrefObj);
      await dispatch(getPreferredMfa());
      history.push("/home");
      showToast(toastSuccessText.getPreferredMfaEmail, ToastType.SUCCESS);
    } catch (error) {
      console.error("Failed to set up Email MFA: ", error);
      showToast(
        "Failed to set up Email MFA. Please try again.",
        ToastType.ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card feature>
        <Card.Content>
          <Card.Heading>Email MFA</Card.Heading>
          <p>Using email as your second authentication factor:</p>
          <ul>
            <li>You will enter your email and password</li>
            <li>Receive a 6-digit verification code via email</li>
            <li>Enter this code to sign in</li>
          </ul>
          <p>
            This adds an extra layer of security to your account and helps
            protect your sensitive information.
          </p>
          <Details>
            <Details.Summary>Why use Email MFA?</Details.Summary>
            <Details.Text>
              <p>
                {`
                Email MFA provides additional security without requiring a
                mobile phone. It is more secure than SMS MFA and it's convenient
                as you can access your email from multiple devices. The
                verification codes expire after a short period, ensuring only
                you can access your account.`}
              </p>
            </Details.Text>
          </Details>
        </Card.Content>
      </Card>
      <Button
        onClick={handleConfirmEmail}
        disabled={isSubmitting}
        data-cy="BtnConfirmEmail"
      >
        {isSubmitting ? "Setting up..." : "Confirm Email MFA"}
      </Button>
    </>
  );
};

export default ConfirmEmail;
