import PersonalDetailsComponent from "./PersonalDetailsComponent";
import { Fieldset, Details } from "nhsuk-react-components";

import { useAppDispatch } from "../../redux/hooks/hooks";
import { fetchTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import { useEffect } from "react";

const Profile = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTraineeProfileData());
  }, []);

  const content = (
    <div id="profile">
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          style={{ color: "#005EB8" }}
          data-cy="profileHeading"
        >
          Profile
        </Fieldset.Legend>
      </Fieldset>
      <Details.ExpanderGroup>
        <PersonalDetailsComponent />
      </Details.ExpanderGroup>
    </div>
  );
  return <div>{content}</div>;
};

export default Profile;
