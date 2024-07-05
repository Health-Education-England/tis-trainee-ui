import { Flex, View } from "@aws-amplify/ui-react";
import styles from "../../Auth.module.scss";
import { NHSEnglandLogoWhite } from "../../../../public/NHSEnglandLogoWhite";
import GlobalAlert from "../../../main/GlobalAlert";

const AuthHeader = (): JSX.Element => {
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
        </View>
      </Flex>

      <div className="app-signin-alert">
        <p data-cy="authAlert">
          We are currently having issues with Support emails.
          <br />
          Visit our{" "}
          <a href="https://tis-support.hee.nhs.uk/trainees/" target="_new">
            Support page
          </a>{" "}
          for details.
        </p>
      </div>
    </>
  );
};

export default AuthHeader;
