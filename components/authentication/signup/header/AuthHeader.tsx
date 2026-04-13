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
              <strong>Foundation Doctors</strong>
            </p>
            <p className="nhsuk-body nhsuk-u-margin-bottom-0">
              We are aware of an issue affecting foundation doctors, whereby TIS
              Self-Service may incorrectly prompt you to complete Form R and
              Conditions of Joining actions.
            </p>
            <p className="nhsuk-body nhsuk-u-margin-bottom-0">
              Foundation doctors should continue to follow their regional Local
              Office processes and may disregard these prompts within TIS
              Self-service. We are working to resolve this issue, and any
              incorrectly assigned outstanding actions will be removed in due
              course.
            </p>
          </div>
        </View>
      </Flex>
    </>
  );
};
