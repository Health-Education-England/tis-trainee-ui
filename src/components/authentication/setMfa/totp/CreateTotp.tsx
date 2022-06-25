import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import VerifyTotp from "./VerifyTotp";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Redirect, useHistory } from "react-router-dom";
import InstallTotp from "./InstallTotp";
import DecideTotp from "./DecideTotp";
import { incrementTotpSection } from "../../../../redux/slices/userSlice";
import SectionGenerator from "../../../common/SectionGenerator";
interface ICreateTotp {
  user: CognitoUser | any;
  mfa: string;
}
interface ITotpSection {
  component: React.FunctionComponent<{
    user: any;
    mfa: string;
    handleSectionSubmit: () => void;
  }>;
  title: string;
}

const CreateTotp = ({ user, mfa }: ICreateTotp) => {
  let history = useHistory();
  const dispatch = useAppDispatch();
  const totpSection = useAppSelector(state => state.user.totpSection);
  const totpSections: ITotpSection[] = [
    {
      component: DecideTotp,
      title: ""
    },
    {
      component: InstallTotp,
      title: ""
    },
    {
      component: VerifyTotp,
      title: ""
    }
  ];

  const tempMfa = useAppSelector(state => state.user.tempMfa);

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

  if (tempMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  if (totpSection < totpSections.length + 1) {
    content = (
      <SectionGenerator
        history={history}
        path="/mfa"
        section={totpSection}
        sectionsArr={totpSections}
        sectionProps={totpSectionProps}
      />
    );
  }

  return <div>{content}</div>;
};

export default CreateTotp;