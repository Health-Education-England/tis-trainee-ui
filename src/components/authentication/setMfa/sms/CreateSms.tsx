import React from "react";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import VerifySms from "./VerifySms";
import ConfirmSms from "./ConfirmSms";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Redirect } from "react-router-dom";
import SectionGenerator from "../../../common/SectionGenerator";

interface ICreateSMS {
  user: CognitoUser | any;
  mfa: string;
}

interface ISmsSection {
  component: React.FunctionComponent<{
    user: CognitoUser | any;
    mfa: string;
    history: string[];
  }>;
  title: string;
}

const CreateSms = (
  { user, mfa }: ICreateSMS,
  { history }: { history: string[] }
) => {
  const smsSection: number = useAppSelector(state => state.user.smsSection);
  const smsSections: ISmsSection[] = [
    {
      component: VerifySms,
      title: ""
    },
    {
      component: ConfirmSms,
      title: ""
    }
  ];

  const tempMfa = useAppSelector(state => state.user.tempMfa);

  const smsSectionProps = {
    user,
    mfa,
    history
  };

  let content;

  if (tempMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  if (smsSection < smsSections.length + 1) {
    content = (
      <SectionGenerator
        section={smsSection}
        sectionsArr={smsSections}
        sectionProps={smsSectionProps}
      />
    );
  }

  return <div>{content}</div>;
};

export default CreateSms;
