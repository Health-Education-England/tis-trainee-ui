import { CheckboxField, Text, useAuthenticator } from "@aws-amplify/ui-react";

export const AuthCheckboxFields = () => {
  const { validationErrors } = useAuthenticator();
  return (
    <>
      <div data-cy="checkboxPrivacy">
        <CheckboxField
          errorMessage={validationErrors.yesToPrivacy as string}
          hasError={!!validationErrors.yesToPrivacy}
          name="yesToPrivacy"
          value="yes"
          label="I agree with the Privacy & Cookies Policy"
          data-cy="checkboxPrivacy"
        />
        <Text key="privacyLink" data-cy="privacyLink">
          (See{" "}
          <a
            href="https://www.hee.nhs.uk/about/privacy-notice"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy & Cookies Policy
          </a>{" "}
          for more details.)
        </Text>
      </div>
      <div data-cy="checkboxPilot">
        <CheckboxField
          errorMessage={validationErrors.yesToPilot as string}
          hasError={!!validationErrors.yesToPilot}
          name="yesToPilot"
          value="yes"
          label="I received a Welcome email from TIS inviting me to create an account"
        />
      </div>
    </>
  );
};
