import { ProgrammeMembership } from "./ProgrammeMembership";
import { Placement } from "./Placement";
import { PersonalDetails } from "./PersonalDetails";

export interface TraineeProfile {
  traineeTisId: string;
  personalDetails: PersonalDetails;
  programmeMemberships: ProgrammeMembership[];
  placements: Placement[];
}

export type ProfileType = Placement | ProgrammeMembership;

export enum TraineeProfileName {
  Placements = "placements",
  Programmes = "programmeMemberships"
}
