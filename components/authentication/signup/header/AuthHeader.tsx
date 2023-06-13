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
    </>
  );
};

export default AuthHeader;
