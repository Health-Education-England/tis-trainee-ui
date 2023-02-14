import { Heading } from "@aws-amplify/ui-react";

const AuthHeading = (headerText: string): JSX.Element => {
  return (
    <Heading
      padding="32px 0 0 30px"
      level={3}
      fontWeight="normal"
      color="#047D95"
    >
      {headerText}
    </Heading>
  );
};

export default AuthHeading;
