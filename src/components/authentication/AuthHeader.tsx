import { Flex, Image, Text, useTheme, View } from "@aws-amplify/ui-react";
import logo from "../../static/images/HEE_logo.svg";
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
    <Text>
      <a
        key={link.name}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.AuthHeaderLink}
      >
        {link.name}
      </a>
    </Text>
  ));
};

const AuthHeader = (): JSX.Element => {
  const { tokens } = useTheme();
  return (
    <>
      <View textAlign="center" padding={tokens.space.small}>
        <Image
          src={logo}
          alt="NHS Health Education England Trainee Self-Service"
          width="230px"
          height="48px"
        ></Image>
        <p
          style={{
            fontSize: "26px",
            margin: 0,
            lineHeight: "16px",
            fontWeight: 600
          }}
        >
          Trainee Self-Service
        </p>
      </View>
      <Flex justifyContent="space-between" padding="10px 32px 8px 32px">
        {addHeaderLinks()}
      </Flex>
    </>
  );
};

export default AuthHeader;
