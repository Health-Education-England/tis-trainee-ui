import { Fieldset } from "nhsuk-react-components";
import React from "react";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import Loading from "../../../common/Loading";
import VerifySms from "./VerifySms";
import ConfirmSms from "./ConfirmSms";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Redirect } from "react-router-dom";

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
      title: "Link your mobile number to TIS Self-Service"
    },
    {
      component: ConfirmSms,
      title: "Confirm your identity to log in to TIS Self-Service"
    }
  ];

  const currentMfa = useAppSelector(state => state.user.currentMfa);

  const smsSectionProps = {
    user,
    mfa,
    history
  };

  let content;

  if (currentMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  if (smsSection < smsSections.length + 1) {
    content = (
      <main>
        <Fieldset.Legend size="l">
          {smsSections[smsSection - 1].title}
        </Fieldset.Legend>
        <div className="form-wrapper">
          <section>
            <div className="page-wrapper">
              {smsSection < smsSections.length + 1 ? (
                React.createElement(
                  smsSections[smsSection - 1].component,
                  smsSectionProps
                )
              ) : (
                <Loading />
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return <div>{content}</div>;
};

export default CreateSms;
