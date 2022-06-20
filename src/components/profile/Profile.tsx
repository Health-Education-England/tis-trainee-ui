import PersonalDetailsComponent from "./personal-details/PersonalDetailsComponent";
import Programmes from "./programmes/Programmes";
import Placements from "./placements/Placements";
import { Fieldset, Details } from "nhsuk-react-components";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";

import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import DataSourceMsg from "../common/DataSourceMsg";
import { Redirect } from "react-router-dom";

const Profile = ({ mfa }: any) => {
  const traineeProfileData = useAppSelector(selectTraineeProfile);

  if (mfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
  const content = (
    <div id="profile">
      <PageTitle title="Profile" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend isPageHeading style={{ color: "#005EB8" }}>
          Profile
        </Fieldset.Legend>
      </Fieldset>
      <DataSourceMsg />
      <Details.ExpanderGroup>
        {traineeProfileData.personalDetails && (
          <PersonalDetailsComponent
            personalDetails={traineeProfileData.personalDetails}
          />
        )}
        {traineeProfileData.placements && (
          <Placements placements={traineeProfileData.placements}></Placements>
        )}
        {traineeProfileData.programmeMemberships && (
          <Programmes
            programmeMemberships={traineeProfileData.programmeMemberships}
          ></Programmes>
        )}
      </Details.ExpanderGroup>
    </div>
  );
  return <div>{content}</div>;
};

export default Profile;
