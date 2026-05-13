import { Flex, View } from "@aws-amplify/ui-react";
import styles from "../../Auth.module.scss";
import { NHSEnglandLogoWhite } from "../../../../public/NHSEnglandLogoWhite";

export const AuthHeader = (): JSX.Element => {
  return (
    <>
      <Flex className={styles.authLogo}>
        <span className={styles.authLogo} data-cy="authLogo">
          <NHSEnglandLogoWhite />
        </span>
      </Flex>
      <Flex className={styles.authTitle}>
        <View>
          <h1 data-cy="authTitle">TIS Self-Service</h1>
          <div className={styles.authNotice} data-cy="authNotice">
            <p className="nhsuk-body nhsuk-u-margin-bottom-2">
              <strong>
                Out-of-date information in some recent Email Notifications
              </strong>
            </p>
            <p className="nhsuk-body nhsuk-u-margin-bottom-2">
              If you have received a Notification from your Local Office saying
              you do not have an account, but you have created and signed in
              successfully, please ignore it.
            </p>
            <p>
              Your old email address may be also be included in the email
              notification for those of you who have recently changed it. Please
              ignore this too and continue to use your new email address to sign
              into TSS.
            </p>
            <p className="nhsuk-body nhsuk-u-margin-bottom-0">
              We will update you when the issue is resolved. Thank you for your
              patience during this time and our apologies for any inconvenience
              caused.
            </p>
          </div>
        </View>
      </Flex>
    </>
  );
};
