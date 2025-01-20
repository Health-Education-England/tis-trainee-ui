import React from "react";
import { Redirect } from "react-router-dom";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import DataSourceMsg from "../common/DataSourceMsg";
import style from "../Common.module.scss";
import { Fieldset } from "nhsuk-react-components";
import { ProfilePanels } from "../profile/ProfilePanels";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { useProfile } from "../../utilities/hooks/useProfile";

type ProfilePageProps = {
  title: string;
  profileName: TraineeProfileName;
  warningText: string;
};

export function ProfilePage({
  title,
  profileName,
  warningText
}: Readonly<ProfilePageProps>) {
  const { preferredMfa } = useProfile();

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  return (
    <>
      <PageTitle title={title} />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy={`${profileName.toLowerCase()}Heading`}
        >
          {title}
        </Fieldset.Legend>
      </Fieldset>
      <DataSourceMsg />
      <ProfilePanels
        profileName={profileName}
        dataSelector={selectTraineeProfile}
        title={title}
        warningText={warningText}
        showTitle={false}
      />
    </>
  );
}
