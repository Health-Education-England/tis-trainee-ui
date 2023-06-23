import { Button, View } from "@aws-amplify/ui-react";
import { MouseEventHandler } from "react";
import { getUserAgentInfo } from "../../../../utilities/UserUtilities";

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

export const SupportLinks = (action: string) => {
  return (
    <>
      <div className="signInSupportLinks" data-cy="signInSupportLinks">
        <b>Can't access your account? </b>
        <a
        href="https://tis-support.hee.nhs.uk/trainees/support-faq/" target="_blank"
        >
          Please read our FAQ's
        </a>
        <br/>
        <b>Still having issues? </b>
        <a className="supportEmail" 
          title="Please provide your GMC no. and brief description of the issue include screenshots if necessary" 
          href={`mailto:tis.support@hee.nhs.uk?subject=TSS Tech Support Query (GMC No.: <your GMC number>)&body=<Please provide brief description of the issue include screenshots if necessary>%0A%0AReferred Page:%0A${action}%0A%0ABrowser and OS Info:%0A${getUserAgentInfo()}%0A%0A`}
        >
          Please click here to email Technical Support
        </a>
      </div>
    </>
  );
};