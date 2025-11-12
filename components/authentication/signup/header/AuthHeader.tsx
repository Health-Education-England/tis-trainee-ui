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
              <strong>Issues with Google email addresses</strong> have been
              reported with users unable to sign in or create an account using
              their Google email.
            </p>
            <p className="nhsuk-body nhsuk-u-margin-bottom-0">
              We are working to resolve this issue as soon as possible and will
              update this notice when it is fixed.
            </p>
          </div>
        </View>
      </Flex>
    </>
  );
};
