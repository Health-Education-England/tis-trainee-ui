import React from "react";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import DataSourceMsg from "../common/DataSourceMsg";
import style from "../Common.module.scss";
import { Fieldset, Legend } from "nhsuk-react-components";
import { ProfilePanels } from "../profile/ProfilePanels";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { TraineeProfileName } from "../../models/TraineeProfile";

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
  return (
    <>
      <PageTitle title={title} />
      <ScrollTo />
      <Fieldset>
        <Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy={`${profileName.toLowerCase()}Heading`}
          size="xl"
        >
          {title}
        </Legend>
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
