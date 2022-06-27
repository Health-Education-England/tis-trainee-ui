import React from "react";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import VerifySms from "./VerifySms";
import ConfirmSms from "./ConfirmSms";
import { CognitoUser } from "amazon-cognito-identity-js";
import SectionGenerator from "../../../common/SectionGenerator";
import history from "../../../navigation/history";
import { Redirect } from "react-router-dom";
interface ICreateSMS {
  user: CognitoUser | any;
  mfa: string;
}

interface ISmsSection {
  component: React.FunctionComponent<{
    user: CognitoUser | any;
    mfa: string;
  }>;
  title: string;
}

const CreateSms = ({ user, mfa }: ICreateSMS) => {
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
    mfa
  };

  let content;

  if (tempMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  if (smsSection < smsSections.length + 1) {
    content = (
      <SectionGenerator
        history={history}
        path="/mfa"
        section={smsSection}
        sectionsArr={smsSections}
        sectionProps={smsSectionProps}
      />
    );
  }

  return <div>{content}</div>;
};

export default CreateSms;
