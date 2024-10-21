import { Flex, View } from "@aws-amplify/ui-react";
import styles from "../../Auth.module.scss";
import { NHSEnglandLogoWhite } from "../../../../public/NHSEnglandLogoWhite";

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
      <section className={styles.authAlert} data-cy="authAlert">
        <h1 className={styles.authSubheader}>
          <b>Foundation and Public Health doctors </b>
        </h1>
        <p>
          Apologies: The email advising you to sign-up on TIS Self-Service was
          sent in error.
        </p>
        <p>Please DO NOT create an account.</p>
        <p>
          For more details,{" "}
          <a
            className={styles.supportLink}
            href="https://tis-support.hee.nhs.uk/trainees/"
            target="_new"
          >
            visit the TIS Support page
          </a>
        </p>
      </section>
    </>
  );
};

export default AuthHeader;
