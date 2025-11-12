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
              <strong>The issue affecting Google email addresses</strong> and
              not being able to sign in or create an account has now been
              resolved.
            </p>
            <p className="nhsuk-body nhsuk-u-margin-bottom-0">
              Thank you for your patience during this time and our apologies for
              any inconvenience caused.
            </p>
          </div>
        </View>
      </Flex>
    </>
  );
};
