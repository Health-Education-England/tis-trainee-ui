import React from "react";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { ProfilePage } from "../profile/ProfilePage";
import { getProfilePanelFutureWarningText } from "../../utilities/Constants";

export const Programmes = () => (
  <ProfilePage
    title="Programmes"
    profileName={TraineeProfileName.Programmes}
    warningText={getProfilePanelFutureWarningText("programme memberships")}
  />
);
