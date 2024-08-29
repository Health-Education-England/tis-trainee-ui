import { ProgrammeMembership } from "./ProgrammeMembership";
import { Placement } from "./Placement";
import { PersonalDetails } from "./PersonalDetails";
import { IDateBoxed } from "./IDateBoxed";

export interface TraineeProfile {
  traineeTisId: string;
  personalDetails: PersonalDetails;
  programmeMemberships: ProgrammeMembership[];
  placements: Placement[];
}

export type ProfileType = IDateBoxed;

export enum TraineeProfileName {
  Placements = "placements",
  Programmes = "programmeMemberships"
}
