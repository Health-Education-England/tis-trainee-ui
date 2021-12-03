import { Flex, Image, View } from "@aws-amplify/ui-react";
import logo from "../../../../static/images/nhs-hee-logo-rev.svg";
import styles from "../Auth.module.scss";

const AuthHeader = (): JSX.Element => {
  return (
    <>
      <Flex className={styles.authLogo}>
        <Image
          data-cy="authLogo"
          src={logo}
          alt="NHS Health Education England Trainee Self-Service"
          width="230px"
          height="48px"
        ></Image>
      </Flex>
      <Flex className={styles.authTitle}>
        <View>
          <h1 data-cy="authTitle">Trainee Self-Service</h1>
        </View>
      </Flex>
    </>
  );
};

export default AuthHeader;
