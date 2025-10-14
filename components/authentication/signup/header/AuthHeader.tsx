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
              <strong>Planned TIS Self-Service upgrade</strong> scheduled for
              15/10/2025 between 00:43 to 01:13.
            </p>
            <p className="nhsuk-body nhsuk-u-margin-bottom-0">
              You may experience some disruption during this time.
            </p>
          </div>
        </View>
      </Flex>
    </>
  );
};
