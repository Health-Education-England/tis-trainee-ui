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

export const SupportLinks = () => {
  return (
    <>
      <div className="signInSupportLinks">
        <b>Can't access your account? </b><a href="https://tis-support.hee.nhs.uk/trainees/support-faq/" target="_blank">Please read our FAQ's</a><br/>
        <b>Still having issues? </b><a className="supportEmail" title="Please provide your GMC no. and brief description of the issue include screenshots if necessary" href="mailto:tis.support@hee.nhs.uk?subject=TSS Sign Up Issue&body=GMC No.: <your GMC number>%0D%0AIssue description: <brief description of the issue include screenshots if necessary>">Please click here to email Technical Support</a>
      </div>
    </>
  );
};