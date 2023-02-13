import { Flex, View } from "@aws-amplify/ui-react";
import { NHSHEELogoRev } from "../../../../public/NHSHEELogoRev";
import styles from "../../Auth.module.scss";

const AuthHeader = (): JSX.Element => {
  return (
    <>
      <Flex className={styles.authLogo}>
        <NHSHEELogoRev className={styles.authLogo} data-cy="authLogo" />
      </Flex>
      <Flex className={styles.authTitle}>
        <View>
          <h1 data-cy="authTitle">TIS Self-Service</h1>
        </View>
      </Flex>
      <Flex>
        <div className={styles.authMessage}>
          This application is currently in <i>private beta</i>. You should sign
          up and log in only if you have received an email inviting you to do
          so.
        </div>
      </Flex>
    </>
  );
};

export default AuthHeader;
