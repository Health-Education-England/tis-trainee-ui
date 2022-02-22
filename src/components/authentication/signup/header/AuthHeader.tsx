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
          alt="NHS Health Education England TIS Self-Service"
          width="230px"
          height="48px"
        ></Image>
      </Flex>
      <Flex className={styles.authTitle}>
        <View>
          <h1 data-cy="authTitle">TIS Self-Service</h1>
        </View>
      </Flex>
      <Flex>
        <div className={styles.authMessage}>
          This application is currently in the pilot phase.{" "}
          <strong>
            Only trainees who have been invited to partake in this pilot should
            sign up and log in.
          </strong>
        </div>
      </Flex>
    </>
  );
};

export default AuthHeader;
