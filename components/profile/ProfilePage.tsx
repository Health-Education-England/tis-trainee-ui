import React from "react";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import DataSourceMsg from "../common/DataSourceMsg";
import style from "../Common.module.scss";
import { Fieldset } from "nhsuk-react-components";
import { ProfilePanels } from "../profile/ProfilePanels";
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
        title={title}
        warningText={warningText}
        showTitle={false}
      />
    </>
  );
}
