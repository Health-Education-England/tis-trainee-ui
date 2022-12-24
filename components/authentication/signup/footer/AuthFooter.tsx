import { Flex, View, Text } from "@aws-amplify/ui-react";
import dayjs from "dayjs";
import styles from "../../Auth.module.scss";
const AuthFooter = (): JSX.Element => {
  const footerLinks = [
    { name: "Support", href: "https://tis-support.hee.nhs.uk/" },
    { name: "About", href: "https://tis-support.hee.nhs.uk/about-tis/" },
    {
      name: "Privacy & Cookies",
      href: "https://www.hee.nhs.uk/about/privacy-notice"
    }
  ];
  const addFooterLinks = (): JSX.Element[] => {
    return footerLinks.map((link, index) => (
      <Text key={index}>
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          {link.name}
        </a>
      </Text>
    ));
  };

  return (
    <>
      <Flex className={styles.authFooterLinks}>{addFooterLinks()}</Flex>
      <Flex className={styles.authFooterText}>
        <View data-cy="footerCopy">
          &copy; Health Education England {dayjs().year()}
        </View>
      </Flex>
    </>
  );
};

export default AuthFooter;
