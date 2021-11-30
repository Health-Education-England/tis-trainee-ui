import { View } from "@aws-amplify/ui-react";

const AuthFooter = (): JSX.Element => {
  return (
    <View textAlign="center" padding="16px">
      <p
        style={{
          color: "#5c6670",
          fontSize: "16px",
          margin: 0,
          fontWeight: 600
        }}
      >
        &copy; Health Education England
      </p>
    </View>
  );
};

export default AuthFooter;
