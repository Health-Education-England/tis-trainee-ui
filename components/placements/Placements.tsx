import React from "react";
import { TraineeProfileName } from "../../models/TraineeProfile";
import { ProfilePage } from "../profile/ProfilePage";
import { getProfilePanelFutureWarningText } from "../../utilities/Constants";

export const Placements = () => (
  <ProfilePage
    title="Placements"
    profileName={TraineeProfileName.Placements}
    warningText={getProfilePanelFutureWarningText("placements")}
  />
);
