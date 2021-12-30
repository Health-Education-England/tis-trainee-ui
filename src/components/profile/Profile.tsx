import PersonalDetailsComponent from "./personal-details/PersonalDetailsComponent";
import Programmes from "./programmes/Programmes";
import Placements from "./placements/Placements";
import { Fieldset, Details } from "nhsuk-react-components";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";

import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";

const Profile = () => {
  const traineeProfileData = useAppSelector(selectTraineeProfile);

  return (
    <div id="profile">
      <PageTitle title="Profile" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend isPageHeading style={{ color: "#005EB8" }}>
          Profile
        </Fieldset.Legend>
      </Fieldset>
      <Details.ExpanderGroup>
        {traineeProfileData?.personalDetails && (
          <>
            <PersonalDetailsComponent
              personalDetails={traineeProfileData.personalDetails}
            />
            <Placements placements={traineeProfileData.placements}></Placements>
            <Programmes
              programmeMemberships={traineeProfileData.programmeMemberships}
            ></Programmes>
          </>
        )}
      </Details.ExpanderGroup>
    </div>
  );
};

export default Profile;
