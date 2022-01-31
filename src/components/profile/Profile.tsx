import PersonalDetailsComponent from "./personal-details/PersonalDetailsComponent";
import Programmes from "./programmes/Programmes";
import Placements from "./placements/Placements";
import { Fieldset, Details } from "nhsuk-react-components";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";

import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import Loading from "../common/Loading";
import ErrorPage from "../common/ErrorPage";
import DataSourceMsg from "../common/DataSourceMsg";

const Profile = () => {
  const traineeProfileData = useAppSelector(selectTraineeProfile);
  const traineeProfileDataStatus = useAppSelector(
    state => state.traineeProfile.status
  );
  const traineeProfileDataError = useAppSelector(
    state => state.traineeProfile.error
  );
  let content;

  if (traineeProfileDataStatus === "loading") return <Loading />;
  else if (traineeProfileDataStatus === "succeeded")
    content = (
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
  else if (
    traineeProfileDataStatus === "failed" ||
    !traineeProfileData.traineeTisId
  )
    content = <ErrorPage error={traineeProfileDataError}></ErrorPage>;

  return <div>{content}</div>;
};

export default Profile;
