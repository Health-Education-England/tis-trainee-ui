import { Button, View } from "@aws-amplify/ui-react";
import { MouseEventHandler } from "react";

const AuthBtnLink = (
  onClickEvent: MouseEventHandler<HTMLButtonElement> | undefined,
  btnText: string
): JSX.Element => {
  return (
    <View textAlign="center">
      <Button
        fontWeight="bold"
        onClick={onClickEvent}
        size="small"
        variation="link"
      >
        {btnText}
      </Button>
    </View>
  );
};

export default AuthBtnLink;
