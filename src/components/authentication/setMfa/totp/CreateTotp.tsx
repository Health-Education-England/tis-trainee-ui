import { Fieldset } from "nhsuk-react-components";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import Loading from "../../../common/Loading";
import VerifyTotp from "./VerifyTotp";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Redirect } from "react-router-dom";
import InstallTotp from "./InstallTotp";
import DecideTotp from "./DecideTotp";
import { incrementTotpSection } from "../../../../redux/slices/userSlice";

interface ICreateTotp {
  user: CognitoUser | any;
  mfa: string;
}

interface ITotpSection {
  component: React.FunctionComponent<{
    user: any;
    mfa: string;
    history: string[];
    handleSectionSubmit: () => void;
  }>;
  title: string;
}

const CreateTotp = (
  { user, mfa }: ICreateTotp,
  { history }: { history: string[] }
) => {
  const dispatch = useAppDispatch();
  const totpSection = useAppSelector(state => state.user.totpSection);
  const totpSections: ITotpSection[] = [
    {
      component: DecideTotp,
      title: "Already have an Authenticator App?"
    },
    {
      component: InstallTotp,
      title: "Downloading & installing your Authenticator App"
    },
    {
      component: VerifyTotp,
      title: "Adding TIS Self-Service account to your Authenticator App"
    }
  ];

  const currentMfa = useAppSelector(state => state.user.currentMfa);

  const handleSectionSubmit = () => {
    dispatch(incrementTotpSection());
  };

  const totpSectionProps = {
    user,
    mfa,
    history,
    handleSectionSubmit
  };

  let content;

  if (currentMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  if (totpSection < totpSections.length + 1) {
    content = (
      <main>
        <Fieldset.Legend size="l">
          {totpSections[totpSection - 1].title}
        </Fieldset.Legend>
        <div className="form-wrapper">
          <section>
            <div className="page-wrapper">
              {totpSection < totpSections.length + 1 ? (
                React.createElement(
                  totpSections[totpSection - 1].component,
                  totpSectionProps
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

export default CreateTotp;
