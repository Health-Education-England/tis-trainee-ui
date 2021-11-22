import { Divider, Flex, Heading, Image, View } from "@aws-amplify/ui-react";
import logo from "../../static/images/nhs-hee-logo-rev.svg";
import styles from "./Auth.module.scss";

const headerLinks = [
  { name: "Support", href: "https://tis-support.hee.nhs.uk/" },
  { name: "About", href: "https://tis-support.hee.nhs.uk/about-tis/" },
  {
    name: "Privacy & Cookies",
    href: "https://www.hee.nhs.uk/about/privacy-notice"
  }
];

const addHeaderLinks = (): JSX.Element[] => {
  return headerLinks.map(link => (
    <a
      key={link.name}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.AuthHeaderLink}
    >
      {link.name}
    </a>
  ));
};

const AuthHeader = (): JSX.Element => {
  return (
    <View textAlign="left" width="100%" backgroundColor="#005EB8">
      <Image
        src={logo}
        alt="NHS Health Education England Trainee Self-Service"
        width="230px"
        height="48px"
        padding="16px 0 0 32px"
      ></Image>
      <Heading
        level={4}
        color="white"
        fontWeight="normal"
        padding="0 0 16px 32px"
      >
        Trainee Self-Service
      </Heading>
      <Divider size="small" />
      <Flex justifyContent="space-between" padding="12px 32px">
        {addHeaderLinks()}
      </Flex>
    </View>
  );
};

export default AuthHeader;
