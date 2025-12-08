import { ProgrammeMembership } from "./ProgrammeMembership";
import { Placement } from "./Placement";
import { PersonalDetails } from "./PersonalDetails";

export type ProfilePanelDefaults = {
  tisId?: string;
  startDate: Date | string;
  endDate: Date | string;
};

export type Qualification = {
  tisId: string;
  qualification: string;
  dateAttained: string; // ISO date
  medicalSchool: string;
};
export type TraineeProfile = {
  traineeTisId: string;
  personalDetails: PersonalDetails;
  qualifications: Qualification[];
  programmeMemberships: ProgrammeMembership[];
  placements: Placement[];
};

export type ProfileType = Placement | ProgrammeMembership;

export type ProfileDateBoxedGroup = {
  future: ProfileType[];
  upcoming: ProfileType[];
  current: ProfileType[];
  past: ProfileType[];
};

export enum TraineeProfileName {
  Placements = "placements",
  Programmes = "programmeMemberships"
}

export type Signature = {
  signedAt: string; // ISO dates
  validUntil: string;
  hmac: string;
};
