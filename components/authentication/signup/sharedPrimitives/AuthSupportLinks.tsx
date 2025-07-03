import { Flex, Text } from "@aws-amplify/ui-react";
import { getUserAgentInfo } from "../../../../utilities/UserUtilities";

type ActionType = "Sign in" | "Sign up";

type AuthSupportLinksProps = {
  action: ActionType;
};

export const AuthSupportLinks = ({ action }: AuthSupportLinksProps) => {
  return (
    <>
      <Flex>
        <Text fontSize="16px">
          Can&apos;t access your account?{" "}
          <a
            href={`https://tis-support.hee.nhs.uk/trainees/${
              action === "Sign in" ? "when-i-log-in" : "when-i-sign-up"
            }/`}
            target="_blank"
            rel="noreferrer"
          >
            Please read our FAQ&apos;s
          </a>
        </Text>
      </Flex>
      <Flex>
        <Text fontSize={"16px"}>
          Still having issues?{" "}
          <a
            title="Please provide your GMC no. and brief description of the issue (include screenshots if necessary)"
            href={`mailto:england.tis.support@nhs.net?subject=TSS Tech Support Query (GMC No.: <your GMC number>)&body=<Please provide brief description of the issue (include screenshots if necessary)>%0A%0AReferred Page:%0A${action}%0A%0ABrowser and OS Info:%0A${getUserAgentInfo()}%0A%0A`}
          >
            Please email Technical Support
          </a>
        </Text>
      </Flex>
    </>
  );
};
