import React from "react";
import { Redirect } from "react-router-dom";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import DataSourceMsg from "../common/DataSourceMsg";
import Loading from "../common/Loading";
import style from "../Common.module.scss";
import { Fieldset } from "nhsuk-react-components";
import { ProfilePanels } from "../profile/ProfilePanels";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { useProfile } from "../../utilities/hooks/useProfile";
import { CredentialDspType } from "../../models/Dsp";

type ProfilePageProps = {
  title: string;
  profileName: TraineeProfileName;
  warningText: string;
  fetchType: CredentialDspType;
};

export function ProfilePage({
  title,
  profileName,
  warningText,
  fetchType
}: Readonly<ProfilePageProps>) {
  const { preferredMfa, dspStatus } = useProfile(fetchType);

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }

  if (dspStatus === "loading") {
    return <Loading />;
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
