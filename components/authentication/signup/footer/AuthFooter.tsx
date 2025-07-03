import { Flex, Text } from "@aws-amplify/ui-react";
import dayjs from "dayjs";
import styles from "../../Auth.module.scss";

const footerLinks = [
  { name: "About", href: "https://tis-support.hee.nhs.uk/about-tis/" },
  {
    name: "Privacy & Cookies",
    href: "https://www.hee.nhs.uk/about/privacy-notice"
  }
];

export const AuthFooter = (): JSX.Element => {
  return (
    <Flex className={styles.authFooterLinks}>
      {footerLinks.map(link => (
        <Text key={link.name}>
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.name}
          </a>
        </Text>
      ))}
      <Text className={styles.authFooterText} data-cy="footerCopy">
        &copy; NHS England {dayjs().year()}
      </Text>
    </Flex>
  );
};
