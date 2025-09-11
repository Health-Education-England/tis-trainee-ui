import { ProgrammeMembership } from "./ProgrammeMembership";
import { Placement } from "./Placement";
import { PersonalDetails } from "./PersonalDetails";
import { IDateBoxed } from "./IDateBoxed";

export type Qualification = {
  tisId: string;
  qualification: string;
  dateAttained: string; // ISO date
  medicalSchool: string;
};
export interface TraineeProfile {
  traineeTisId: string;
  personalDetails: PersonalDetails;
  qualifications: Qualification[];
  programmeMemberships: ProgrammeMembership[];
  placements: Placement[];
}

export type ProfileType = IDateBoxed;

export enum TraineeProfileName {
  Placements = "placements",
  Programmes = "programmeMemberships"
}

export type Signature = {
  signedAt: string; // ISO dates
  validUntil: string;
  hmac: string;
};
