import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import VerifyTotp from "./VerifyTotp";
import InstallTotp from "./InstallTotp";
import DecideTotp from "./DecideTotp";
import { incrementTotpSection } from "../../../../redux/slices/userSlice";
import SectionGenerator from "../../../common/SectionGenerator";
import history from "../../../navigation/history";
import { Redirect } from "react-router-dom";

interface ITotpSection {
  component: React.FunctionComponent<{
    handleSectionSubmit: () => void;
  }>;
  title: string;
}

const CreateTotp = () => {
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
